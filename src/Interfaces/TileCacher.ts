import TileDataPacket from "./TileDataPacket";
import TileRegion from "./TileRegion";

export default interface TileCacher {
	loadTileRegions: (regions: TileRegion[]) => Promise<TileDataPacket[]>;
	storeRegions: (packets: TileDataPacket[]) => void;
}
