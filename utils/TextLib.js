// import ColorCode from './ColorCode';
// import Render from './Render';
import TextC from '../wrapped/TextComponent';
const Color = java.awt.Color;

export default class TextLib {
	static ColorCode = {
		BLACK: '§0',
		DARK_BLUE: '§1',
		DARK_GREEN: '§2',
		DARK_AQUA: '§3',
		DARK_RED: '§4',
		DARK_PURPLE: '§5',
		GOLD: '§6',
		GRAY: '§7',
		DARK_GRAY: '§8',
		BLUE: '§9',
		GREEN: '§a',
		AQUA: '§b',
		RED: '§c',
		LIGHT_PURPLE: '§d',
		YELLOW: '§e',
		WHITE: '§f',

		OBFUSCATED: '§k',
		BOLD: '§l',
		STRIKETHROUGH: '§m',
		UNDERLINE: '§n',
		ITALIC: '§o',
		RESET: '§r',
	};
	static mapStyle = (s) => ({ color: s.color?.getName() || 'white', decoration: { bold: s.bold, italic: s.italic, underlined: s.underlined, strikethrough: s.strikethrough, obfuscated: s.obfuscated } });
	/**
	 * Generate a text component with a color gradient applied to each character
	 *
	 * @param {string} text - The input text to be colored with a gradient
	 * @param {string|number[]|number} startColor - Starting color for the gradient in formats:
	 *  - Hex string (e.g., '#ff0000' or 'ff0000')
	 *  - RGB array (e.g., [255, 0, 0])
	 *  - Long integer color representation (e.g., Renderer.RED)
	 * @param {string|number[]|number} endColor - Ending color for the gradient in the same formats as startColor
	 * @returns {TextC} A text component with each character colored in a gradient
	 *
	 * @example
	 * TextLib.gradientString("Hello", '#ff0000', '#0000ff')
	 * TextLib.gradientString("World", Renderer.RED, Renderer.GREEN)
	 */
	static gradientString(text, startColor, endColor) {
		const letters = text.split('');
		const colors = TextLib.getColorGradient(startColor, endColor, letters.length);
		return new TextC(letters.map((letter, index) => ({ text: letter, color: colors[index] })));
	}
	/**
	 * Convert RGB color array to hex color string
	 *
	 * @param {number[]} rgb - RGB color array [R, G, B]
	 * @returns {string} Hex color string
	 */
	static rgbToHex(rgb) {
		return (
			'#' +
			rgb
				.map((x) => {
					const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				})
				.join('')
		);
	}
	/**
	 * Interpolate between two colors of various input types to generate a specified number of hex colors
	 *
	 * @param {string|number[]|number} startColor - Starting color in one of these formats:
	 *  - Hex string (e.g., '#ff0000' or 'ff0000')
	 *  - RGB array (e.g., [255, 0, 0])
	 *  - Long integer representation of color (e.g., Renderer.RED)
	 * @param {string|number[]|number} endColor - Ending color in the same formats as startColor
	 * @param {number} length - Total number of colors to generate (including start and end)
	 * @returns {string[]} Array of interpolated hex colors
	 */
	static getColorGradient(startColor, endColor, length) {
		if (length < 2) throw new Error('Length must be at least 2');

		if (!Array.isArray(startColor))
			startColor = Color.decode(startColor)
				.toString()
				.match(/r=(\d+),g=(\d+),b=(\d+)/)
				.slice(1)
				.map(Number);
		if (!Array.isArray(endColor))
			endColor = Color.decode(endColor)
				.toString()
				.match(/r=(\d+),g=(\d+),b=(\d+)/)
				.slice(1)
				.map(Number);

		if (length === 2) return [TextLib.rgbToHex(startColor), TextLib.rgbToHex(endColor)];

		const colorStep = {
			r: (endColor[0] - startColor[0]) / (length - 1),
			g: (endColor[1] - startColor[1]) / (length - 1),
			b: (endColor[2] - startColor[2]) / (length - 1),
		};
		const interpolatedColors = [];
		for (let i = 0; i < length; i++) {
			const color = [Math.round(startColor[0] + colorStep.r * i), Math.round(startColor[1] + colorStep.g * i), Math.round(startColor[2] + colorStep.b * i)];
			interpolatedColors.push(TextLib.rgbToHex(color));
		}

		return interpolatedColors;
	}

