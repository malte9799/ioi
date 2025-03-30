/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import TextComponent_ from 'ioi/wrapped/TextComponent';
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
		return new TextComponent_(letters.map((letter, index) => ({ text: letter, color: colors[index] })));
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
