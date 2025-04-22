/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

const HOE = new Item(new ItemType('minecraft:sponge'));
const SHOVEL = new Item(new ItemType('minecraft:soul_sand'));
const AXE = new Item(new ItemType('minecraft:pumpkin'));

class WitherMine extends Feature {
	constructor() {
		super();

		this.description = 'Displays the block to mine with the selected tool.';

		this.isDefaultEnabled = false;
		this.isHidden = true;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('renderOverlay', () => {
			if (this.dataLoader.getLocation() != 'Wither Mine') return;
			const x = Renderer.screen.getWidth() / 2;
			const y = Renderer.screen.getHeight() / 2;
			const item = Player.getHeldItem()?.getType()?.getRegistryName();
			if (!item) return;
			if (item.includes('_hoe')) HOE.draw(x, y, 2);
			if (item.includes('_shovel')) SHOVEL.draw(x, y, 2);
			if (item.includes('_axe')) AXE.draw(x, y, 2);
		});

		this.registerSoundPlay('minecraft:block.note_block.snare', (pos, name, volume, pitch, category, event) => {});
	}

	onDisable() {}
}
module.exports = {
	class: new WitherMine(),
};
