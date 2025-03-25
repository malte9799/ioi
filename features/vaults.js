/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';
import Render from '../utils/Render';

const ITEM = new Item(new ItemType('minecraft:dirt'));

class Base extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = false;

		this.vaultMenu = [];
		this.vaultItems = {};
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('guiRender', (mouseX, mouseY, gui, event) => {
			if (Player.getContainer()?.getName()?.getString() != 'Your Vaults') return;
			const slot = Client.currentGui.getSlotUnderMouse();
			if (!slot || !slot.item) return;
			if (!ChatLib.removeFormatting(slot.inventory.getName())) return;
			const inv = Player.getContainer();
			const itemName = slot.item.type.getRegistryName();

			if (itemName == 'minecraft:iron_bars') return;
			const vault = ChatLib.removeFormatting(slot.item.getName()).split(' ')[1];
			if (!this.vaultItems[vault]) {
				Render.centerString('Not Cached', Renderer.screen.getWidth() / 2, 100, Renderer.YELLOW);
			} else {
				// TODO: Render Vault Items
			}
		});

		this.registerEvent('guiOpened', (gui, event) => {
			Client.scheduleTask(1, () => {
				if (Player.getContainer()?.getName()?.getString() != 'Your Vaults') return;
				this.vaultMenu = Player.getContainer().getItems().slice(0, -36);
			});
		});

		this.registerEvent('guiClosed', (gui, event) => {
			if (!Player.getContainer()?.getName()?.getString()?.includes('Vault ')) return;
			const inv = Player.getContainer();
			const vault = ChatLib.removeFormatting(inv.getName()).split(' ')[1];
			const items = inv.getItems().slice(0, -36);
			this.vaultItems[vault] = items;
		});
	}

	onDisable() {}
}
module.exports = {
	class: new Base(),
};
