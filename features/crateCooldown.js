/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
class CrateCooldown extends Feature {
	constructor() {
		super();

		this.description = 'Displays a 30-second cooldown on all crates when you find one.';

		this.isDefaultEnabled = true;

		this.lastCrate;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| CRATES | You just received a crate. Claim it with /claim!', (event) => {
			Player.toMC().itemCooldownManager.set(new Item(new ItemType('player_head')).toMC(), 30 * 20);
			// new Sound({ source: 'minecraft:block.note_block.pling' }).play();
			// Client.showTitle('', '&6Crate Found', 10, 10, 10);
			// if (this.lastCrate) {
			// 	cancel(event);
			// 	const duration = Date.now() - this.lastCrate;
			// 	ChatLib.chat('&7| &e&lCRATES&7 |&r You just received a crate. Claim it with &2/claim&r! ' + Math.round(duration / 1000) + 's');
			// }
			// this.lastCrate = Date.now();

			// setTimeout(() => {
			// 	Client.showTitle('', '&aFind a Crate!', 10, 10, 10);
			// 	new Sound({ source: 'minecraft:block.note_block.pling' }).play();
			// }, 30000);
		});
	}

	onDisable() {}
}
module.exports = {
	class: new CrateCooldown(),
};
