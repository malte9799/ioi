/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';

class _ extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = false;
		this.isHidden = false;
		this.isTogglable = true;
	}

	initSettings(Settings) {
		Settings.addProperty('SWITCH', {
			name: 'Base',
			descrption: 'Demo Switsch Setting',
			category: '',
			subcategory: '',
		});
	}

	onEnable() {}

	onDisable() {}
}
module.exports = {
	class: new _(),
};
