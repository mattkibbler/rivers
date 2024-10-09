import App from "@/App";
import DOMTile from "./DOMTile";
import throttle from "@/Helpers/Timing/Throttle";
import TileRegion from "@/Interfaces/TileRegion";
import TileDataPacket from "@/Interfaces/TileDataPacket";

export default class DOMRenderer {
	offset: { x: number; y: number };
	viewPane: HTMLElement;
	app: App;
	tileMap: Map<string, DOMTile>;
	tilePool: DOMTile[];
	visibleContentRegion: TileRegion | null;
	scheduleUpdateVisibleContentRegion: (region: TileRegion) => void;
	constructor(app: App) {
		this.offset = { x: 0, y: 0 };

		this.app = app;

		this.tileMap = new Map();
		this.tilePool = [];

		this.visibleContentRegion = null;
		this.scheduleUpdateVisibleContentRegion = throttle(this.updateVisibleContentRegion, 1000);

		this.viewPane = document.createElement("div");
		this.viewPane.setAttribute("id", "rendererViewPane");
		this.app.tileContainer.appendChild(this.viewPane);
	}
	setOffset(offset: { x: number; y: number }) {
		this.offset.x = offset.x;
		this.offset.y = offset.y;
		this.viewPane.style.transform = `translateX(${this.offset.x}px) translateY(${this.offset.y}px)`;
	}
	setVisibleRegion(visible: TileRegion) {
		// Iterate over current tiles. If they are no longer in view then remove them.
		for (const tile of this.tileMap.values()) {
			if (
				tile.x !== null &&
				tile.y !== null &&
				(tile.x < visible.startX ||
					tile.y < visible.startY ||
					tile.x > visible.endX ||
					tile.y > visible.endY)
			) {
				this.removeTile(tile);
			}
		}
		for (let x = visible.startX; x <= visible.endX; x++) {
			for (let y = visible.startY; y <= visible.endY; y++) {
				this.addTile(x, y);
			}
		}
		if (this.visibleContentRegion === null) {
			this.updateVisibleContentRegion(visible);
		} else {
			this.scheduleUpdateVisibleContentRegion(visible);
		}
	}
	private updateVisibleContentRegion(regionToShow: TileRegion) {
		let newRegionX: TileRegion | null = null;
		let newRegionY: TileRegion | null = null;
		const regionsToLoad: TileRegion[] = [];

		// If no visible content region set then the map is empty so simply load the entire visible region
		if (this.visibleContentRegion === null) {
			regionsToLoad.push(regionToShow);
		} else {
			// If we need to load more tiles on the X axis...
			if (
				regionToShow.startX !== this.visibleContentRegion.startX ||
				regionToShow.endX !== this.visibleContentRegion.endX
			) {
				newRegionX = { startX: 0, startY: 0, endX: 0, endY: 0 };
				// new region is to the left
				if (regionToShow.startX < this.visibleContentRegion.startX) {
					newRegionX.startX = regionToShow.startX;
					newRegionX.endX = this.visibleContentRegion.startX - 1;
					newRegionX.startY = regionToShow.startY;
					newRegionX.endY = regionToShow.endY;
					// new region is to the right
				} else if (regionToShow.endX > this.visibleContentRegion.endX) {
					newRegionX.startX = this.visibleContentRegion.endX + 1;
					newRegionX.endX = regionToShow.endX;
					newRegionX.startY = regionToShow.startY;
					newRegionX.endY = regionToShow.endY;
				}

				regionsToLoad.push(newRegionX);
			}
			// If we need to load more tiles on the Y axis...
			if (
				regionToShow.startY !== this.visibleContentRegion.startY ||
				regionToShow.endY !== this.visibleContentRegion.endY
			) {
				newRegionY = { startX: 0, startY: 0, endX: 0, endY: 0 };
				let startX = regionToShow.startX;
				let endX = regionToShow.endX;
				// If there are also new tiles to load on the x axis, make sure not to include them when selecting new tiles on the Y axis...

				// New regions are to the top and the left
				if (newRegionX && newRegionX.startX < this.visibleContentRegion.startX) {
					startX = newRegionX.endX + 1;
					endX = regionToShow.endX;
					// New regions are to the top and the right
				} else if (newRegionX && newRegionX.endX > this.visibleContentRegion.endX) {
					startX = regionToShow.startX;
					endX = newRegionX.startX - 1;
				}

				// New region to the top
				if (regionToShow.startY < this.visibleContentRegion.startY) {
					newRegionY.startX = startX;
					newRegionY.endX = endX;
					newRegionY.startY = regionToShow.startY;
					newRegionY.endY = this.visibleContentRegion.startY - 1;
					// Else new region to the bottom
				} else if (regionToShow.endY > this.visibleContentRegion.endY) {
					newRegionY.startX = startX;
					newRegionY.endX = endX;
					newRegionY.startY = this.visibleContentRegion.endY + 1;
					newRegionY.endY = regionToShow.endY;
				}

				regionsToLoad.push(newRegionY);
			}
		}

		this.app.tileService
			.loadTileRegions(regionsToLoad)
			.then(this.setTileRegionContent.bind(this));

		this.visibleContentRegion = regionToShow;
	}
	private removeTile(tile: DOMTile) {
		tile.release();
		this.tilePool.push(tile);
		this.tileMap.delete(`${tile.x},${tile.y}`);
	}
	private addTile(x: number, y: number) {
		const tileKey = `${x},${y}`;
		if (!this.tileMap.has(tileKey)) {
			this.tileMap.set(tileKey, this.getTile(x, y)); // Store tile reference
		}
	}
	private getTile(x: number, y: number): DOMTile {
		const tile =
			this.tilePool.length > 0
				? this.tilePool.pop()!
				: new DOMTile(this.viewPane, this.app.tileSize);
		tile.place(x, y);
		// this.app.tileService.loadTileData(x, y, tile);
		return tile;
	}
	private setTileRegionContent(tilePackets: TileDataPacket[]) {
		for (let i = 0; i < tilePackets.length; i++) {
			let yIndex = 0;
			let xIndex = 0;
			for (let y = tilePackets[i].region.startY; y <= tilePackets[i].region.endY; y++) {
				xIndex = 0;
				for (let x = tilePackets[i].region.startX; x <= tilePackets[i].region.endX; x++) {
					const key = `${x},${y}`;
					if (this.tileMap.has(key)) {
						this.tileMap.get(key)!.setContent(tilePackets[i].data[yIndex][xIndex]);
					}
					xIndex += 1;
				}
				yIndex += 1;
			}
		}
	}
}
