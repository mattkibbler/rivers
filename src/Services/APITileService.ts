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
		const useJson = false;
		return new Promise(async (resolve) => {
			let queryStr = "?";
			for (let i = 0; i < tileRegions.length; i++) {
				queryStr += queryStr ? "&" : "";
				queryStr += `regions[]=${tileRegions[i].startX},${tileRegions[i].startY},${tileRegions[i].endX},${tileRegions[i].endY}`;
			}
			const response = await fetch(`${Env.apiUrl}/api/v1/tiles/regions${queryStr}`, {
				headers: {
					Accept: useJson ? "application/json" : "application/octet-stream",
				},
			});
			if (!response.ok) {
				throw new Error("could not get tile regions");
			}
			if (useJson) {
				const data = await response.json();
				resolve(data.packets);
			} else {
				const data = await response.arrayBuffer();
				resolve(this.decodePackets(data));
			}
		});
	}
	decodePackets(buf: ArrayBuffer): TileDataPacket[] {
		const result: TileDataPacket[] = [];
		const byteArray = new Uint8Array(buf);

		let i = -1;
		while (i < byteArray.length - 1) {
			// Read the region data (first 8 bytes)
			const startX = byteArray[++i] | (byteArray[++i] << 8); // Combine first two bytes
			const startY = byteArray[++i] | (byteArray[++i] << 8); // Combine next two bytes
			const endX = byteArray[++i] | (byteArray[++i] << 8); // Combine next two bytes
			const endY = byteArray[++i] | (byteArray[++i] << 8); // Combine last two bytes
			// Convert to signed int16
			const signedStartX = startX >= 32768 ? startX - 65536 : startX;
			const signedStartY = startY >= 32768 ? startY - 65536 : startY;
			const signedEndX = endX >= 32768 ? endX - 65536 : endX;
			const signedEndY = endY >= 32768 ? endY - 65536 : endY;
			// Read the rest of the packet data, which will be the tile values
			const packetData: TileData[][] = [[]];
			let yIndex = 0;
			for (let y = signedStartY; y <= signedEndY; y++) {
				packetData.push([]);
				for (let x = signedStartX; x <= signedEndX; x++) {
					const material = byteArray[++i]; // Read Material (1 byte)
					const zLevel = byteArray[++i]; // Read ZLevel (1 byte)
					packetData[yIndex].push({
						zLevel,
						material,
					});
				}
				yIndex += 1;
			}

			result.push({
				region: {
					startX: signedStartX,
					startY: signedStartY,
					endX: signedEndX,
					endY: signedEndY,
				},
				data: packetData,
			});
		}
		return result;
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
