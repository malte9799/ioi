/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';
import Render from '../utils/Render';

const ITEM = new Item(new ItemType('minecraft:lime_stained_glass_pane'));
class EasyClaim extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;

		this.claimList = ['Keys', 'GPUs', 'Prestige', 'Contraband', 'Pets', 'Drops', 'Farming Crates', 'Mine Crates', 'Fishing Crates', 'Fishing Rewards', 'Champion'];
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('postGuiRender', (mouseX, mouseY, gui, event) => {
			if (!this.claimList.includes(Player.getContainer()?.getName()?.getString())) return;

			Player.getContainer()
				.getItems()
				.slice(0, -36)
				.forEach((item, index) => {
					if (!item || !item.getLore() || ChatLib.removeFormatting(item.getName()) == ' ') return;
					const lore = ChatLib.removeFormatting(item.getLore().join(' '));
					if (!lore.includes('You have ')) return;
					const count = lore.match(/You have ([0-9.]+)/)[1];
					if (count == 0) return;
					if (item.getStackSize() != count) item.setStackSize(count);
					const [x, y] = Render.getSlotCenter(index);
					// Render.item({ item: ITEM, x, y });
					Render.rect({ x, y, z: 200, scale: 16, color: Renderer.GOLD });
				});
		});
	}

	onDisable() {}
}
module.exports = {
	class: new EasyClaim(),
};
