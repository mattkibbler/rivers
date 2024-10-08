import TileMaterial from "@/Enums/TileMaterial";
import { getRandomEnumValue } from "@/Helpers/Misc";
import BatchingBuffer from "@/Helpers/Queues/BatchingBuffer";
import Tile from "@/Interfaces/Tile";
import TileData from "@/Interfaces/TileData";
import TileServiceInterface from "@/Interfaces/TileServiceInterface";

const TILE_STORE: { [key: string]: TileData } = {};

type TileRequestData = [number, number, Tile];

export default class APITileService implements TileServiceInterface {
	buffer: BatchingBuffer<TileRequestData>;
	constructor() {
		this.buffer = new BatchingBuffer(200, 250, (data) => {
			setTimeout(() => {
				console.log("do request");
				for (let i = 0; i < data.length; i++) {
					if (data[i][2].x !== data[i][0] && data[i][2].y !== data[i][1]) {
						continue;
					}
					const key = `${data[i][0]},${data[i][1]}`;
					if (!TILE_STORE[key]) {
						TILE_STORE[key] = this.generateTile(data[i][0], data[i][1]);
					}
					data[i][2].setContent(TILE_STORE[key]);
				}
			}, 500);
		});
	}
	loadTileData(x: number, y: number, tile: Tile) {
		this.buffer.add([x, y, tile]);
	}
	generateTile(x: number, y: number) {
		const material = getRandomEnumValue(TileMaterial);

		return {
			zLevel: 0,
			material: material,
		};
	}
}
