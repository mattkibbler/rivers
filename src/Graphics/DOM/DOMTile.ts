import TileMaterial from "@/Enums/TileMaterial";
import { el, style } from "@/Helpers/DOM";
import Tile from "@/Interfaces/Tile";
import TileData from "@/Interfaces/TileData";

const TILE_COLORS = {
	[TileMaterial.STONE]: "#808080", // Gray
	[TileMaterial.GRASS]: "#00FF00", // Green
	[TileMaterial.DIRT]: "#8B4513", // Brown
};

let ID_INCREMENTER = 0;
export default class DOMTile implements Tile {
	id: number;
	el: HTMLElement;
	size: number;
	x: number | null;
	y: number | null;
	contentEl: HTMLElement;
	constructor(container: HTMLElement, size: number) {
		this.size = size;
		this.x = null;
		this.y = null;
		this.id = ++ID_INCREMENTER;
		this.el = document.createElement("div");
		this.el.style.position = "absolute";
		this.el.style.width = `${size}px`;
		this.el.style.height = `${size}px`;
		container.appendChild(this.el);
		this.el.style.backgroundColor = "#000";
		//this.el.style.border = "1px solid yellow";
		this.el.style.display = "none";
		this.el.style.fontSize = "8px";
		this.el.style.fontFamily = "monospace";
		this.el.style.color = "white";
		//this.el.innerText = this.id.toString();

		this.contentEl = el("div", this.el);
		style(this.contentEl, {
			position: "absolute",
			top: "0",
			left: "0",
			width: `${size}px`,
			height: `${size}px`,
			opacity: "0",
			transition: "opacity .5s ease",
		});
	}
	place(x: number, y: number) {
		this.el.style.display = "block";
		this.x = x;
		this.y = y;
		this.el.style.transform = `translateX(${this.size * x}px) translateY(${this.size * y}px)`;
	}
	release() {
		this.el.style.display = "none";
		this.contentEl.style.backgroundColor = "#000";
		this.contentEl.style.opacity = "0";
	}
	setContent(tileData: TileData) {
		this.contentEl.style.backgroundColor = TILE_COLORS[tileData.material];
		this.contentEl.style.opacity = "1";
	}
}
