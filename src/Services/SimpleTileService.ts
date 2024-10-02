import TileMaterial from "@/Enums/TileMaterial";
import { getRandomEnumValue } from "@/Helpers/Misc";
import TileData from "@/Interfaces/TileData";
import TileServiceInterface from "@/Interfaces/TileServiceInterface";

const TILE_STORE: { [key: string]: TileData } = {};

export default class SimpleTileService implements TileServiceInterface {
	getTileData(x: number, y: number): TileData {
		const key = `${x},${y}`;
		if (TILE_STORE[key]) {
			return TILE_STORE[key];
		}
		TILE_STORE[key] = this.generateTile(x, y);
		return TILE_STORE[key];
	}
	generateTile(x: number, y: number) {
		const material = getRandomEnumValue(TileMaterial);

		return {
			zLevel: 0,
			material: material,
		};
	}
}
