/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import RenderLib2d from '../utils/RenderLib2d';
import PogObject from 'PogData';
import RendererUtils, { Align } from '../utils/RendererUtils';

const KeyList = new Set(['minecraft:tripwire_hook', 'minecraft:trial_key', 'minecraft:ominous_trial_key']);
class CrateTracker extends Feature {
	constructor() {
		super();

		this.DB = new PogObject('ioi', {}, 'data/crates.data.json');
		this.DB.autosave();
		this.isDefaultEnabled = true;

		this.lastKey = undefined;

		this.slots = new Map();
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| KEYS | You have received ${item} [${cahnce}%]!', (item, chance, event) => {
			if (!this.DB[this.lastKey]) this.DB[this.lastKey] = {};
			const itemName = `${item} [${chance}%]`;
			this.DB[this.lastKey][itemName] = (this.DB[this.lastKey][itemName] || 0) + 1;
		});

		this.registerEvent('playerInteract', (action, pos, event) => {
			if (action.toString() !== 'UseBlock') return;
			const item = Player.getHeldItem()?.getType()?.getRegistryName();
			if (!item || !KeyList.has(item)) return;
			const [crate, key] = ChatLib.removeFormatting(Player.getHeldItem().getName()).split(' ');
			if (key.toLowerCase() != 'key') return;
			this.lastKey = crate;
		});

		this.registerEvent('guiOpened', () => {
			Client.scheduleTask(2, () => {
				if (!Player.getContainer()?.getName()?.getString()?.includes(' Crate')) return;
				const type = Player.getContainer().getName().getString().slice(0, -6);
				if (!this.DB[type]) return;
				Player.getContainer()
					.getItems()
					.slice(0, -36)
					.forEach((item, i) => {
						if (!item) return;
						const itemName = ChatLib.removeFormatting(item.getName());
						if (!itemName.includes('%')) return;
						const count = this.DB[type][itemName] || 0;
						if (count == 0) return;
						const total = Object.values(this.DB[type]).reduce((a, b) => a + b, 0);
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
				const { x, y } = RendererUtils.getSlotCenter(i);
				const length = count.toString().length;
				let scale = 1 - (length - 1) * 0.125;
				RenderLib2d.drawString({
					text: `${count}`,
					x,
					y: y - 8,
					color: Renderer.GOLD,
					scale,
					shadow: true,
					backgroundColor: Renderer.getColor(0, 0, 0, 100),
					align: Align.TOP,
				});
				RenderLib2d.drawString({
					text: `§l${chance}%`,
					x,
					y: y + 8,
					z: 400,
					scale: 0.75,
					color: Renderer.WHITE,
					shadow: true,
					backgroundColor: Renderer.getColor(0, 0, 0, 100),
					align: Align.BOTTOM,
				});
			});
		});
	}

	onDisable() {
		this.DB.save();
	}
}
module.exports = {
	class: new CrateTracker(),
};
