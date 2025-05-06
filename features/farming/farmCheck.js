/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import logger from 'ioi/logger';
import settings from 'ioi/settings';

import RenderLib3d from '../../utils/RenderLib3d';
import Utils from '../../utils/util';
import tabcompletion from '../../utils/tabcompletion';

const maxAge = {
	wheat: 7,
	beetroots: 3,
	carrots: 7,
	potatoes: 7,
};
const cropColor = {
	wheat: '§e',
	beetroots: '§c',
	carrots: '§6',
	potatoes: '§a',
};

class FarmCheck extends Feature {
	constructor() {
		super();

		this.description = 'Analyzes any farm and displays stats like missing crops or fully grown percentage. &cUsage: /checkFarm';

		this.isDefaultEnabled = true;

		this.grown = 0;
		this.growing = 0;
		this.missingCrops = [];

		this.layers = [];

		this.drawMode = 'block'; // ['!', '!_outline', 'block]
	}

	initSettings() {
		settings.addProperty('SELECTOR', {
			name: 'Missing crops render mode',
			description: 'Choose how missing crops are rendered.',
			category: 'Farming',
			subcategory: 'Farm Check',
			options: ['!', '! + outline', 'block'],
			value: 0,
		});
	}

	onEnable() {
		// this.farmCommand();
		this.registerCommand('checkFarm', () => {
			if (this.missingCrops.length > 0) {
				this.missingCrops = [];
				logger.chat('Farm Checker Disabled!');
				return;
			}
			this.growing = 0;
			this.grown = 0;
			const minX = Math.round(Player.getX() / 500) * 500 - 24;
			const minY = 69;
			const minZ = Math.round(Player.getZ() / 500) * 500 + 1;

			new Thread(() => {
				for (let y = minY; y < minY + 64; y++) {
					for (let x = minX; x < minX + 49; x++) {
						for (let z = minZ; z < minZ + 49; z++) {
							if (World.getBlockAt(x, y, z)?.getType()?.getRegistryName() != 'minecraft:farmland') continue;
							const crop = World.getBlockAt(x, y + 1, z);
							if (!crop || crop.getState().isAir()) {
								this.missingCrops.push(crop.getPos());
							} else {
								const cropName = crop.getType().getRegistryName().split(':')[1];
								if (!maxAge.hasOwnProperty(cropName)) continue;

								const myMaxAge = maxAge[cropName];
								if (crop.getState().toString().includes(`age=${myMaxAge}`)) this.grown++;
								else this.growing++;
							}
						}
					}
				}

				if (this.missingCrops.length == 0) {
					logger.chat('Fully Planted');
					const perc = Math.floor((this.grown / (this.grown + this.growing)) * 100);
					logger.chat(`${perc}% Grown`);
				} else {
					logger.chat(this.missingCrops.length + ' Crops Missing!');
					this.renderT.register();
					this.blockPlaceT.register();
				}
			}).start();
		});
		this.renderT = this.registerEvent('postRenderWorld', () => {
			// World.getAllEntitiesOfType(net.minecraft.entity.ItemEntity).forEach((item) => {
			// 	if (item.toMC().age <= 20) return;
			// 	const pos = new Vec3f(item.getRenderX(), item.getRenderY(), item.getRenderZ());
			// 	RenderLib3d.drawBox({ start: pos.translated(-0.125, 0, -0.125), size: new Vec3f(0.25, 0.25, 0.25), filled: true, depth: false });
			// });

			if (this.missingCrops?.length == 0) return;
			// const h = Math.cos((((java.lang.System.nanoTime() / 100000) % 20000) / 20000) * Math.PI * 2) / 4;
			const h = 0;
			const color = Renderer.getColor(255, 63, 63, 100);
			const filtered = this.missingCrops
				.filter((pos) => this.missingCrops.length <= 20 || Math.abs(Player.getY() - pos.y) <= 1)
				.sort((a, b) => {
					return a.distanceTo(Player.getPos()) - b.distanceTo(Player.getPos());
				});
			filtered.slice(0, 20).forEach((pos, i, arr) => {
				pos = new Vec3f(pos.x, pos.y, pos.z);
				switch (settings.getValue('Missing crops render mode')) {
					case 1:
						RenderLib3d.drawBox({ start: pos.translated(0.425, 0.45, 0.425), size: new Vec3f(0.15, 0.6, 0.15), color: Renderer.WHITE, depth: filtered.length > 20 });
					case 0:
						RenderLib3d.drawBox({ start: pos.translated(0.45, 0.5 + h, 0.45), size: new Vec3f(0.1, 0.1, 0.1), color, depth: filtered.length > 20 });
						RenderLib3d.drawBox({ start: pos.translated(0.45, 0.7 + h, 0.45), size: new Vec3f(0.1, 0.3, 0.1), color, depth: filtered.length > 20 });
						break;
					case 2:
						RenderLib3d.drawBox({ start: pos, color, depth: filtered.length > 20 });
						RenderLib3d.drawBox({ start: pos, size: new Vec3f(1, 0.1, 1), color: Renderer.GREEN, depth: filtered.length > 20 });
						break;
				}
			});
		}).when(() => World.toMC()?.getRegistryKey()?.getValue()?.toString() == 'minecraft:cells');

		this.blockPlaceT = this.registerEvent('blockPlace', (block, item) => {
			// delete this.missingCrops[block.getPos()];
			this.missingCrops = this.missingCrops.filter((pos) => !pos.equals(block.getPos()));
		}).when(() => World.toMC()?.getRegistryKey()?.getValue()?.toString() == 'minecraft:cells');
	}

