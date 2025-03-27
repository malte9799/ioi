/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/Feature';
import logger from '../logger';

class Parkour extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = false;

		this.parkourStarted = undefined;
	}

	initSettings(Settings) {}

	onEnable() {
		// Display Parkour Leaderboard while in Parkour
		this.leaderBoardChecker = this.registerStep(false, 30, () => {
			ChatLib.command('parkour lb');
		}).unregister();
		this.registerChat('| WARPS | Teleported to Parkour!', () => {
			this.parkourStarted = Date.now();
			this.leaderBoardChecker.register();
		});

		this.registerChat();

		// | EVENTS | The parkour competition has ended.
		// --- greenhouse Competition Leaderboard ---
		// 1. jeck14 - 111.00s
		// 2. Asymetriia - 128.85s
		// 3. Dibbeding - 186.45s
		// -----------------
	}

	onDisable() {
		this.parkourStarted = undefined;
		this.leaderBoardChecker?.unregister();
	}
}
module.exports = {
	class: new Parkour(),
};
