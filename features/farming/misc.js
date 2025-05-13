/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import settings from '../../settings.js';
import huds from 'ioi/huds';
import Utils from '../../utils/util';

const textHud = huds.createTextHud('yawPitch', Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() - 100, 'Yaw: -999.99 Pitch: -999.99');

textHud.onDraw((x, y, str) => {
	Renderer.pushMatrix();
	Renderer.translate(x, y);
	Renderer.scale(textHud.getScale());
	Renderer.drawStringWithShadow(str, 0, 0);
	Renderer.popMatrix();
});

const inCell = () => World?.toMC()?.getRegistryKey()?.getValue()?.toString() == 'minecraft:cells';
const holdingHoe = () => Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_hoe');
class Farming extends Feature {
	constructor() {
		super();

		this.description = 'Miscellaneous farming features';

		this.isDefaultEnabled = true;
		this.isHidden = true;
		this.isTogglable = false;
	}

	initSettings() {
		settings.addProperty('SWITCH', {
			name: 'Yaw & Pitch Display',
			description: 'Displays your yaw and pitch',
			category: 'Farming',
			subcategory: 'Yaw & Pitch',
			value: false,
		});
		settings.addProperty('SELECTOR', {
			name: 'Yaw & Pitch Display type',
			description: 'Choose the type of yaw and pitch display',
			category: 'Farming',
			subcategory: 'Yaw & Pitch',
			options: ['ActionBar', 'Below Crosshair', 'Hud Display'],
		});
		settings.addProperty('PARAGRAPH', {
			name: 'Yaw & Pitch Text',
			descrption: 'The text that is display on the Actionbar and Scoreboard\nYou can use {yaw} and {pitch}',
			category: 'Farming',
			subcategory: 'Yaw & Pitch',
			value: '&6Yaw: {yaw} &bPitch: {pitch}',
		});
	}

	onEnable() {
		this.registerEvent('renderOverlay', () => {
			if (!inCell() || !holdingHoe()) return;
			const type = settings.getValue('Yaw & Pitch Display type');
			const yaw = Player.getYaw().toFixed(2);
			const pitch = Player.getPitch().toFixed(2);
			let text = settings.getValue('Yaw & Pitch Text');
			text = text.replaceAll('{yaw}', yaw);
			text = text.replaceAll('{pitch}', pitch);
			switch (type) {
				case 0: // ActionBar
					ChatLib.actionBar(text);
					break;
				case 1: // Below Crosshair
					// ChatLib.actionBar(Math.round((Player.getYaw() + 225) % 90));
					const x = Utils.mapRange(Math.round((Player.getYaw() + 225) % 90), 0, 90, -20, 20);
					// ChatLib.chat(`§aYaw: ${yaw}§r §bPitch: ${pitch}§r`);
					const offset = 20;
					const color = Math.abs(x) <= 1 ? Renderer.GREEN : Renderer.WHITE;

					Renderer.pushMatrix();
					Renderer.translate(Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2 + offset);
					Renderer.drawRect(color, -20, -0.5, 40, 1);
					Renderer.drawRect(color, -20.5, -2.5, 0.5, 5);
					Renderer.drawRect(color, 20, -2.5, 0.5, 5);
					Renderer.drawRect(color, -0.5, -5, 1, 10);
					Renderer.drawRect(Renderer.RED, -1 + x, -5, 2, 10);

					Renderer.popMatrix();
					break;
				case 2: // Above HotBar
					if (huds.isOpen()) return;
					textHud.text = text;

					Renderer.pushMatrix().translate(textHud.getX(), textHud.getY()).scale(textHud.getScale());
					Renderer.drawRect(Renderer.getColor(0, 0, 0, 80), -2, -2, textHud.getWidth() + 4, textHud.getHeight() + 4);
					Renderer.drawStringWithShadow(textHud.text, 0, 0);
					Renderer.popMatrix();
					// ChatLib.chat(`§aYaw: ${yaw}§r §bPitch: ${pitch}§r`);
					break;
			}
		}).when(() => settings.getValue('Yaw & Pitch Display'), holdingHoe, inCell);
	}

	onDisable() {}
}
module.exports = {
	class: new Farming(),
};
