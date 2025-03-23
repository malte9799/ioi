/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/feature';
import logger from '../logger';

class AreaTracker extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;
		this.isHidden = true;
		this.isTogglable = false;

		this.locations = {};
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| WARPS | Teleported to ${loc}!', (loc, event) => {
			if (loc.length == 1) {
			}
		});
	}

	onDisable() {}
}
module.exports = {
	class: new AreaTracker(),
};
