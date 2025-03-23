/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

const LogType = com.chattriggers.ctjs.engine.LogType;

class Logger {
	constructor() {
		this.isDev = isDev();
		this.loglevel = this.isDev ? 3 : 2; //0=none, 1=error, 2=warn, 3=info, 4=debug
		this.logToMcChat = false;
		this.logPrefixes = ['[I0I]       ', '[I0I:ERROR] ', '[I0I:WARN]  ', '[I0I:INFO]  ', '[I0I:DEBUG] '];
		this.chatPrefix = '&6[I0I]&7 ';
		this.info('Logger initialised');
	}

	logMessage(message, level = 0, type = 'log') {
		if (level <= this.loglevel) {
			if (type == 'log') console.log(this.logPrefixes[level] + message);
			else if (type == 'dir') console.dir(message);

			if (this.logToMcChat) {
				ChatLib.chat(this.logPrefixes[level] + message);
			}
		}
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
		msg = 'I0I ' + msg;
		try {
			msg = msg.replaceAll('\n', '\nI0I ');
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

if (!global.trapped.logger) {
	global.trapped.logger = new Logger();
	register('gameUnload', () => {
		global.trapped.logger = undefined;
	});
}
export default global.trapped.logger;
