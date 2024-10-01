import App from "@/App";

export default class DOMRenderer {
	offset: { x: number; y: number };
	viewPane: HTMLElement;
	app: App;
	tileMap: Map<string, HTMLElement>;
	constructor(app: App) {
		this.offset = { x: 0, y: 0 };

		this.app = app;

		this.tileMap = new Map();

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
		for (let x = visible.startX; x < visible.endX; x++) {
			for (let y = visible.startY; y < visible.endY; y++) {
				this.addTile(x, y);
			}
		}
	}
	addTile(x: number, y: number) {
		const tileKey = `${x},${y}`;
		if (!this.tileMap.has(tileKey)) {
			const tile = this.createTile(x, y);
			this.viewPane.appendChild(tile);
			this.tileMap.set(tileKey, tile); // Store tile reference
		}
	}
	private createTile(x: number, y: number): HTMLElement {
		const el = document.createElement("div");
		el.style.position = "absolute";
		el.style.width = `${this.app.tileSize}px`;
		el.style.height = `${this.app.tileSize}px`;
		el.style.transform = `translateX(${this.app.tileSize * x}px) translateY(${this.app.tileSize * y}px)`;
		el.style.backgroundColor = "blue";
		el.style.border = "1px solid yellow";
		return el;
	}
}
