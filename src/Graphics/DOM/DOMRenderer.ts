import App from "@/App";
import DOMTile from "./DOMTile";

export default class DOMRenderer {
	offset: { x: number; y: number };
	viewPane: HTMLElement;
	app: App;
	tileMap: Map<string, DOMTile>;
	tilePool: DOMTile[];
	constructor(app: App) {
		this.offset = { x: 0, y: 0 };

		this.app = app;

		this.tileMap = new Map();
		this.tilePool = [];

		this.viewPane = document.createElement("div");
		this.viewPane.setAttribute("id", "rendererViewPane");
		this.app.tileContainer.appendChild(this.viewPane);
	}
	setOffset(offset: { x: number; y: number }) {
		this.offset.x = offset.x;
		this.offset.y = offset.y;
		this.viewPane.style.transform = `translateX(${this.offset.x}px) translateY(${this.offset.y}px)`;
	}
	setVisibleTiles(visible: { startX: number; startY: number; endX: number; endY: number }) {
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
		for (let x = visible.startX; x < visible.endX; x++) {
			for (let y = visible.startY; y < visible.endY; y++) {
				this.addTile(x, y);
			}
		}
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
		this.app.tileService.loadTileData(x, y, tile);
		return tile;
	}
}
