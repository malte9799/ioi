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

class RollingAverage {
	averages = {};

	/**
	 * Add a value to a named average
	 * @param {string} name - Unique identifier for this average
	 * @param {number} value - The value to add
	 * @param {number} limit - Maximum number of values to keep (window size)
	 *                         Use -1 to disable storage (just track count and sum)
	 * @returns {number} The current average after adding the new value
	 */
	static addValue(name, value, limit = 10) {
		// Initialize if this average doesn't exist yet
		if (!averages[name]) {
			averages[name] = {
				values: limit === -1 ? null : [],
				sum: 0,
				count: 0,
				limit: limit,
			};
		}

		const avg = averages[name];

		// Handle limit change
		if (avg.limit !== limit) {
			// If changing to no storage
			if (limit === -1) {
				avg.values = null;
			}
			// If changing from no storage to storage
			else if (avg.limit === -1 && limit !== -1) {
				avg.values = [];
			}
			// If changing between storage limits
			else if (limit > 0 && avg.values) {
				while (avg.values.length >= limit) {
					const oldestValue = avg.values.shift();
					avg.sum -= oldestValue;
					avg.count--;
				}
			}
			avg.limit = limit;
		}

		// Update stats
		avg.sum += value;
		avg.count++;

		// If storing values (limit != -1)
		if (avg.limit !== -1) {
			// Add the new value
			avg.values.push(value);

			// If we've reached the limit, remove the oldest value
			if (avg.limit > 0 && avg.values.length > avg.limit) {
				const oldestValue = avg.values.shift();
				avg.sum -= oldestValue;
				avg.count--;
			}
		}

		// Return the current average
		return avg.sum / avg.count;
	}

	/**
	 * Get current average without adding a new value
	 * @param {string} name - The name of the average to retrieve
	 * @returns {number} The current average value or 0 if no values exist
	 */
	static getCurrentAverage(name) {
		if (!averages[name] || averages[name].count === 0) {
			return 0;
		}
		return averages[name].sum / averages[name].count;
	}

	/**
	 * Reset a specific average
	 * @param {string} name - The name of the average to reset
	 */
	static resetAverage(name) {
		if (averages[name]) {
			const limit = averages[name].limit;
			averages[name] = {
				values: limit === -1 ? null : [],
				sum: 0,
				count: 0,
				limit: limit,
			};
		}
	}

	/**
	 * Get all values for a specific average
	 * @param {string} name - The name of the average
	 * @returns {Array<number>|null} Array of values, null if storage is disabled, or empty array if none exist
	 */
	static getValues(name) {
		if (!averages[name]) {
			return [];
		}
		return averages[name].values;
	}

	/**
	 * Change limit for an existing average
	 * @param {string} name - The name of the average
	 * @param {number} newLimit - New window size, use -1 to disable storage
	 */
	static setLimit(name, newLimit) {
		if (!averages[name]) return;

		const avg = averages[name];

		// If changing to no storage
		if (newLimit === -1) {
			avg.values = null;
		}
		// If changing from no storage to storage
		else if (avg.limit === -1 && newLimit !== -1) {
			avg.values = [];
		}
		// If changing between storage limits and we have values
		else if (avg.values) {
			while (newLimit > 0 && avg.values.length > newLimit) {
				const removedValue = avg.values.shift();
				avg.sum -= removedValue;
				avg.count--;
			}
		}

		avg.limit = newLimit;
	}

	/**
	 * Get all tracked average names
	 * @returns {Array<string>} Names of all tracked averages
	 */
	static getAverageNames() {
		return Object.keys(averages);
	}

	/**
	 * Check if a named average exists
	 * @param {string} name - The name to check
	 * @returns {boolean} True if the average exists
	 */
	static hasAverage(name) {
		return !!averages[name];
	}

	/**
	 * Get the number of values currently being averaged
	 * @param {string} name - The name of the average
	 * @returns {number} The count of values or 0 if the average doesn't exist
	 */
	static getCount(name) {
		return averages[name]?.count || 0;
	}

	/**
	 * Get the current limit for a specific average
	 * @param {string} name - The name of the average
	 * @returns {number} The current limit (-1 for no storage) or undefined if the average doesn't exist
	 */
	static getLimit(name) {
		return averages[name]?.limit;
	}
}
