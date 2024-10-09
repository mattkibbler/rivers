export default function debounce<T extends (...args: any[]) => void>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}
