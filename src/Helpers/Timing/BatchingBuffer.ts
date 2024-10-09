export default class BatchingBuffer<T> {
	data: T[];
	max: number;
	timeout: number;
	timer: null | NodeJS.Timeout = null;
	handler: (data: T[]) => void;
	constructor(max: number, timeout: number, handler: (data: T[]) => void) {
		if (max <= 0) {
			throw new Error("max must be a positive number greater than 0");
		}
		if (timeout < 0) {
			throw new Error("timeout must be a positive number");
		}
		this.data = [];
		this.max = max;
		this.timeout = timeout;
		this.handler = handler;
	}
	add(item: any) {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			this.flush();
		}, this.timeout);
		this.data.push(item);
		if (this.data.length >= this.max) {
			this.flush();
		}
	}
	flush() {
		this.handler([...this.data]);
		this.data.length = 0;
	}
}
