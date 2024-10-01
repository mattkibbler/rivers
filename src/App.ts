import DOMRenderer from "./Graphics/DOM/DOMRenderer";

export default class App {
	appContainer: HTMLElement;
	mouseMoveStart: { x: number; y: number } | null;
	viewport: { width: number; height: number };
	lastScrollOffset: { x: number; y: number };
	scrollOffset: { x: number; y: number };
	tileSize: number = 20;
	renderer: DOMRenderer;
	padding: number = 1;
	constructor(appContainer: HTMLElement) {
		this.appContainer = appContainer;
		this.mouseMoveStart = null;
		this.viewport = { width: appContainer.clientWidth, height: appContainer.clientHeight };
		this.lastScrollOffset = { x: 0, y: 0 };
		this.scrollOffset = { x: 0, y: 0 };
		this.renderer = new DOMRenderer(this);
		this.addListeners();

		this.viewport.width = this.appContainer.clientWidth;
		this.viewport.height = this.appContainer.clientHeight;

		this.appContainer.style.cursor = "grab";

		this.renderer.setVisibleTiles(this.calculateVisibleTiles());
	}
	private addListeners() {
		this.appContainer.addEventListener("mousedown", (e) => {
			this.mouseMoveStart = { x: e.clientX, y: e.clientY };
			this.appContainer.style.cursor = "grabbing";
		});
		this.appContainer.addEventListener("mouseup", (e) => {
			this.mouseMoveStart = null;
			this.lastScrollOffset = { x: this.scrollOffset.x, y: this.scrollOffset.y };
			this.renderer.setOffset(this.scrollOffset);
			this.renderer.setVisibleTiles(this.calculateVisibleTiles());
			this.appContainer.style.cursor = "grab";
		});
		this.appContainer.addEventListener("mousemove", (e) => {
			if (this.mouseMoveStart === null) {
				return;
			}
			this.scrollOffset.x = this.lastScrollOffset.x + (e.clientX - this.mouseMoveStart.x);
			this.scrollOffset.y = this.lastScrollOffset.y + (e.clientY - this.mouseMoveStart.y);

			this.renderer.setOffset(this.scrollOffset);
		});

		const appContainerResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
			this.viewport.width = entries[0].contentRect.width;
			this.viewport.height = entries[0].contentRect.height;
			this.renderer.setVisibleTiles(this.calculateVisibleTiles());
		});
		appContainerResizeObserver.observe(this.appContainer);
	}
	calculateVisibleTiles() {
		const paddedScrollOffset = { x: this.scrollOffset.x + this.tileSize * this.padding, y: this.scrollOffset.y + this.tileSize * this.padding };
		const paddedViewPort = {
			width: this.viewport.width + this.tileSize * (2 * this.padding),
			height: this.viewport.height + this.tileSize * (2 * this.padding),
		};

		// Find the top left corner tile. This may be a fraction, but that's ok
		const x = -paddedScrollOffset.x / this.tileSize;
		const y = -paddedScrollOffset.y / this.tileSize;

		// Calculate the number of tiles that fit in the viewport
		const tilesAcross = Math.ceil(paddedViewPort.width / this.tileSize);
		const tilesDown = Math.ceil(paddedViewPort.height / this.tileSize);

		// Calculate the starting tile indexes based on the scroll position
		// Round down to make sure we're covering the viewport on the left and right
		const startX = Math.floor(x);
		const startY = Math.floor(y);

		// Calculate the last tile on the right and bottom
		// Round up to make sure we're covering the viewport on the right and bottom
		const endX = Math.ceil(x + tilesAcross);
		const endY = Math.ceil(y + tilesDown);

		return {
			startX,
			startY,
			endX,
			endY,
		};
	}
	start() {}
}
