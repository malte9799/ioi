/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

class QuestDisplay extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = false;
		this.isHidden = false;
		this.isTogglable = true;
	}

	initSettings(Settings) {}

	onEnable() {
		// Catch ${num} Fish
		// Cach ${num} ${rarity}+ Fish
		// Mine ${num} ${block}
		// Collect ${num} Logs
		// Find ${num} Mine Crates
		// Use the Superbreaker Mining Ability ${num} times
		// Vote for the Server ${num} times
		// Rent a cell for at least ${num} hours
		// Apply a ${rarity|Custom} Enchant
		// Participate in ${num} Vote Parties
		// Earn ${lvl} McMMO Levels
		// Smelt ${num} ${item}
		// Dig ${num} ${block}
		// Loot ${num} Chambers
		// | QUESTS | You completed ${questName}!
	}

	onDisable() {}
}
module.exports = {
	class: new QuestDisplay(),
};
