/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

import DB from 'ioi/db';
import tabcompletion from 'ioi/utils/tabcompletion';

class HotKeys extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;

		if (!DB.hotKeys) DB.hotKeys = {};
		this.keyBinds = [];
	}

	initSettings(Settings) {}

	onEnable() {
		Object.entries(DB.hotKeys).forEach(([keyCode, action]) => {
			this.add(keyCode, action);
		});

		this.registerCommand(
			'hotkey',
			(...args) => {
				switch (args[0]) {
					case 'add':
						this.add(0, args.slice(1).join(' '));
						break;
					case 'remove':
						this.remove(args.slice(1).join(' '));
						break;
					case 'list':
					default:
						logger.chat('&6HotKeys:');
						this.keyBinds.forEach((keyBind) => {
							logger.chat(`${keyBind.getDescription()}: ${action}`);
						});
						break;
				}
			},
			tabcompletion({
				add: [],
				remove: () => this.keyBinds.map((keyBind) => keyBind.getDescription()),
				list: [],
			})
		);
	}

	onDisable() {
		DB.hotKeys = {};
		this.keyBinds.forEach((keyBind) => {
			DB.hotKeys[keyBind.getKeyCode()] = keyBind.getDescription();
			keyBind.unregisterKeyPress();
		});
		this.keyBinds = [];
	}

	add(keyCode, action) {
		const keyBind = new KeyBind(action, keyCode, 'IoI - HotKeys');
		keyBind.registerKeyPress(() => {
			if (action.startsWith('/')) ChatLib.command(action.slice(1));
			else ChatLib.say(action);
		});
		this.keyBinds.push(keyBind);
	}
	remove(action2) {
		this.keyBinds = this.keyBinds.filter((keyBind) => {
			const action = keyBind.getDescription();
			if (action2 === action) {
				keyBind.unregisterKeyPress();
			}
			return action2 !== action;
		});
	}
}
module.exports = {
	class: new HotKeys(),
};
