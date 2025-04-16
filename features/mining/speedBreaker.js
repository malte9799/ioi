/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

const EntityStatusEffectS2CPacket = Java.type('net.minecraft.network.packet.s2c.play.EntityStatusEffectS2CPacket');

// Playes a sound when Speed Breaker gives you haste and then it runs out
// Only for sb 1 & 2 (3 hives perma haste)
class SpeedBreaker extends Feature {
	constructor() {
		super();

		this.description = 'Plays a sound when you get the Haste effect from SpeedBreaker (only lvl 1-2)';

		this.isDefaultEnabled = false;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerPacketReceived(EntityStatusEffectS2CPacket, (packet, event) => {
			if (packet.getEffectId().getIdAsString() != 'minecraft:haste' || packet.getDuration() == -1) return;
			if (BossBars.getBossBars().some((e) => e.getName().includes('Haste'))) return;

			const effiLevel = Player.getHeldItem()
				.getEnchantments()
				.entrySet()
				.stream()
				.filter((e) => e.toString().includes('efficiency'))
				.findFirst()
				.orElse({ value: 0 }).value;
			if (effiLevel > 5) return;

			new Sound({ source: 'minecraft:block.beacon.activate', pitch: 2 }).play();
			setTimeout(() => {
				new Sound({ source: 'minecraft:block.beacon.deactivate', pitch: 2 }).play();
			}, packet.getDuration() * 50);
		});
	}

	onDisable() {}
}
module.exports = {
	class: new SpeedBreaker(),
};