	onDisable() {}

	analyseFarm() {
		this.layers = [];
		const minX = Math.round(Player.getX() / 500) * 500 - 24;
		const minY = 69;
		const minZ = Math.round(Player.getZ() / 500) * 500 + 1;

		for (let y = minY; y < minY + 64; y++) {
			let data = { missing: [], growing: {}, grown: {}, y: y + 1 };
			for (let x = minX; x < minX + 49; x++) {
				for (let z = minZ; z < minZ + 49; z++) {
					if (World.getBlockAt(x, y, z)?.getType()?.getRegistryName() != 'minecraft:farmland') continue;
					const crop = World.getBlockAt(x, y + 1, z);
					if (!crop || crop.getState().isAir()) {
						data.missing.push(crop.getPos());
					} else {
						const cropName = crop.getType().getRegistryName().split(':')[1];
						if (!maxAge.hasOwnProperty(cropName)) continue;

						const myMaxAge = maxAge[cropName];
						if (crop.getState().toString().includes(`age=${myMaxAge}`)) {
							if (!data.grown.hasOwnProperty(cropName)) data.grown[cropName] = 0;
							data.grown[cropName]++;
						} else {
							if (!data.growing.hasOwnProperty(cropName)) data.growing[cropName] = 0;
							data.growing[cropName]++;
						}
					}
				}
			}
			if (data.missing.length == 0 && Object.keys(data.growing).length == 0 && Object.keys(data.grown).length == 0) continue;
			this.layers.push(data);
		}
	}

	farmCommand() {
		this.registerCommand(
			'farm',
			(...args) => {
				switch (args[0]) {
					case 'check':
						break;
					case 'info':
						break;
					default:
						this.farmStats();
						break;
				}
			},
			tabcompletion({
				analyse: [],
				info: [],
			})
		);
	}

	farmStats() {
		new Thread(() => {
			ChatLib.chat('&aFarm Analyser');
			if (this.layers.length == 0) this.analyseFarm();

			const missing = this.layers.reduce((acc, cur) => acc + cur.missing.length, 0);
			if (missing > 0) new TextComponent(`&cMissing ${missing} Crops! `, { text: '[👁]', color: Renderer.YELLOW, hoverEvent: { action: 'show_text', value: '&cClick to highlight blocks!' }, clickEvent: { action: 'run_command', value: '/farm check' } }).chat();

			const progressBarLength = 20;
			console.log(JSON.stringify(this.layers, undefined, 2));
			let text = '';
			this.layers.forEach(({ missing, growing, grown, y }) => {
				const growingCount = Object.values(growing).reduce((acc, cur) => acc + cur, 0);
				const grownCount = Object.values(grown).reduce((acc, cur) => acc + cur, 0);
				const total = missing.length + growingCount + grownCount;

				text += '[';

				Object.entries(grown).forEach(([crop, count]) => {
					text += `${cropColor[crop]}§n${'|'.repeat(progressBarLength - Math.round((count / total) * progressBarLength))}`;
				});
				Object.entries(growing).forEach(([crop, count]) => {
					text += `${cropColor[crop]}${'|'.repeat(progressBarLength - Math.round((count / total) * progressBarLength))}`;
				});
				text += `§7${'|'.repeat(progressBarLength - Math.round((missing.length / total) * progressBarLength))}§r]`;
				text += '\n';
			});
			ChatLib.chat(text);
		}).start();
	}
}
module.exports = {
	class: new FarmCheck(),
};
