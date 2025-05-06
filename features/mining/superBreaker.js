/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import logger from 'ioi/logger';
import settings from '../../settings';

// Displayes the Super Breaker cooldown on all Pickaxes
// Also plays and 'alarm' sound when Super Breaker is ready to use

const mode = {
	cooldown: 'COOLDOWN',
	active: 'ACTIVE',
	inactive: 'INACTIVE',
};

function setCooldown(sec = 0) {
	sec = parseInt(sec);
	const icm = Player.toMC().getItemCooldownManager();
	icm.set(new ItemType('netherite_pickaxe').asItem().toMC(), sec * 20);
	icm.set(new ItemType('diamond_pickaxe').asItem().toMC(), sec * 20);
	icm.set(new ItemType('golden_pickaxe').asItem().toMC(), sec * 20);
	icm.set(new ItemType('iron_pickaxe').asItem().toMC(), sec * 20);
	icm.set(new ItemType('stone_pickaxe').asItem().toMC(), sec * 20);
	icm.set(new ItemType('wooden_pickaxe').asItem().toMC(), sec * 20);
}
function hasCooldown() {
	const icm = Player.toMC().getItemCooldownManager();
	return icm.isCoolingDown(new ItemType('netherite_pickaxe').asItem().toMC());
}

class SuperBreaker extends Feature {
	constructor() {
		super();

		this.description = 'Displays the Super Breaker cooldown on all pickaxes and plays an Alert when SB is ready.';

		this.isDefaultEnabled = true;

		this.baseCooldown = 240;
		this.baseLength = 22;

		this.mineReset = undefined;

		this.cooldown = 0;
	}

	initSettings(Settings) {
		Settings.addProperty('SELECTOR', {
			name: 'Super Breaker Cooldown Type',
			description: "Choose how the cooldown is displayed.\nDo NOT use 'durability' when your pick is not unbreakable.",
			category: 'Mining',
			subcategory: 'Super Breaker',
			options: ['overlay', 'durability'],
			value: 0,
			hidden: true,
		});
	}

	onEnable() {
		this.alert = this.registerStep(false, 2, () => {
			if (!Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_pickaxe')) return;
			if (this.mineReset && this.mineReset > Date.now() && this.mineReset - Date.now() <= 25000) return;
			new Sound({ source: 'minecraft:item.trident.riptide_3', category: Sound.Category.MASTER, volume: 0.25, pitch: 1 }).play();
		}).unregister();
		this.sbcancel = this.registerEvent('playerInteract', (action, pos, event) => {
			if (action.getName() !== 'UseBlock' && action.getName() !== 'UseItem') return;
			if (!Player.getHeldItem()?.getType()?.getRegistryName()?.includes('_pickaxe')) return;
			if (this.mineReset && this.mineReset - Date.now() > 25000) return;
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

		this.registerChat('Mine ${mine} resetting in ${sec} seconds', (mine, sec, _, event) => {
			if (!this.mineReset) this.sbcancel.register();
			this.mineReset = Date.now() + sec * 1000;
		});
		this.registerChat('coal resetting in ${sec} seconds', (sec) => {
			if (!this.mineReset) this.sbcancel.register();
			this.mineReset = Date.now() + sec * 1000;
		});
		this.registerEvent('worldLoad', () => {
			if (this.mode === mode.inactive || this.cooldown === 0) return;
			Client.scheduleTask(1, () => {
				setCooldown(this.cooldown);
			});
		});

		this.registerChat('| RC | Your super breaker cooldown has been reduced by ${sec} seconds.', (sec) => {
			if (this.mode !== mode.cooldown || this.cooldown <= 0) return;
			this.cooldown -= sec;
			if (this.cooldown < 0) this.cooldown = 0;
		});
		this.registerChat('You ready your pickaxe.', () => {
			this.alert.unregister();
			this.mode = mode.inactive;
			this.cooldown = 0;
			if (settings.getValue('Super Breaker Cooldown Type') === 0) setCooldown(0);
		});
		this.registerChat('**SUPER BREAKER ACTIVATED**', () => {
			this.alert.unregister();
			this.mode = mode.active;
			this.cooldown = this.baseLength;
			if (settings.getValue('Super Breaker Cooldown Type') === 0) setCooldown(this.cooldown);
		});
		this.registerChat('**Super Breaker has worn off**', () => {
			this.mode = mode.cooldown;
			this.cooldown = this.baseCooldown;
			new Sound({ source: 'minecraft:block.conduit.deactivate' }).play();
			if (settings.getValue('Super Breaker Cooldown Type') === 0) setCooldown(this.cooldown);
		});
		this.registerChat('Your Super Breaker ability is refreshed!', (event) => {
			if (this.mode == mode.inactive) cancel(event);
			this.alert.register();
			this.mode = mode.inactive;
			this.cooldown = 0;
			if (settings.getValue('Super Breaker Cooldown Type') === 0) setCooldown(0);
		});
		this.registerChat('You are too tired to use that ability again. (${sec}s)', (sec) => {
			this.alert.unregister();
			this.mode = mode.cooldown;
			this.cooldown = sec;
			if (settings.getValue('Super Breaker Cooldown Type') === 0 && !hasCooldown()) setCooldown(this.cooldown);
		});
		this.registerStep(false, 1, () => {
			if (this.mode == mode.inactive) return;
			if (this.cooldown > 0) this.cooldown -= 1;
			if (this.cooldown <= 0) {
				if (this.mode == mode.cooldown) {
					ChatLib.chat('&aYour &eSuper Breaker &aability is refreshed!');
				}
			}
		});
	}

	onDisable() {
		if (hasCooldown()) setCooldown(0);
	}
}
module.exports = {
	class: new SuperBreaker(),
};
