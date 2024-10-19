import { MAX_Z_LEVEL } from "@/Contants";
import TileMaterial from "@/Enums/TileMaterial";
import { adjustColorBrightness } from "@/Helpers/Colors";
import { el, style } from "@/Helpers/DOM";
import Tile from "@/Interfaces/Tile";
import TileData from "@/Interfaces/TileData";

const TILE_COLORS = {
	[TileMaterial.STONE]: "#AAAAAA", // Gray
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
	debugEl: HTMLElement | null = null;
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

		// this.showDebug();
	}
	highlight(status: boolean, color: string = "red") {
		if (status) {
			this.el.style.border = `1px solid ${color}`;
		} else {
			this.el.style.border = "none";
		}
	}
	showDebug() {
		this.debugEl = el("div", this.el);
		style(this.debugEl, {
			position: "absolute",
			zIndex: "99",
			top: "0",
			right: "0",
			bottom: "0",
			left: "0",
			textAlign: "center",
			paddingTop: "3px",
		});
	}
	place(x: number, y: number) {
		this.el.style.display = "block";
		this.x = x;
		this.y = y;
		this.el.style.transform = `translate3d(${this.size * x}px, ${this.size * y}px, 0)`;
		if (this.debugEl) {
			this.debugEl.innerText = `${this.x},${this.y}`;
		}
	}
	release() {
		this.el.style.display = "none";
		this.contentEl.style.backgroundColor = "#000";
		this.contentEl.style.opacity = "0";
	}
	setContent(tileData: TileData) {
		this.contentEl.style.backgroundColor = adjustColorBrightness(
			TILE_COLORS[tileData.material],
			1 - tileData.zLevel / MAX_Z_LEVEL
		);
		this.contentEl.style.opacity = "1";
	}
}
