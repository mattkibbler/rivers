export const el = (tag: string, parent: HTMLElement) => {
	const newEL = document.createElement(tag);
	parent.appendChild(newEL);
	return newEL;
};

export const style = (el: HTMLElement, styles: Partial<CSSStyleDeclaration>) => {
	for (const key in styles) {
		if (styles[key] !== undefined) {
			el.style[key] = styles[key];
		}
	}
	return el;
};
