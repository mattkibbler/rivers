let ID_INCREMENTER = 0;
export default class DOMTile {
	id: number;
	el: HTMLElement;
	size: number;
	x: number | null;
	y: number | null;
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
		this.el.style.backgroundColor = "blue";
		this.el.style.border = "1px solid yellow";
		this.el.style.display = "none";
		this.el.style.fontSize = "8px";
		this.el.style.fontFamily = "monospace";
		this.el.style.color = "white";
		this.el.innerText = this.id.toString();
	}
	place(x: number, y: number) {
		this.el.style.display = "block";
		this.x = x;
		this.y = y;
		this.el.style.transform = `translateX(${this.size * x}px) translateY(${this.size * y}px)`;
	}
	remove() {
		this.el.style.display = "none";
	}
}
