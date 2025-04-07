/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import logger from 'ioi/logger';

// IDK yet: Titel when you get a chamber?
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
