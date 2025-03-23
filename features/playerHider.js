/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/feature';
import logger from '../logger';

const PlayerEntity = Java.type('net.minecraft.entity.player.PlayerEntity');

class PlayerHider extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = false;

		this.npcs = new Set();
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('renderEntity', (entity, partialTicks, event) => {
			if (entity.toMC() instanceof PlayerEntity) {
				if (entity.getPing() == -1) return;

				this.npcs.forEach((pos) => {
					const [x, y, z] = pos.split('-');
					if (entity.distanceTo(x, y, z) < 2) {
						cancel(event);
					}
				});
			}
		});

		this.registerStep(false, 5, () => {
			this.npcs.clear();
			World.getAllPlayers()
				.filter((e) => e.getPing() == -1)
				.forEach((npc) => {
					const x = npc.getX();
					const y = npc.getY();
					const z = npc.getZ();
					this.npcs.add(`${x}-${y}-${z}`);
				});
		});
	}

	onDisable() {}
}
module.exports = {
	class: new PlayerHider(),
};
