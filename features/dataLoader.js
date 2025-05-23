/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

class DataLoader extends Feature {
	constructor() {
		super();

		this.description = '';

		this.isDefaultEnabled = true;
		this.isHidden = true;
		this.isTogglable = false;

		this.locations = {};

		this.location = undefined;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| WARPS | Teleported to ${loc}!', (loc, event) => {
			this.location = loc;
			if (loc.length == 1) {
			}
		});
	}

	getLocation() {
		return this.location;
	}

	onDisable() {}
}
module.exports = {
	class: new DataLoader(),
};
