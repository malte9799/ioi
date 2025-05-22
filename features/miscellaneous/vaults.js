/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import RenderLib2d from 'ioi/utils/RenderLib2d';
import RendererUtils, { Align } from '../../utils/RendererUtils';

const ITEM = new Item(new ItemType('minecraft:dirt'));

class Base extends Feature {
	constructor() {
		super();

		this.description = "Displays a preview of a vault's contents when hovering over it in the Vault Menu.";

		this.isDefaultEnabled = false;
		this.isHidden = true;

		this.vaultMenu = [];
		this.renderMenu = true;
		this.vaultItems = {};
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('guiRender', (mouseX, mouseY, gui, event) => {
			if (Player.getContainer()?.getName()?.getString() != 'Your Vaults') return;

			const slot = Client.currentGui.getSlotUnderMouse();
			let shouldRenderMenu = true;
			if (slot) {
				const vault = slot.index + 1;
				if (!this.vaultItems[vault]) {
					RenderLib2d.drawString({ text: 'Not Cached', x: Renderer.screen.getWidth() / 2, y: 100, color: Renderer.YELLOW });
				} else {
					shouldRenderMenu = false;

					const { x, y } = RendererUtils.getSlotPos(8);
					RenderLib2d.drawString({
						text: `Vault ${vault} preview!`,
						x: x + 16,
						y: y - 3,
						color: Renderer.RED,
						shadow: true,
						align: Align.BOTTOM_RIGHT,
					});
					this.vaultItems[vault].forEach((item, i) => {
						if (!item) return;
						const { x, y } = RendererUtils.getSlotPos(i);
						item.draw(x / 2, y / 2);
						const stackSize = item.getStackSize();
						if (stackSize > 1) {
							// RenderLib2d.drawString({ text: stackSize, x: x + 8, y: y + 8, color: Renderer.WHITE });
							RenderLib2d.drawString({
								text: stackSize,
								x: x + 17,
								y: y + 18,
								z: 1000,
								color: Renderer.WHITE,
								shadow: true,
								align: Align.BOTTOM_RIGHT,
							});
						}
					});
				}
			}
			if (shouldRenderMenu && !this.renderMenu) {
				this.renderMenu = true;
				this.vaultMenu.forEach(({ item, stackSize }) => {
					item.setStackSize(stackSize);
				});
			}
			if (!shouldRenderMenu && this.renderMenu) {
				this.renderMenu = false;
				this.vaultMenu.forEach(({ item, stackSize }) => {
					item.setStackSize(0);
				});
			}
		});

		this.registerEvent('guiOpened', (gui, event) => {
			Client.scheduleTask(1, () => {
				if (Player.getContainer()?.getName()?.getString() != 'Your Vaults') return;
				this.vaultMenu = Player.getContainer()
					.getItems()
					.slice(0, -36)
					.map((item) => {
						return { item, stackSize: item.getStackSize() };
					});
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
