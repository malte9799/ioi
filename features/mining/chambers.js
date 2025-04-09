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
		// this.registerChat('| CHAMBERS | You have entered a secret chamber!', () => {});
		this.registerChat('| CHAMBERS | You sense a great chamber near by...', () => {
			Client.showTitle('', '§7Chamber nearby...');
		});
		this.registerSoundPlay('minecraft:entity.elder_guardian.ambient', (pos) => {
			// const s = new Sound({ source: 'entity.warden.heartbeat', x: pos.x, y: pos.y, z: pos.z });
			// new Thread(() => {
			// 	s.play();
			// 	Thread.sleep(100);
			// 	s.play();
			// 	Thread.sleep(100);
			// 	s.play();
			// 	Thread.sleep(100);
			// 	s.play();
			// }).start();
		});
	}

	onDisable() {}
}
module.exports = {
	class: new Chambers(),
};
