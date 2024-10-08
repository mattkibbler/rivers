import TileMaterial from "@/Enums/TileMaterial";
import { getRandomEnumValue } from "@/Helpers/Misc";
import TileData from "@/Interfaces/TileData";
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
	generateTile() {
		const material = getRandomEnumValue(TileMaterial);

		return {
			zLevel: 0,
			material: material,
		};
	}
}
