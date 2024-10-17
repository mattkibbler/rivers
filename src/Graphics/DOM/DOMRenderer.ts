import DOMTile from "./DOMTile";
import throttle from "@/Helpers/Timing/Throttle";
import TileRegion from "@/Interfaces/TileRegion";
import TileDataPacket from "@/Interfaces/TileDataPacket";
import { el, style } from "@/Helpers/DOM";
import TileData from "@/Interfaces/TileData";
import TileRegionResolver from "@/Services/TileRegionResolver";

const DEBUG_REGION_COLORS = [
	"#FF0000", // (Red)
	"#00FF00", // (Lime)
	"#0000FF", // (Blue)
	"#FFFF00", // (Yellow)
	"#00FFFF", // (Cyan)
	"#FF00FF", // (Magenta)
	"#800000", // (Maroon)
	"#008000", // (Green)
	"#000080", // (Navy)
	"#808000", // (Olive)
	"#008080", // (Teal)
	"#800080", // (Purple)
	"#FF4500", // (Orange Red)
	"#2E8B57", // (Sea Green)
	"#B22222", // (Firebrick)
	"#FF6347", // (Tomato)
	"#4682B4", // (Steel Blue)
	"#FF1493", // (Deep Pink)
	"#FF69B4", // (Hot Pink)
	"#00CED1", // (Dark Turquoise)
	"#1E90FF", // (Dodger Blue)
	"#FFD700", // (Gold)
	"#FF8C00", // (Dark Orange)
	"#ADFF2F", // (Green Yellow)
	"#9932CC", // (Dark Orchid)
	"#8A2BE2", // (Blue Violet)
	"#FF00FF", // (Fuchsia)
	"#9400D3", // (Dark Violet)
	"#32CD32", // (Lime Green)
	"#7FFF00", // (Chartreuse)
	"#FFA500", // (Orange)
	"#DC143C", // (Crimson)
	"#00BFFF", // (Deep Sky Blue)
	"#FF4500", // (Orange Red)
	"#00FA9A", // (Medium Spring Green)
	"#FFB6C1", // (Light Pink)
	"#DA70D6", // (Orchid)
	"#20B2AA", // (Light Sea Green)
	"#40E0D0", // (Turquoise)
	"#87CEEB", // (Sky Blue)
	"#6A5ACD", // (Slate Blue)
	"#FFFFE0", // (Light Yellow)
	"#BA55D3", // (Medium Orchid)
	"#FFDEAD", // (Navajo White)
	"#D2691E", // (Chocolate)
	"#8B4513", // (Saddle Brown)
	"#228B22", // (Forest Green)
	"#5F9EA0", // (Cadet Blue)
	"#FFDAB9", // (Peach Puff)
	"#B0E0E6", // (Powder Blue)
];

const TILE_STORE: { [key: string]: TileData } = {};

export default class DOMRenderer {
	offset: { x: number; y: number };
	viewPane: HTMLElement;
	tileMap: Map<string, DOMTile>;
	tilePool: DOMTile[];
	visibleContentRegion: TileRegion | null;
	scheduleUpdateVisibleContentRegion: (region: TileRegion) => void;
	debugRegions: HTMLElement[] = [];
	tileContainer: HTMLElement;
	tileSize: number;
	regionSize: number;
	tileRegionResolver: TileRegionResolver;
	constructor(
		tileContainer: HTMLElement,
		tileSize: number,
		regionSize: number,
		tileRegionResolver: TileRegionResolver
	) {
		this.tileContainer = tileContainer;
		this.tileSize = tileSize;
		this.regionSize = regionSize;
		this.tileRegionResolver = tileRegionResolver;

		this.offset = { x: 0, y: 0 };

		this.tileMap = new Map();
		this.tilePool = [];

		this.visibleContentRegion = null;
		this.scheduleUpdateVisibleContentRegion = throttle(this.updateVisibleContentRegion, 500);

		this.viewPane = document.createElement("div");
		this.viewPane.setAttribute("id", "rendererViewPane");
		this.tileContainer.appendChild(this.viewPane);
	}
	clearDebugRegions() {
		for (let i = 0; i < this.debugRegions.length; i++) {
			this.debugRegions[i].remove();
		}
		this.debugRegions = [];
	}
	drawDebugRegions(regions: TileRegion[]) {
		for (let i = 0; i < regions.length; i++) {
			const regionEl = el("div", this.viewPane);
			style(regionEl, {
				position: "absolute",
				left: `${regions[i].startX * this.tileSize}px`,
				top: `${regions[i].startY * this.tileSize}px`,
				width: `${(regions[i].endX - regions[i].startX) * this.tileSize}px`,
				height: `${(regions[i].endY - regions[i].startY) * this.tileSize}px`,
				border: `1px solid ${DEBUG_REGION_COLORS[this.debugRegions.length]}`,
			});
			this.debugRegions.push(regionEl);
		}
	}
	setOffset(offset: { x: number; y: number }) {
		this.offset.x = offset.x;
		this.offset.y = offset.y;
		this.viewPane.style.transform = `translateX(${this.offset.x}px) translateY(${this.offset.y}px)`;
	}
	setVisibleRegion(visible: TileRegion) {
		//this.clearDebugRegions();
		//this.drawDebugRegions([visible]);

		if (this.visibleContentRegion !== null) {
			//this.drawDebugRegions([this.visibleContentRegion]);
		}

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
		//this.clearDebugRegions();
		const regionsToLoad: TileRegion[] = [];

		// Calculate which regions the start and end coordinates fall into
		const startRegionX = Math.floor(regionToShow.startX / this.regionSize);
		const startRegionY = Math.floor(regionToShow.startY / this.regionSize);
		const endRegionX = Math.floor((regionToShow.endX + this.regionSize - 1) / this.regionSize); // Round up for endX
		const endRegionY = Math.floor((regionToShow.endY + this.regionSize - 1) / this.regionSize); // Round up for endY

		// Iterate through the regions in the visible range
		for (let regionX = startRegionX; regionX <= endRegionX; regionX++) {
			for (let regionY = startRegionY; regionY <= endRegionY; regionY++) {
				regionsToLoad.push({
					startX: regionX * this.regionSize,
					startY: regionY * this.regionSize,
					endX: regionX * this.regionSize + this.regionSize,
					endY: regionY * this.regionSize + this.regionSize,
				});
			}
		}

		// this.drawDebugRegions(regionsToLoad);

		this.tileRegionResolver.resolve(regionsToLoad).then(this.setTileRegionContent.bind(this));

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
			if (
				this.visibleContentRegion &&
				x >= this.visibleContentRegion.startX &&
				x <= this.visibleContentRegion.endX &&
				y >= this.visibleContentRegion.startY &&
				y <= this.visibleContentRegion.endY
			) {
				this.tileMap.get(tileKey)?.setContent(TILE_STORE[tileKey]);
			}
		}
	}
	private getTile(x: number, y: number): DOMTile {
		const tile =
			this.tilePool.length > 0
				? this.tilePool.pop()!
				: new DOMTile(this.viewPane, this.tileSize);
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
					TILE_STORE[key] = tilePackets[i].data[yIndex][xIndex];
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