	static parseNBT(item) {
		const NBT = item.getNBT();
	}
}

// export class TextC {
// 	constructor(...args) {
// 		args = args.map((e) => {
// 			if (typeof e !== 'string' || !e.includes('§#')) return e;
// 			return e.match(/§#[0-9A-F]{6}.*?($|(?=§))/g).reduce((acc, match) => {
// 				const color = match.slice(1, 8);
// 				const text = match.slice(8);
// 				acc.push(new TextComponent({ text, color: Color.decode(color).getRGB() }));
// 				return acc;
// 			}, []);
// 		});
// 		this.text = new TextComponent(...args);
// 		this.formattedText = this.text.formattedText;
// 		this.unformattedText = this.text.unformattedText;
// 		this.size = this.text.size;
// 		return this;
// 	}
// 	getColorString() {
// 		const siblings = this.text.getSiblings() || [];
// 		siblings.unshift(this.text);
// 		return siblings.reduce((acc, sibling) => {
// 			if (!sibling) return acc;
// 			// const { color, modifier } = TextLib.convertStyle(sibling.getStyle());

// 			let { color, decoration } = TextLib.mapStyle(sibling.getStyle());
// 			if (color[0] == '#') color = '§' + color;
// 			else color = ColorCode[color.toUpperCase()];
// 			const modifier = Object.entries(decoration).reduce((acc, [key, value]) => {
// 				acc += value ? TextLib.ColorCode[key.toUpperCase()] || '' : '';
// 				return acc;
// 			}, '');

// 			return (acc += color + modifier + sibling.getString());
// 		}, '');
// 	}
// 	toString() {
// 		return this.getColorString();
// 	}
// 	actionBar() {
// 		this.text.actionBar();
// 	}
// 	asOrderedText() {
// 		return this.text.asOrderedText();
// 	}
// 	chat() {
// 		this.text.chat();
// 	}
// 	contains(element) {
// 		return this.text.contains(element);
// 	}
// 	containsAll(elements) {
// 		return this.text.containsAll(elements);
// 	}
// 	delete() {
// 		return this.text.delete();
// 	}
// 	edit(newText) {
// 		return this.text.edit(newText);
// 	}
// 	get(index) {
// 		return this.text.get(index);
// 	}
// 	getChatLineId() {
// 		return this.text.getChatLineId();
// 	}
// 	getContents() {
// 		return this.text.getContents();
// 	}
// 	getSiblings() {
// 		return this.text.getSiblings();
// 	}
// 	getString() {
// 		return this.text.getString();
// 	}
// 	getStyle() {
// 		return this.text.getStyle();
// 	}
// 	indexOf(element) {
// 		return this.text.indexOf(element);
// 	}
// 	isEmpty() {
// 		return this.text.isEmpty();
// 	}
// 	isRecursive() {
// 		return this.text.isRecursive();
// 	}
// 	iterator() {
// 		return this.text.iterator();
// 	}
// 	lastIndexOf(element) {
// 		return this.text.lastIndexOf(element);
// 	}
// 	listIterator(index = undefined) {
// 		return this.text.listIterator(index);
// 	}
// 	splitIterator() {
// 		return this.text.splitIterator();
// 	}
// 	subList(fromIndex, toIndex) {
// 		return this.text.subList(fromIndex, toIndex);
// 	}
// 	withChatLineId(chatLineId = undefined) {
// 		return this.text.withChatLineId(chatLineId);
// 	}
// 	withRecursive(recursive = true) {
// 		return this.text.withRecursive(recursive);
// 	}
// 	withText(value) {
// 		return this.text.withText(value);
// 	}
// 	withTextAt(index, value) {
// 		return this.text.withTextAt(index, value);
// 	}
// }
