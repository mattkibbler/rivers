import TileCacher from "@/Interfaces/TileCacher";
import TileDataPacket from "@/Interfaces/TileDataPacket";
import TileRegion from "@/Interfaces/TileRegion";

const TILE_STORE: { [key: string]: TileDataPacket } = {};

export default class TileCache implements TileCacher {
	loadTileRegions(tileRegions: TileRegion[]): Promise<TileDataPacket[]> {
		return new Promise((resolve) => {
			const result: TileDataPacket[] = [];
			for (let i = 0; i < tileRegions.length; i++) {
				const key = `${tileRegions[i].startX},${tileRegions[i].startY},${tileRegions[i].endX},${tileRegions[i].endY}`;
				if (TILE_STORE[key]) {
					result.push(TILE_STORE[key]);
				}
			}
			resolve(result);
		});
	}
	storeRegions(packets: TileDataPacket[]) {
		for (let i = 0; i < packets.length; i++) {
			const key = `${packets[i].region.startX},${packets[i].region.startY},${packets[i].region.endX},${packets[i].region.endY}`;
			TILE_STORE[key] = packets[i];
		}
	}
}
