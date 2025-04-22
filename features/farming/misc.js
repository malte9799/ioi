/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import settings from '../../settings.js';
import huds from 'ioi/huds';

const textHud = huds.createTextHud('yawPitch', 60, 10, 'Yaw: -999.99 Pitch: -999.99');

textHud.onDraw((x, y, str) => {
	Renderer.pushMatrix();
	Renderer.translate(x, y);
	Renderer.scale(textHud.getScale());
	Renderer.drawStringWithShadow(str, 0, 0);
	Renderer.popMatrix();
});

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
			value: true,
		});
		settings.addProperty('SELECTOR', {
			name: 'Yaw & Pitch Display type',
			description: 'Choose the type of yaw and pitch display',
			category: 'Farming',
			subcategory: 'Yaw & Pitch',
			options: ['ActionBar', '[WIP] Below Crosshair', 'Above HotBar'],
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
					// ChatLib.chat(`§aYaw: ${yaw}§r §bPitch: ${pitch}§r`);
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
		}).when(() => settings.getValue('Yaw & Pitch Display'));
	}

	onDisable() {}
}
module.exports = {
	class: new Farming(),
};
