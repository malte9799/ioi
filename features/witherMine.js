/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';
import Render from '../utils/renderLib';

const HOE = new Item(new ItemType('minecraft:sponge'));
const SHOVEL = new Item(new ItemType('minecraft:soul_sand'));
const AXE = new Item(new ItemType('minecraft:pumpkin'));

class WitherMine extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('renderOverlay', () => {
			if (this.dataLoader.getLocation() != 'Wither Mine') return;
			const x = Renderer.screen.getWidth() / 2;
			const y = Renderer.screen.getHeight() / 2;
			if (Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_hoe')) Render.item({ item: HOE, x, y, scale: 2 });
			if (Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_shovel')) Render.item({ item: SHOVEL, x, y, scale: 2 });
			if (Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_axe')) Render.item({ item: AXE, x, y, scale: 2 });
		});
	}

	onDisable() {}
}
module.exports = {
	class: new WitherMine(),
};
