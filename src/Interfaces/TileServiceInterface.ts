import Tile from "./Tile";
import TileData from "./TileData";

export default interface TileServiceInterface {
	loadTileData: (x: number, y: number, tile: Tile) => void;
}
