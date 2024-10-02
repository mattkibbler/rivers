import DOMRenderer from "./Graphics/DOM/DOMRenderer";
import { el, style } from "./Helpers/DOM";
import TileServiceInterface from "./Interfaces/TileServiceInterface";
import SimpleTileService from "./Services/SimpleTileService";

export default class App {
	appContainer: HTMLElement;
	mouseMoveStart: { x: number; y: number } | null;
	viewport: { width: number; height: number };
	lastScrollOffset: { x: number; y: number };
	scrollOffset: { x: number; y: number };
	tileSize: number = 20;
	renderer: DOMRenderer;
	padding: number = 1;
	helperTextContainer: HTMLElement;
	tileContainer: HTMLElement;
	tileContainerFrame: HTMLElement;
	movementEnabled: boolean = false;
	tileService: TileServiceInterface;
	constructor(appContainer: HTMLElement) {
		this.appContainer = appContainer;
		this.mouseMoveStart = null;
		this.viewport = { width: appContainer.clientWidth, height: appContainer.clientHeight };
		this.lastScrollOffset = { x: 0, y: 0 };
		this.scrollOffset = { x: 0, y: 0 };

		this.tileContainer = this.createTileContainer();
		this.tileContainerFrame = this.createTileContainerFrame();
		this.helperTextContainer = this.createHelperTextContainer();

		this.viewport.width = this.tileContainer.clientWidth;
		this.viewport.height = this.tileContainer.clientHeight;

		this.tileService = new SimpleTileService();
		this.renderer = new DOMRenderer(this);

		this.enableMovement();

		this.renderer.setVisibleTiles(this.calculateVisibleTiles());

		this.addListeners();
	}
	private enableMovement() {
		this.appContainer.style.cursor = "grab";
		this.movementEnabled = true;
	}
	private disableMovement() {
		this.appContainer.style.cursor = "default";
		this.movementEnabled = false;
	}
	private createHelperTextContainer() {
		const helperTextContainer = el("div", this.appContainer);
		const helperText = el("p", helperTextContainer);
		const explainerContainer = el("p", helperTextContainer);
		const explainerButton = el("button", explainerContainer);
		const explainerDialog = el("dialog", explainerContainer) as HTMLDialogElement;

		helperText.innerText = "Click and drag within the red box to explore the tile space.";
		explainerButton.innerText = "What is this?";
		explainerDialog.innerHTML = `
			<p>It's a tile-based map which allows you to move by clicking and dragging. The actual map/tile content will be added soon.</p>
			<p>Map tiles are DOM elements which are recyled as they move out of view, each displays it's ID number so you can see how they are moved around and re-used.</p>
			<p>Using a canvas to render the map would make more sense, but I thought it would be more fun to use DOM elements.</p>
			<p>The red box indicates the edges of the map viewport, the tiles which overflow this box would be hidden in a finished product but they are visible here to illustrate how the tile map works.</p>
			<p><button type="button">Close</button></p>
		`;

		explainerButton.addEventListener("click", () => {
			this.disableMovement();
			explainerDialog.showModal();
		});

		explainerDialog.querySelector("button")?.addEventListener("click", (e) => {
			e.preventDefault();
			this.enableMovement();
			explainerDialog.close();
		});

		style(explainerDialog.querySelector("button")!, {
			fontFamily: "monospace",
			fontSize: "12px",
		});

		style(helperTextContainer, {
			fontFamily: "monospace",
			textAlign: "center",
			position: "absolute",
			bottom: "0px",
			left: "0px",
			right: "0px",
			padding: "20px",
		});
		style(helperText, {
			background: "#FFF",
			display: "inline-block",
			paddingLeft: "4px",
			paddingRight: "4px",
			marginTop: "0px",
			marginBottom: "0px",
		});
		style(explainerContainer, {
			marginTop: "10px",
			marginBottom: "0px",
		});
		style(explainerButton, {
			fontFamily: "monospace",
			fontSize: "12px",
		});
		style(explainerDialog, {
			lineHeight: "1.3rem",
		});
		return helperTextContainer;
	}
	private createTileContainer() {
		const tileContainer = el("div", this.appContainer);
		tileContainer.setAttribute("id", "tileContainer");
		style(tileContainer, {
			position: "absolute",
			left: "25%",
			right: "25%",
			bottom: "25%",
			top: "25%",
		});
		return tileContainer;
	}
	private createTileContainerFrame() {
		const tileContainerFrame = el("div", this.appContainer);
		tileContainerFrame.setAttribute("id", "tileContainerFrame");
		style(tileContainerFrame, {
			position: "absolute",
			left: "25%",
			right: "25%",
			bottom: "25%",
			top: "25%",
			border: "2px solid red",
		});
		return tileContainerFrame;
	}
	private addListeners() {
		const handleMoveStart = (e: MouseEvent | TouchEvent) => {
			if (!this.movementEnabled) {
				return;
			}
			const x = "touches" in e ? e.touches[0].clientX : e.clientX;
			const y = "touches" in e ? e.touches[0].clientY : e.clientY;
			this.mouseMoveStart = { x, y };
			this.appContainer.style.cursor = "grabbing";
		};
		const handleMoveEnd = () => {
			if (!this.movementEnabled) {
				return;
			}
			this.mouseMoveStart = null;
			this.lastScrollOffset = { x: this.scrollOffset.x, y: this.scrollOffset.y };
			this.renderer.setOffset(this.scrollOffset);
			this.renderer.setVisibleTiles(this.calculateVisibleTiles());
			this.appContainer.style.cursor = "grab";
		};
		const handleMove = (e: MouseEvent | TouchEvent) => {
			if (!this.movementEnabled || this.mouseMoveStart === null) {
				return;
			}
			const x = "touches" in e ? e.touches[0].clientX : e.clientX;
			const y = "touches" in e ? e.touches[0].clientY : e.clientY;
			this.scrollOffset.x = this.lastScrollOffset.x + (x - this.mouseMoveStart.x);
			this.scrollOffset.y = this.lastScrollOffset.y + (y - this.mouseMoveStart.y);

			this.renderer.setOffset(this.scrollOffset);
			this.renderer.setVisibleTiles(this.calculateVisibleTiles());
		};
		this.appContainer.addEventListener("mousedown", handleMoveStart);
		this.appContainer.addEventListener("mouseup", handleMoveEnd);
		this.appContainer.addEventListener("mousemove", handleMove);

		this.appContainer.addEventListener("touchstart", handleMoveStart);
		this.appContainer.addEventListener("touchend", handleMoveEnd);
		this.appContainer.addEventListener("touchmove", handleMove);

		const appContainerResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
			this.viewport.width = entries[0].contentRect.width;
			this.viewport.height = entries[0].contentRect.height;
			this.renderer.setVisibleTiles(this.calculateVisibleTiles());
		});
		appContainerResizeObserver.observe(this.tileContainer);
	}
	calculateVisibleTiles() {
		const paddedScrollOffset = {
			x: this.scrollOffset.x + this.tileSize * this.padding,
			y: this.scrollOffset.y + this.tileSize * this.padding,
		};
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
