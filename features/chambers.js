/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import logger from 'ioi/logger';

class Chambers extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerSoundPlay('minecraft:entity.elder_guardian.ambient', (pos) => {
			const x = Math.floor(pos.getX());
			const y = Math.floor(pos.getY());
			const z = Math.floor(pos.getZ());
			logger.chat('Chamber: ' + x + ', ' + y + ', ' + z);
		});
	}

	onDisable() {}
}
module.exports = {
	class: new Chambers(),
};
