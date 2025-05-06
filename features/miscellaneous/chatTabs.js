/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';

class ChatTabs extends Feature {
	constructor() {
		super();

		this.description = "When in gang chat or in a private conversation prefills the chat input box with '/gc ' or '/msg {player} '.";

		this.isDefaultEnabled = true;

		this.prefix = undefined;

		this.msg = undefined;
		this.gangChat = false;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerChat('You are now in private conversation with ${player}.', (player) => {
			this.msg = player;
		});
		this.registerChat('You are no longer in private conversation with ${player}.', (player) => {
			this.msg = undefined;
		});
		this.registerChat('Gang Chat has been enabled', () => {
			this.gangChat = true;
		});
		this.registerChat('Gang Chat has been disabled', () => {
			this.gangChat = false;
		});

		this.registerEvent('guiOpened', (gui) => {
			if (gui.getTitle().getString() !== 'Chat screen' || (!this.gangChat && !this.msg)) return;
			Client.scheduleTask(1, () => {
				if (Client.getCurrentChatMessage()) return;
				Client.setCurrentChatMessage(this.gangChat ? '/gc ' : `/msg ${this.msg} `);
			});
		});
	}

	onDisable() {}
}
module.exports = {
	class: new ChatTabs(),
};
