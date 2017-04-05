class Color {
	constructor(r, g, b) {
		this.red = r;
		this.green = g;
		this.blue = b;
		this.alpha = 255;
	}
	toHex() {
		return `#${componentToHex(this.red)}${componentToHex(this.green)}${componentToHex(this.blue)}`
	}
}

function componentToHex(c) {
	let hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
module.exports = Color;
