import Tile from "./Tile";
import TileDataPacket from "./TileDataPacket";
import TileRegion from "./TileRegion";

export default interface TileServiceInterface {
	loadTileData: (x: number, y: number, tile: Tile) => void;
	loadTileRegions: (regions: TileRegion[]) => Promise<TileDataPacket[]>;
}
