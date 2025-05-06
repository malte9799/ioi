/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import RenderLib2d from 'ioi/utils/RenderLib2d';
import RendererUtils, { Align } from 'ioi/utils/RendererUtils';

class EasyClaim extends Feature {
	constructor() {
		super();

		this.description = 'Highlights claimable items in /rewards.';

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
					const { x, y } = RendererUtils.getSlotPos(index);
					RenderLib2d.drawRect({ x, y, scale: 16, color: Renderer.GOLD });
				});
		});
	}

	onDisable() {}
}
module.exports = {
	class: new EasyClaim(),
};
