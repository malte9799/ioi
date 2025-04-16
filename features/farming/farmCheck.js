/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import logger from 'ioi/logger';

import RenderLib3d from 'ioi/utils/RenderLib3d';
const RenderSystem = Java.type('com.mojang.blaze3d.systems.RenderSystem');

const maxAge = {
	'minecraft:wheat': 7,
	'minecraft:beetroots': 3,
	'minecraft:carrots': 7,
	'minecraft:potatoes': 7,
};

class FarmCheck extends Feature {
	constructor() {
		super();

		this.description = 'Analyzes any farm and displays stats like missing crops or fully grown percentage.';

		this.isDefaultEnabled = true;

		this.grown = 0;
		this.growing = 0;
		this.missingCrops = [];
	}

	initSettings(Settings) {}

	onEnable() {
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
							const block = World.getBlockAt(x, y + 1, z);
							if (!block || block.getState().isAir()) this.missingCrops.push(block.getPos());
							if (maxAge[block.getType().getRegistryName()]) {
								const age = maxAge[block.getType().getRegistryName()];
								if (block.getState().toString().includes(`age=${age}`)) this.grown++;
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
		this.renderT = this.registerEvent('renderWorld', () => {
			World.getAllEntitiesOfType(net.minecraft.entity.ItemEntity).forEach((item) => {
				if (item.toMC().age <= 20) return;
				const pos = new Vec3f(item.getRenderX(), item.getRenderY(), item.getRenderZ());
				RenderLib3d.drawBox({ start: pos.translated(-0.125, 0, -0.125), size: new Vec3f(0.25, 0.25, 0.25), lineWidth: 2 });
			});
			// Renderer.pushMatrix();
			// const playerPos = Player.getPos();
			// Renderer.translate(playerPos.x, playerPos.y, playerPos.z);

			if (this.missingCrops?.length == 0) return;
			const filtered = this.missingCrops
				.filter((pos) => Math.abs(Player.getY() - pos.y) <= 1)
				.sort((a, b) => {
					return a.distanceTo(Player.getPos()) - b.distanceTo(Player.getPos());
				});
			filtered.slice(0, 20).forEach((pos, i, arr) => {
				// if (arr.length >= 50 && pos.distanceTo(Player.getPos()) > 5) return;
				// RenderLib3d.drawBox({ start: pos, size: new Vec3f(1, 0.2, 1), color: Renderer.getColor(255, 255, 255, 100) });

				pos = new Vec3f(pos.x, pos.y, pos.z);
				RenderLib3d.drawBox({ start: pos.translated(0.45, 0.5, 0.45), size: new Vec3f(0.1, 0.1, 0.1), color: Renderer.getColor(255, 63, 63, 100), filled: true, depthTest: filtered.length > 20 });
				RenderLib3d.drawBox({ start: pos.translated(0.45, 0.7, 0.45), size: new Vec3f(0.1, 0.3, 0.1), color: Renderer.getColor(255, 63, 63, 100), filled: true, depthTest: filtered.length > 20 });
				// const color = Renderer.getColor(255, 63, 63, 150);
				// Renderer.pushMatrix().enableDepth(); //.disableCull()
				// Renderer3d.drawLine(Renderer.WHITE, pos.x, pos.y, pos.z, pos.x, pos.y + 1, pos.z, 5);
				// Renderer.popMatrix();
				//
				// Renderer.pushMatrix().translate(pos.x, pos.y, pos.z).enableDepth(); //.disableCull()
				// RenderSystem.lineWidth(2);
				// Renderer3d.begin(Renderer.DrawMode.LINES, Renderer.VertexFormat.LINES);
				// Renderer3d.pos(0, 0, 0).color(color).normal(0, 1, 0).pos(0, 0.5, 0).color(color).normal(0, 1, 0);
				// Renderer3d.draw();
				// RenderSystem.lineWidth(1.0);
				// Renderer.popMatrix();

				// { start = new Vec3i(0, 0, 0), size = new Vec3i(1, 1, 1), end = undefined, color = Renderer.WHITE, depthTest = true, filled = false, lineWidth = 2 }
				// RenderLib3d.drawBox({ start: pos, depthTest: true, color: Renderer.WHITE, lineWidth: 2 });
			});

			// Renderer.popMatrix();
		}).when(() => World.toMC().getRegistryKey().getValue().toString() == 'minecraft:cells');

		this.blockPlaceT = this.registerEvent('blockPlace', (block, item) => {
			// delete this.missingCrops[block.getPos()];
			this.missingCrops = this.missingCrops.filter((pos) => !pos.equals(block.getPos()));
		}).when(() => World.toMC().getRegistryKey().getValue().toString() == 'minecraft:cells');
	}

	onDisable() {}
}
module.exports = {
	class: new FarmCheck(),
};
