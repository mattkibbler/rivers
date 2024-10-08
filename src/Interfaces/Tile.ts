import TileData from "./TileData";

export default interface Tile {
	size: number;
	x: number | null;
	y: number | null;
	setContent: (tileData: TileData) => void;
}
