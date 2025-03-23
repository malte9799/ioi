/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/feature';
import logger from '../logger';

import db from '../db';

class CrateTracker extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;

		this.lastKey = undefined;

		if (!db.CrateTracker) db.CrateTracker = {};
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| KEYS | You have received ${item} [${cahnce}%]!', (item, chance, event) => {
			if (!db.CrateTracker[this.lastKey]) db.CrateTracker[this.lastKey] = {};
			db.CrateTracker[this.lastKey][item] = (db.CrateTracker[this.lastKey][item] || 0) + 1;
		});

		this.registerEvent('playerInteract', (action, pos, event) => {
			if (action.toString() !== 'UseBlock') return;
			if (Player.getHeldItem()?.getType()?.getRegistryName() != 'minecraft:tripwire_hook') return;
			this.lastKey = Player.getHeldItem().getName().split(' ')[0];
		});
	}

	onDisable() {}
}
module.exports = {
	class: new CrateTracker(),
};
