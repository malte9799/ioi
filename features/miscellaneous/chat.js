/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
class Chat extends Feature {
	constructor() {
		super();

		this.description = '';

		this.isDefaultEnabled = false;
        this.isHidden = true;

		this.stats = [
			//
			'Balance',
			'Total Money Earned',
			'Reputation',
			'Silver Balance',
			'Token Balance',
			'Gem Balance',
			'Warps',
			'Wanted Level',

			'BTC Balance',
			'ETH Balance',
			'BNB Balance',
			'LTC Balance',
			'SOL Balance',
			'UNI Balance',
			'ADA Balance',
			'XML Balance',
			'DOGE Balance',

			'',

			'Blocks Mined',
			'Daily Blocks Mined',
			'Fish Caught',
			'Daily Fish Caught',
			'Play Time',
			'Daily Play Time',
		];
	}

	initSettings(Settings) {}

	onEnable() {
		// this.registerEvent('chat').trigger

		this.registerChat("[${player}'s ${stat}]", (player, stat, event) => {
			if (!this.stats.includes(stat)) return;
            global.test = event.message;
			// const msg = event.message;
			// const id = msg.getChatLineId();

            // ChatLib.editChat(id, )
		}).trigger.setContains();

		// [9799ms's Daily Blocks Mined] [9799ms's Total Money Earned]
	}

	onDisable() {}
}
module.exports = {
	class: new Chat(),
};
