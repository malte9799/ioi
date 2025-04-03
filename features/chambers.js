/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';

class Chambers extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| CHAMBERS | You have entered a secret chamber!', () => {});
		this.registerSoundPlay('minecraft:entity.elder_guardian.ambient', (pos) => {});
	}

	onDisable() {}
}
module.exports = {
	class: new Chambers(),
};
