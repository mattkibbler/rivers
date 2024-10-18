export const adjustColorBrightness = (hex: string, percent: number): string => {
	// Remove the '#' character if it exists
	hex = hex.replace(/^#/, "");

	// Convert hex to RGB
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	// Scale the RGB values by the percentage (0 = black, 1 = original color, >1 = brighter)
	r = Math.min(255, Math.max(0, Math.floor(r * percent)));
	g = Math.min(255, Math.max(0, Math.floor(g * percent)));
	b = Math.min(255, Math.max(0, Math.floor(b * percent)));

	// Convert RGB back to hex
	const newHex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

	return newHex;
};
