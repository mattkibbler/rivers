import Tile from "./Tile";

export default interface TileServiceInterface {
	loadTileData: (x: number, y: number, tile: Tile) => void;
}
