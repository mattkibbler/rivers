import TileData from "./TileData";
import TileRegion from "./TileRegion";

export default interface TileDataPacket {
	region: TileRegion;
	data: TileData[][];
}
