/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';
import ColorCode from '../utils/ColorCode';
import Render from '../utils/Render';
import WorldLib from '../utils/WorldLib';
import { TextC, TextLib } from '../utils/TextLib';
const Color = java.awt.Color;

class Eval extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = logger.isDev;
		this.isHidden = true;
		this.isTogglable = false;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerCommand('eval', (...args) => {
			const id = Math.floor(Math.random() * java.lang.Integer.MAX_VALUE);
			let result;
			try {
				result = eval(args.join(' '));
			} catch (e) {
				logger.error(`Error in Eval:`);
				logger.warn(JSON.stringify(e, undefined, 2));
				if (e.stack) logger.warn(e.stack);
				throw e;
			} finally {
				try {
					new TextComponent({
						text: result?.toString(),
						hoverEvent: { action: 'show_text', value: '§cClick to delete' },
						clickEvent: { action: 'run_command', value: `/deleteid ${id}` },
					})
						.withChatLineId(id)
						.chat();
				} catch (e) {}
				console.log(result);
			}
		});

		this.registerCommand('deleteid', (id) => {
			if (!id) return;
			ChatLib.clearChat(id);
		});
	}

	onDisable() {}
}
module.exports = {
	class: new Eval(),
};
