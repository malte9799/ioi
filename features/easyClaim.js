/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/feature';
import logger from '../logger';
import RenderLib from '../utils/renderLib';

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

			const slots = Player.getContainer()
				.getItems()
				.slice(0, -36)
				.reduce((acc, item, index) => {
					if (!item || !item.getLore() || ChatLib.removeFormatting(item.getName()) == ' ') return acc;
					const lore = ChatLib.removeFormatting(item.getLore().join(' '));
					if (!lore.includes('You have ')) return acc;
					const count = lore.match(/You have ([0-9.]+)/)[1];
					if (count == 0) return acc;
					item.setStackSize(count);
					acc.push(index);
					return acc;
				}, []);

			slots.forEach((slot) => {
				const [x, y] = RenderLib.getSlotCenter(slot);
				RenderLib.drawCenterString('┍━━┑', x, y - 12, Renderer.YELLOW);
				RenderLib.drawCenterString('━━━', x, y - 12, Renderer.YELLOW);
				RenderLib.drawCenterString('┕━━┙', x, y + 4, Renderer.YELLOW);
				RenderLib.drawCenterString('━━━', x, y + 4, Renderer.YELLOW);
			});
		});
	}

	onDisable() {}
}
module.exports = {
	class: new EasyClaim(),
};
