/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import RenderLib2d from 'ioi/utils/RenderLib2d';

const ITEM = new Item(new ItemType('minecraft:dirt'));

class Base extends Feature {
	constructor() {
		super();

		this.description = "Displays a preview of a vault's contents when hovering over it in the Vault Menu.";

		this.isDefaultEnabled = false;
		this.isHidden = true;

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
				RenderLib2d.drawString({ text: 'Not Cached', x: Renderer.screen.getWidth() / 2, y: 100, color: Renderer.YELLOW });
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
