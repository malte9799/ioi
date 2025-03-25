/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';

class ProgressBar extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerActionBar('Progress: ${current}/${total}', (current, total, event) => {
			if (total.includes(' ')) return;
			cancel(event);
			const counter = new TextComponent(`§c${current}§7/§a${total}`);
			const percent = new TextComponent(`§7[${Math.round((current / total) * 10000) / 100}%]`);
			const length = 20;
			const barCount = (current / total) * length;
			const prograssBar = new TextComponent('§7[', `§a${'|'.repeat(barCount)}§c${'|'.repeat(length - barCount)}`, '§7]');
			ChatLib.actionBar(new TextComponent(prograssBar, '  ', counter, '  ', percent));
		});
	}

	onDisable() {}
}
module.exports = {
	class: new ProgressBar(),
};
