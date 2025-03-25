/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';

const quickActionKey = new KeyBind('Quick Action', Keyboard.KEY_R, 'TrappedMC');

class QuickAction extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;
	}

	initSettings(Settings) {}

	onEnable() {
		quickActionKey.registerKeyPress(() => {
			if (!Player.getHeldItem()) return;
			const hand = Player.getHeldItem().type.getRegistryName().split(':')[1];
			switch (true) {
				case hand.includes('pickaxe'):
					ChatLib.command('s');
					break;
				case hand.includes('fishing_rod'):
					ChatLib.command('fish sellall');
					// TODO: Rank check
					break;
				case hand.includes('axe') || hand.includes('hoe') || hand.includes('shovel'):
					ChatLib.command('sellall');
					break;
				case hand.includes('_block') && hand.includes('raw_'):
					ChatLib.command('uncondense');
					break;
				case hand.includes('raw_') || hand.includes('_ingot') || hand.includes('_nugget'):
					ChatLib.command('condense');
					break;
			}
		});

		this.registerEvent('guiKey', (key, keycode, gui, event) => {
			if (keycode != quickActionKey.getKeyCode()) return;
			const inv = Player.getContainer();
			if (!inv) return;
			const name = ChatLib.removeFormatting(inv.getName());

			const slot = Client.currentGui.getSlotUnderMouse();
			if (!slot) return;
			const index = slot.index <= 8 ? slot.index + 27 : slot.index - 9;
			const item = slot.item;
			const invSize = inv.getSize() - 36;

			switch (name) {
				case 'Crafting': {
					if (!item.type.getRegistryName().includes('_block')) return;
					inv.click(index + invSize - 1);
					inv.click(1);
					inv.click(0, true);
				}
				case 'Repair & Disenchant': {
					inv.click(index + invSize, true);
					inv.click(2, true);
				}
			}
		});

		this.registerCommand('s', () => {
			new Thread(() => {
				ChatLib.command('blocks');
				Thread.sleep(100);
				ChatLib.command('sellall');
			}).start();
		});
	}

	onDisable() {}
}
module.exports = {
	class: new QuickAction(),
};
