export default function throttle<T extends (...args: any[]) => void>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let lastFunc: ReturnType<typeof setTimeout>;
	let lastRan: number | undefined;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		const context = this;

		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(
				function () {
					if (Date.now() - lastRan! >= limit) {
						func.apply(context, args);
						lastRan = Date.now();
					}
				},
				limit - (Date.now() - lastRan)
			);
		}
	};
}
