/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';
import Render from '../utils/renderLib';
import PogObject from 'PogData';

const DB = new PogObject('trapped', {}, 'data/crates.data.json').autosave();
class CrateTracker extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;

		this.lastKey = undefined;

		this.slots = new Map();
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| KEYS | You have received ${item} [${cahnce}%]!', (item, chance, event) => {
			if (!DB[this.lastKey]) DB[this.lastKey] = {};
			const itemName = `${item} [${chance}%]`;
			DB[this.lastKey][itemName] = (DB[this.lastKey][itemName] || 0) + 1;
		});

		this.registerEvent('playerInteract', (action, pos, event) => {
			if (action.toString() !== 'UseBlock') return;
			const keyList = new Set('minecraft:tripwire_hook', 'minecraft:trial_key', 'minecraft:ominous_trial_key');
			if (!keyList.has(Player.getHeldItem()?.getType()?.getRegistryName())) return;
			if (Player.getHeldItem().getName().includes('Key')) this.lastKey = ChatLib.removeFormatting(Player.getHeldItem().getName().split(' ')[0]);
		});

		this.registerEvent('guiOpened', () => {
			Client.scheduleTask(2, () => {
				if (!Player.getContainer()?.getName()?.getString()?.includes(' Crate')) return;
				const type = Player.getContainer().getName().getString().slice(0, -6);
				if (!DB[type]) return;
				Player.getContainer()
					.getItems()
					.slice(0, -36)
					.forEach((item, i) => {
						if (!item) return;
						const itemName = ChatLib.removeFormatting(item.getName());
						if (!itemName.includes('%')) return;
						const count = DB[type][itemName] || 0;
						if (count == 0) return;
						const total = Object.values(DB[type]).reduce((a, b) => a + b, 0);
						const chance = Math.round((count / total) * 100);
						this.slots.set(i, { count, chance });
					});
			});
		});
		this.registerEvent('guiClosed', () => {
			this.slots.clear();
		});

		this.registerEvent('postGuiRender', () => {
			if (this.slots.size == 0) return;
			if (!Client.isShiftDown()) return;
			if (!Player.getContainer()?.getName()?.getString()?.includes(' Crate')) return;
			this.slots.forEach(({ count, chance }, i) => {
				const [x, y] = Render.getSlotCenter(i);
				const length = count.toString().length;
				let scale = 1 - (length - 1) * 0.125;
				Render.string({
					text: `${count}`,
					x,
					y: y - 8,
					color: Renderer.GOLD,
					scale,
					shadow: true,
					backgroundColor: Renderer.getColor(0, 0, 0, 100),
					align: Render.TOP,
				});
				Render.string({
					text: `§l${chance}%`,
					x,
					y: y + 8,
					z: 500,
					scale: 0.75,
					color: Renderer.WHITE,
					shadow: true,
					backgroundColor: Renderer.getColor(0, 0, 0, 100),
					align: Render.BOTTOM,
				});
			});
		});
	}

	onDisable() {
		DB.save();
	}
}
module.exports = {
	class: new CrateTracker(),
};
