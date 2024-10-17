import DOMRenderer from "./Graphics/DOM/DOMRenderer";
import { el, style } from "./Helpers/DOM";
import TileCacher from "./Interfaces/TileCacher";
import TileServiceInterface from "./Interfaces/TileServiceInterface";
import APITileService from "./Services/APITileService";
import TileCache from "./Services/TileCache/TileCache";
import TileRegionResolver from "./Services/TileRegionResolver";

export default class App {
	appContainer: HTMLElement;
	mouseMoveStart: { x: number; y: number } | null;
	viewport: { width: number; height: number };
	lastScrollOffset: { x: number; y: number };
	scrollOffset: { x: number; y: number };
	tileSize: number = 20;
	regionSize: number = 20;
	renderer: DOMRenderer;
	padding: number = 1;
	helperTextContainer: HTMLElement;
	tileContainer: HTMLElement;
	tileContainerFrame: HTMLElement;
	movementEnabled: boolean = false;
	tileService: TileServiceInterface;
	tileCache: TileCacher;
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

		this.tileService = new APITileService();
		this.tileCache = new TileCache();
		this.renderer = new DOMRenderer(
			this.tileContainer,
			this.tileSize,
			this.regionSize,
			new TileRegionResolver(this.tileCache, this.tileService)
		);

		this.enableMovement();

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

		helperText.innerText = "Click and drag around the screen to explore the map.";
		explainerButton.innerText = "What is this?";
		explainerDialog.innerHTML = `
			<p>An exerimental tile-based map exploring the creation of rivers and other water features... water coming soon.</p>
			<p>This latest iteration introduces asynchronous loading of tiles and generation of basic tile material colours.</p>
			<p>Tile loading is all local at the moment with a short delay to simulate a call to a server.</p>
			<h3>Next steps</h3>
			<ul style="list-style-position: inside">
				<li>Create a backend to generate and persist tile creation</li>
				<li>Generate less random, more coherent tile sets</li>
			</ul>
			<p><a href="https://github.com/mattkibbler/rivers">More information on Github</a></p>
			<h3>Previous versions</h3>
			<p><a href="https://mattkibbler.github.io/rivers/version-0.0.2/">v0.0.2</a></p>
			<p><a href="https://mattkibbler.github.io/rivers/version-0.0.1/">v0.0.1</a></p>
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
			this.renderer.setVisibleRegion(this.calculateVisibleRegion());
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
			this.renderer.setVisibleRegion(this.calculateVisibleRegion());
		});
		appContainerResizeObserver.observe(this.tileContainer);
	}
	calculateVisibleRegion() {
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
		const tilesAcross = Math.floor(paddedViewPort.width / this.tileSize);
		const tilesDown = Math.floor(paddedViewPort.height / this.tileSize);

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
