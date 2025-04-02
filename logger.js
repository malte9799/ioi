/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

const LogType = com.chattriggers.ctjs.engine.LogType;

class Logger {
	constructor() {
		this.isDev = isDev();
		this.loglevel = this.isDev ? 3 : 2; //0=none, 1=error, 2=warn, 3=info, 4=debug
		this.logToMcChat = false;
		this.logPrefixes = ['[ioi]       ', '[ioi:ERROR] ', '[ioi:WARN]  ', '[ioi:INFO]  ', '[ioi:DEBUG] '];
		this.chatPrefix = '&6[ioi]&7 ';
		this.info('Logger initialised');
	}

	log(msg) {
		Console.println(this.format(msg), LogType.INFO);
	}
	info(msg) {
		Console.println(this.format(msg), LogType.INFO);
	}
	warn(msg) {
		Console.println(this.format(msg), LogType.WARN);
	}
	error(msg) {
		Console.println(this.format(msg), LogType.ERROR);
	}

	format(msg) {
		msg = 'ioi ' + msg;
		try {
			msg = msg.replaceAll('\n', '\nioi ');
		} catch (e) {}
		msg.match(/net\.minecraft\.class_\d*/gm)?.forEach((e) => {
			try {
				msg = msg.replace(e, Mappings.unmapClassName(e).replaceAll('/', '.'));
			} catch (e) {}
		});
		return msg;
	}

	chat(message) {
		if (typeof message == 'array') ChatLib.chat(new TextComponent(this.chatPrefix, ...message));
		else ChatLib.chat(new TextComponent(this.chatPrefix + message));
	}
}

let devs = ['a305d4d6bec04983ab0a356a45ae849d'];

function isDev() {
	return devs.includes(Player.getUUID().toString().replace(/-/g, ''));
}

if (!global.ioi.logger) {
	global.ioi.logger = new Logger();
	register('gameUnload', () => {
		global.ioi.logger = undefined;
	});
}
export default global.ioi.logger;
