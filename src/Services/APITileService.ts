import TileMaterial from "@/Enums/TileMaterial";
import { Env } from "@/Env";
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
		return new Promise(async (resolve) => {
			let queryStr = "?";
			for (let i = 0; i < tileRegions.length; i++) {
				queryStr += queryStr ? "&" : "";
				queryStr += `regions[]=${tileRegions[i].startX},${tileRegions[i].startY},${tileRegions[i].endX},${tileRegions[i].endY}`;
			}
			const response = await fetch(`${Env.apiUrl}/tiles/regions${queryStr}`, {
				headers: {
					Accept: "application/json",
				},
			});
			if (!response.ok) {
				throw new Error("could not get tile regions");
			}
			const data = await response.json();

			resolve(data.packets);
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
