/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

const keyBind = new KeyBind('Open CHat with last Message', Keyboard.KEY_NONE, 'IoI');

class Debug extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;

		this.chatPregix = '';
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerCommand('gc', (...msg) => {
			if (msg.length == 0) {
				if (this.chatPregix == '/gc') {
					ChatLib.chat('&cGang Chat has been disabled');
					this.chatPregix = '';
				} else {
					ChatLib.chat('&aGang Chat has been enabled');
					this.chatPregix = '/gc ';
				}
				return;
			}
			ChatLib.say('/gc ' + msg.join(' '));
			// ChatLib.chat(msg.join(' '));
		});

		this.registerCommand('msg', (...msg) => {
			if (msg.length == 1) {
				const name = msg[0];
				if (this.chatPregix == `/msg ${name} `) {
					ChatLib.chat('&cYou are no longer in private conversation with 9799ms.');
					this.chatPregix = '';
				} else {
					ChatLib.chat('&aYou are now in private conversation with 9799ms.');
					this.chatPregix = `/msg ${name} `;
				}
				return;
			}
			ChatLib.say(`/msg${msg.length > 0 ? ['', ...msg].join(' ') : ''}`);
		});

		keyBind.registerKeyPress(() => {});
	}

	onDisable() {}
}
module.exports = {
	class: new Debug(),
};
