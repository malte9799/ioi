/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/feature';
import logger from '../logger';
import Render from '../utils/renderLib';

import db from '../db';

const ITEM = new Item(new ItemType('minecraft:orange_stained_glass_pane'));

class CrateTracker extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;

		this.lastKey = undefined;

		if (!db.CrateTracker) db.CrateTracker = {};

		this.slots = new Map();
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| KEYS | You have received ${item} [${cahnce}%]!', (item, chance, event) => {
			if (!db.CrateTracker[this.lastKey]) db.CrateTracker[this.lastKey] = {};
			const itemName = `${item} [${chance}%]`;
			db.CrateTracker[this.lastKey][itemName] = (db.CrateTracker[this.lastKey][itemName] || 0) + 1;
			logger.chat('Opened: ' + this.lastKey + ' and got ' + itemName);
		});

		this.registerEvent('playerInteract', (action, pos, event) => {
			if (action.toString() !== 'UseBlock') return;
			if (Player.getHeldItem()?.getType()?.getRegistryName() != 'minecraft:tripwire_hook') return;
			this.lastKey = ChatLib.removeFormatting(Player.getHeldItem().getName().split(' ')[0]);
		});

		this.registerEvent('guiOpened', () => {
			Client.scheduleTask(1, () => {
				if (!Player.getContainer()?.getName()?.getString()?.includes(' Crate')) return;
				const type = Player.getContainer().getName().getString().slice(0, -6);
				if (!db.CrateTracker[type]) return;
				Player.getContainer()
					.getItems()
					.slice(0, -36)
					.forEach((item, i) => {
						if (!item) return;
						const itemName = ChatLib.removeFormatting(item.getName());
						if (!itemName.includes('%')) return;
						const count = db.CrateTracker[type][itemName] || 0;
						if (count == 0) return;
						const total = Object.values(db.CrateTracker[type]).reduce((a, b) => a + b, 0);
						const chance = Math.round((count / total) * 100);
						this.slots.set(i, { count, chance });
						// const stackSize = item.getStackSize();
						// if (stackSize > 1) {
						// 	item.setName(new TextComponent(`§e${stackSize}x `, item.toMC().getName()));
						// }
						// item.setStackSize(count);
					});
			});
		});
		this.registerEvent('guiClosed', () => {
			this.slots.clear();
		});

		this.registerEvent('postGuiRender', () => {
			if (this.slots.size == 0) return;
			if (!Player.getContainer()?.getName()?.getString()?.includes(' Crate')) return;
			this.slots.forEach(({ count, chance }, i) => {
				const [x, y] = Render.getSlotCenter(i);
				Renderer.pushMatrix()
					.translate(x - 8, y - 8, 300)
					.scale(0.5, 0.5, 1);
				Renderer.drawString(`§l${count}\n§l${chance}%`, 0, 0, Renderer.LIGHT_PURPLE, true);
				Renderer.popMatrix();

				// Renderer.drawStringWithShadow(`§e${count} ${chance}%`, x - 8, y - 8);
				// Render.string(`${count} ${chance}%`, x - 8, y - 8, Renderer.WHITE, true, 300, 0.6);
				// const item = Player.getContainer().getItems().get(i);
				// if (!item) return;
				// Renderer.item(item, x, y, count);
			});
		});
	}

	onDisable() {}
}
module.exports = {
	class: new CrateTracker(),
};
