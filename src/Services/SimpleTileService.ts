import TileMaterial from "@/Enums/TileMaterial";
import { getRandomEnumValue } from "@/Helpers/Misc";
import TileData from "@/Interfaces/TileData";
import TileDataPacket from "@/Interfaces/TileDataPacket";
import TileRegion from "@/Interfaces/TileRegion";
import TileServiceInterface from "@/Interfaces/TileServiceInterface";

const TILE_STORE: { [key: string]: TileData } = {};

export default class SimpleTileService implements TileServiceInterface {
	async loadTileData(x: number, y: number): Promise<TileData> {
		return new Promise((resolve) => {
			const key = `${x},${y}`;
			if (TILE_STORE[key]) {
				return TILE_STORE[key];
			}
			TILE_STORE[key] = this.generateTile();
			resolve(TILE_STORE[key]);
		});
	}
	loadTileRegions(tileRegions: TileRegion[]): Promise<TileDataPacket[]> {
		return new Promise((resolve) => {
			setTimeout(() => {
				const packets = [];
				for (let i = 0; i < tileRegions.length; i++) {
					const result = [];
					for (let y = tileRegions[i].startY; y <= tileRegions[i].endY; y++) {
						const row = [];
						for (let x = tileRegions[i].startX; x <= tileRegions[i].endX; x++) {
							row.push(this.getTile(x, y));
						}
						result.push(row);
					}
					packets.push({
						data: result,
						region: tileRegions[i],
					});
				}
				resolve(packets);
			}, 500);
		});
	}
	generateTile() {
		const material = getRandomEnumValue(TileMaterial);

		return {
			zLevel: 0,
			material: material,
		};
	}
	getTile(x: number, y: number) {
		const key = `${x},${y}`;
		if (!TILE_STORE[key]) {
			TILE_STORE[key] = this.generateTile();
		}
		return TILE_STORE[key];
	}
}
