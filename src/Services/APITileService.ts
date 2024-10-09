import TileMaterial from "@/Enums/TileMaterial";
import { getRandomEnumValue } from "@/Helpers/Misc";
import BatchingBuffer from "@/Helpers/Timing/BatchingBuffer";
import Tile from "@/Interfaces/Tile";
import TileData from "@/Interfaces/TileData";
import TileDataPacket from "@/Interfaces/TileDataPacket";
import TileRegion from "@/Interfaces/TileRegion";
import TileServiceInterface from "@/Interfaces/TileServiceInterface";

const TILE_STORE: { [key: string]: TileData } = {};

type TileRequestData = [number, number, Tile];

export default class APITileService implements TileServiceInterface {
	buffer: BatchingBuffer<TileRequestData>;
	constructor() {
		this.buffer = new BatchingBuffer(200, 250, (data) => {
			setTimeout(() => {
				// console.log("do request");
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
	getTile(x: number, y: number) {
		const key = `${x},${y}`;
		if (!TILE_STORE[key]) {
			TILE_STORE[key] = this.generateTile(x, y);
		}
		return TILE_STORE[key];
	}
	generateTile(_x: number, _y: number) {
		const material = getRandomEnumValue(TileMaterial);
		return {
			zLevel: 0,
			material: material,
			// x: _x,
			// y: _y,
		};
	}
}
