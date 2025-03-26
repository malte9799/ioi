/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';

class SuperBreaker extends Feature {
	constructor() {
		super();
		this.isDefaultEnabled = true;

		this.baseCooldown = 240;
		this.cooldownT = 0;
		this.baseLength = 22;
		this.mineReset = undefined;
		this.setCooldown = (sec) => {
			if (isNaN(sec)) {
				logger.chat(sec);
				return;
			}
			const icm = Player.toMC().itemCooldownManager;
			icm.set(new Item(new ItemType('netherite_pickaxe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('diamond_pickaxe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('golden_pickaxe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('iron_pickaxe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('stone_pickaxe')).toMC(), sec * 20);
			icm.set(new Item(new ItemType('wooden_pickaxe')).toMC(), sec * 20);
		};
		this.hasCooldown = () => {
			const icm = Player.toMC().itemCooldownManager;
			try {
				return false || icm.isCoolingDown(new Item(new ItemType('netherite_pickaxe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('diamond_pickaxe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('gold_pickaxe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('iron_pickaxe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('stone_pickaxe')).toMC()) || icm.isCoolingDown(new Item(new ItemType('wooden_pickaxe')).toMC());
			} catch (e) {
				return false;
			}
		};
	}

	initSettings(Settings) {
		this.Settings = Settings;
		Settings.addProperty('SWITCH', {
			name: 'Cooldown Display',
			descrption: 'Displayes an cooldown (like on enderpearls) on all pickaxes while SuperBreaker is charging.',
			category: 'Mining',
			subcategory: '',
		});
		Settings.addProperty('SWITCH', {
			name: "'worn off' Sound",
			descrption: 'Plays a sound when Super Breaker wears off.',
			category: 'Mining',
			subcategory: '',
		});
	}

	onEnable() {
		this.alert = this.registerStep(true, 2, () => {
			new Sound({ source: 'block.note_block.pling', category: Sound.Category.MASTER, pitch: 1.5, volume: 1 }).play();
		}).unregister();
		this.sbcancel = this.registerEvent('playerInteract', (action, pos, event) => {
			if (action.getName() !== 'UseBlock' && action.getName() !== 'UseItem') return;
			if (!Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_pickaxe')) return;
			if (this.mineReset && this.mineReset - Date.now() > 25 * 1000) return;
			if (this.mineReset && Date.now() > this.mineReset) {
				this.mineReset = undefined;
				this.sbcancel.unregister();
				return;
			}
			const sec = Math.floor((this.mineReset - Date.now()) / 1000);
			new Sound({ source: 'block.note_block.bass' }).play();
			logger.chat(`§cCanceled §eSuper Breaker §cactivation, because §athe mine will reset in ${sec} second${sec > 1 ? 's' : ''}.`);
			cancel(event);
		}).unregister();

		this.registerChat('You ready your pickaxe.', () => {
			this.alert.unregister();
		});
		this.registerChat('**SUPER BREAKER ACTIVATED**', () => {
			this.cooldownT = Date.now();
			this.setCooldown(this.baseLength);
		});
		this.registerChat('**Super Breaker has worn off**', () => {
			this.cooldownT = Date.now();
			new Sound({ source: 'minecraft:block.conduit.deactivate' }).play();
			this.setCooldown(this.baseCooldown);
		});
		this.registerChat('Your Super Breaker ability is refreshed!', () => {
			this.alert.register();
			this.cooldownT = 0;
			if (this.hasCooldown()) {
				this.setCooldown(0);
			}
		});
		this.registerChat('You are too tired to use that ability again. (${sec}s)', (sec, event) => {
			if (this.hasCooldown()) return;
			this.setCooldown(sec);
		});
		this.registerEvent('worldLoad', () => {
			let timeSince = Math.floor((Date.now() - this.cooldownT) / 1000);
			if (timeSince >= this.baseCooldown) return (this.cooldownT = 0);
			Client.scheduleTask(1, () => {
				this.setCooldown(this.baseCooldown - timeSince);
			});
		});

		this.registerChat('Mine ${mine} resetting in ${sec} ${second_s}', (mine, sec, _, event) => {
			if (!this.mineReset) this.sbcancel.register();
			this.mineReset = Date.now() + sec * 1000;
		});
	}

	onDisable() {
		if (this.hasCooldown()) this.setCooldown(0);
	}
}
module.exports = {
	class: new SuperBreaker(),
};

new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
