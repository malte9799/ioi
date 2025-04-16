/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

class Auction extends Feature {
	constructor() {
		super();

		this.description = 'Displays price per unit after the total price for stacked items.';

		this.isDefaultEnabled = true;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('guiOpened', (gui, event) => {
			Client.scheduleTask(1, () => {
				if (!Player.getContainer()?.getName()?.getString()?.includes('Auction House')) return;
				const items = Player.getContainer().getItems().slice(0, -36);
				items.forEach((item, i) => {
					if (!item) return;
					const stackSize = item.getStackSize();
					if (stackSize == 1) return;
					let lore = item.getLore().map((line) => {
						if (!line.unformattedText.includes('ᴘʀɪᴄᴇ')) return line;
						const price = line.unformattedText.match(/ᴘʀɪᴄᴇ: \$([0-9,]+)/)[1].replaceAll(',', '') / stackSize;
						const priceString = Math.round(price)
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
						return new TextComponent(line, ` §7[${stackSize}x§a$${priceString}§7]`);
					});
					item.setLore(lore);
				});
			});
		});
	}

	onDisable() {}
}
module.exports = {
	class: new Auction(),
};
