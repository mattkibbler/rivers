import TileMaterial from "@/Enums/TileMaterial";
import { getRandomEnumValue } from "@/Helpers/Misc";
import TileData from "@/Interfaces/TileData";
import TileServiceInterface from "@/Interfaces/TileServiceInterface";

const TILE_STORE: { [key: string]: TileData } = {};

export default class SimpleTileService implements TileServiceInterface {
	async getTileData(x: number, y: number): Promise<TileData> {
		return new Promise((resolve, reject) => {
			const key = `${x},${y}`;
			if (TILE_STORE[key]) {
				return TILE_STORE[key];
			}
			TILE_STORE[key] = this.generateTile(x, y);
			resolve(TILE_STORE[key]);
		});
	}
	generateTile(x: number, y: number) {
		const material = getRandomEnumValue(TileMaterial);

		return {
			zLevel: 0,
			material: material,
		};
	}
}
