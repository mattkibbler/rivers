import TileData from "./TileData";

export default interface TileServiceInterface {
	getTileData: (x: number, y: number) => TileData;
}
