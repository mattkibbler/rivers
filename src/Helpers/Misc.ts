export const getRandomEnumValue = <T extends Record<string, number | string>>(
	enumObj: T
): T[keyof T] => {
	// Get only the numeric values from the enum
	const enumValues = Object.values(enumObj).filter(
		(value) => typeof value === "number"
	) as unknown as T[keyof T][];

	const randomIndex = Math.floor(Math.random() * enumValues.length);
	return enumValues[randomIndex];
};
