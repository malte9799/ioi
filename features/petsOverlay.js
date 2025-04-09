/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

import DB from 'ioi/db';

class PetsOverlay extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('guiOpened', (gui, event) => {
			if (gui.getTitle().getString() !== 'Pet Select') return;
			Client.scheduleTask(1, () => {
				const pets = Player.getContainer().getItems().slice(12, 15);
			});
		});
	}

	onDisable() {}
}
module.exports = {
	class: new PetsOverlay(),
};
