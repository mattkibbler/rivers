import TileDataPacket from "@/Interfaces/TileDataPacket";
import TileRegion from "@/Interfaces/TileRegion";
import TileServiceInterface from "@/Interfaces/TileServiceInterface";
import TileCacher from "@/Interfaces/TileCacher";

export default class TileRegionResolver {
	cache: TileCacher;
	service: TileServiceInterface;
	constructor(cache: TileCacher, service: TileServiceInterface) {
		this.cache = cache;
		this.service = service;
	}
	async resolve(tileRegions: TileRegion[]): Promise<TileDataPacket[]> {
		const result: TileDataPacket[] = [];
		const regionsToLoad: TileRegion[] = [...tileRegions];
		// Load regions from cache
		const regionsLoadedFromCache = await this.cache.loadTileRegions(regionsToLoad);
		// Iterate over loaded regions and remove them from the regionsToLoad array
		for (let rl = 0; rl < regionsLoadedFromCache.length; rl++) {
			const indexOfLoadedRegion = regionsToLoad.findIndex((region) => {
				return (
					region.startX === regionsLoadedFromCache[rl].region.startX &&
					region.startY === regionsLoadedFromCache[rl].region.startY &&
					region.endX === regionsLoadedFromCache[rl].region.endX &&
					region.endY === regionsLoadedFromCache[rl].region.endY
				);
			});
			if (indexOfLoadedRegion > -1) {
				regionsToLoad.splice(indexOfLoadedRegion, 1);
			}
		}

		// Add loaded regions to result
		result.push(...regionsLoadedFromCache);

		// If there are more regions to load, load them from the provided service
		if (regionsToLoad.length > 0) {
			const regionsLoadedFromService = await this.service.loadTileRegions(regionsToLoad);
			result.push(...regionsLoadedFromService);
			this.cache.storeRegions(regionsLoadedFromService);
		}

		return result;
	}
}
