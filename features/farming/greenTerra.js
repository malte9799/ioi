/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import logger from 'ioi/logger';

// Displayes the Green Terra cooldown on all Hoes
class GreenTerra extends Feature {
	constructor() {
		super();

		this.description = 'Displayes the Green Terra cooldown on all Hoes';

		this.isDefaultEnabled = true;

		this.baseCooldown = 240;
		this.cooldownT = 0;
		this.baseLength = 22;
		this.setCooldown = (sec) => {
			if (isNaN(sec)) {
				logger.chat(sec);
				return;
			}
			const icm = Player.toMC().itemCooldownManager;
			icm.set(new Item(new ItemType('netherite_hoe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('diamond_hoe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('golden_hoe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('iron_hoe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('stone_hoe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('wooden_hoe')).toMC(), sec * 20);
		};
		this.hasCooldown = () => {
			const icm = Player.toMC()?.itemCooldownManager;
			if (!icm) return false;
			try {
				return false || icm.isCoolingDown(new Item(new ItemType('netherite_hoe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('diamond_hoe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('gold_hoe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('iron_hoe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('stone_hoe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('wooden_hoe')).toMC());
			} catch (e) {
				return false;
			}
		};
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('**GREEN TERRA ACTIVATED**', () => {
			this.cooldownT = Date.now();
			this.setCooldown(this.baseLength);
		});
		this.registerChat('**Green Terra has worn off**', () => {
			this.cooldownT = Date.now();
			new Sound({ source: 'minecraft:block.conduit.deactivate' }).play();
			this.setCooldown(this.baseCooldown);
		});
		this.registerChat('Your Green Terra ability is refreshed!', (event) => {
			if (Date.now() - this.cooldownT < this.baseLength * 1000) return cancel(event);
			this.cooldownT = 0;
			if (this.hasCooldown()) {
				this.setCooldown(0);
			}
		});
		this.registerChat('You are too tired to use that ability again. (${sec}s)', (sec, event) => {
			if (this.hasCooldown() || !Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_hoe')) return;
			this.setCooldown(sec);
		});
		this.registerEvent('worldLoad', () => {
			let timeSince = Math.floor((Date.now() - this.cooldownT) / 1000);
			if (timeSince >= this.baseCooldown) return (this.cooldownT = 0);
			Client.scheduleTask(1, () => {
				this.setCooldown(this.baseCooldown - timeSince);
			});
		});
	}

	onDisable() {
		if (this.hasCooldown()) this.setCooldown(0);
	}
}
module.exports = {
	class: new GreenTerra(),
};
