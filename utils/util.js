/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

const ComponentMap = net.minecraft.component.ComponentMap;
const NbtOps = net.minecraft.nbt.NbtOps;
const AbstractNbtList = net.minecraft.nbt.AbstractNbtList;
const NbtCompound = net.minecraft.nbt.NbtCompound;

export default class Utils {
	/**
	 * Maps a number from one range to another.
	 * Optionally clamps the output to the output range.
	 *
	 * @param {number} value The number to map.
	 * @param {number} inMin The minimum value of the input range.
	 * @param {number} inMax The maximum value of the input range.
	 * @param {number} outMin The minimum value of the output range.
	 * @param {number} outMax The maximum value of the output range.
	 * @param {boolean} [clamp=false] Whether to clamp the output value to the output range.
	 * @returns {number} The mapped value.
	 */
	static mapRange(value, inMin, inMax, outMin, outMax, clamp = false) {
		const normalizedValue = (value - inMin) / (inMax - inMin);
		let mappedValue = outMin + normalizedValue * (outMax - outMin);

		if (clamp) {
			// Determine the actual min and max of the output range
			const actualOutMin = Math.min(outMin, outMax);
			const actualOutMax = Math.max(outMin, outMax);
			mappedValue = Math.max(actualOutMin, Math.min(mappedValue, actualOutMax));
		}

		return mappedValue;
	}
}

// const unwrapTag = () => {};

// const addCompound = (nbt) => {
// 	nbt.getKeys().forEach((key) => {
// 		const nested = nbt.get(key) instanceof AbstractNbtList || nbt.get(key) instanceof NbtCompound;
// 		if (nested) {
// 		}
// 	});
// };
// const addList = () => {};
// const addValue = () => {};
