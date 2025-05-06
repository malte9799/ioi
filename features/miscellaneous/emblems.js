/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import TextLib from 'ioi/utils/TextLib';

class Emblems extends Feature {
	constructor() {
		super();

		this.description = 'Tracks active emblem boosters and displays their remaining time using BossBars.';

		this.isDefaultEnabled = true;

		this.boosts = new Map();
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('| EMBLEMS | You have activated a ${min} minute ${type} booster!', (min, type, event) => {
			if (this.boosts.has(type)) {
				const { start, duration, bossBar } = this.boosts.get(type);
				this.boosts.set(type, { start, duration: duration + min * 60000, bossBar });
			} else {
				const bossBar = BossBars.addBossBar({ name: this.getBossBarName(type, Date.now(), min * 60000), percent: 1.0, color: this.getBossBarColor(type) }).setStyle(BossBars.Style.TEN);
				this.boosts.set(type, { start: Date.now(), duration: min * 60000, bossBar });
			}
		});

		this.registerStep(true, 1, () => {
			if (this.boosts.size == 0) return;
			const now = Date.now();
			this.boosts.forEach(({ start, duration, bossBar }, type) => {
				if (now >= start + duration) {
					BossBars.removeBossBar(bossBar);
					this.boosts.delete(type);
					return;
				}
				if (!BossBars.getBossBars().find((b) => b.getUUID() == bossBar.getUUID())) {
					bossBar = BossBars.addBossBar({ name: bossBar.getName(), percent: bossBar.getPercent(), color: bossBar.getColor() }).setStyle(bossBar.getStyle());
					this.boosts.set(type, { start, duration, bossBar });
				}
				bossBar.setName(this.getBossBarName(type, start, duration));
				bossBar.setPercent(1.0 - (now - start) / duration);
			});
		});
	}

	onDisable() {
		this.boosts.forEach(({ bossBar }, type) => {
			BossBars.removeBossBar(bossBar);
			this.boosts.delete(type);
		});
	}

	getBossBarName(type, start, duration) {
		const timeUntil = new Date(duration - Date.now() + start);
		const min = timeUntil.getMinutes() ? timeUntil.getMinutes() + 'm ' : '';
		const sec = timeUntil.getSeconds() + 's';
		return `${this.getBossBarNameColor(type)}${type} Boost (Emblems) §7-§r ${min}${sec}`;
	}
	getBossBarNameColor(type) {
		switch (type) {
			case 'Haste I':
				return TextLib.ColorCode.YELLOW;
			case 'Haste II':
				return TextLib.ColorCode.GREEN;
			case 'Haste III':
				return TextLib.ColorCode.GOLD;
			case 'Fishing Frenzy I':
				return TextLib.ColorCode.AQUA;
            case 'Replant I':
                return TextLib.ColorCode.GOLD
            case 'mcMMO Herbalism I':
                return TextLib.ColorCode.GOLD
			default:
				return TextLib.ColorCode.WHITE;
		}
	}
	getBossBarColor(type) {
		switch (type) {
			case 'Haste I':
				return BossBars.Color.YELLOW;
			case 'Haste II':
				return BossBars.Color.GREEN;
			case 'Haste III':
				return BossBars.Color.RED;
			case 'Fishing Frenzy I':
				return BossBars.Color.BLUE;
            case 'Replant I':
                return BossBars.Color.YELLOW
            case 'mcMMO Herbalism I':
                return BossBars.Color.YELLOW
			default:
				return BossBars.Color.WHITE;
		}
	}
}
module.exports = {
	class: new Emblems(),
};
