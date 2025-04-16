/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

const StatusEffectInstance = net.minecraft.entity.effect.StatusEffectInstance;
const StatusEffects = net.minecraft.entity.effect.StatusEffects;

class NightVision extends Feature {
	constructor() {
		super();

		this.description = 'Automatically applies a permanent night vision effect.';

		this.isDefaultEnabled = false;
	}

	initSettings(Settings) {}

	onEnable() {
		setTimeout(() => {
			Player.toMC().addStatusEffect(new StatusEffectInstance(StatusEffects.NIGHT_VISION, -1, 255, false, false));
		}, 100);
		this.registerEvent('worldLoad', () => {
			setTimeout(() => {
				Player.toMC().addStatusEffect(new StatusEffectInstance(StatusEffects.NIGHT_VISION, -1, 255, false, false));
			}, 100);
		});
	}

	onDisable() {}
}
module.exports = {
	class: new NightVision(),
};
