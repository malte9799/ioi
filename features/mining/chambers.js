/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import logger from 'ioi/logger';

class Chambers extends Feature {
	constructor() {
		super();

		this.description = 'Displays a title text when you find a chamber';

		this.isDefaultEnabled = true;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| CHAMBERS | You sense a great chamber near by...', () => {
			Client.showTitle('', '&7You sense a great chamber nearby...', 5, 40, 10);
		});
		this.registerChat('| CHAMBERS | You sense a chamber near by...', () => {
			Client.showTitle('', '&7You sense a chamber nearby...', 5, 40, 10);
		});
	}

	onDisable() {}
}
module.exports = {
	class: new Chambers(),
};
