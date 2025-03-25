import logger from '../logger.js';
import NonPooledThread from '../utils/nonPooledThread.js';
const File = Java.type('java.io.File');
import metadata from '../metadata.js';
import db from '../db.js';
// import settings from '../settings.js';

class FeatureManager {
	constructor() {
		this.parent = undefined;
		this.enabled = true;
		this.messagePrefix = logger.chatPrefix || '&6[I0I]&7 ';
		this.isDev = logger.isDev;

		this.features = [];
		this.events = {};
		this.lastEventId = 0;

		// this.Settings = settings;

		this.longEventTime = 10;

		new NonPooledThread(() => {
			this.loadMain();
		}).start();

		this.registerEvent('gameUnload', () => {
			this.unloadMain();
		});

		this.registerEvent('command', () => {
			// this.Settings.openGUI();
		}).trigger.setName('IOI');

		this.registerEvent('command', (args) => {
			new Thread(() => {
				this.unloadFeature(args);
				logger.chat('Feature unloaded: ' + args);
			}).start();
		}).trigger.setName('soopyunloadfeature');
		this.registerEvent('command', (args) => {
			new Thread(() => {
				this.loadFeature(args);
				logger.chat('Feature loaded: ' + args);
			}).start();
		}).trigger.setName('soopyloadfeature');
		this.registerEvent('command', () => {
			new NonPooledThread(() => {
				this.unloadMain();
			}).start();
		}).trigger.setName('soopyunload');
		this.registerEvent('command', () => {
			new NonPooledThread(() => {
				this.loadMain();
			}).start();
		}).trigger.setName('soopyload');
		this.registerEvent('command', () => {
			new NonPooledThread(() => {
				this.unloadMain();
				this.loadMain();
			}).start();
		}).trigger.setName('soopyreload');
		this.registerEvent('command', () => {
			new Thread(() => {
				this.unloadFeature(args);

				this.loadFeature(args);
			}).start();
		}).trigger.setName('soopyreloadfeature');
		this.registerEvent('command', () => {
			new Thread(() => {
				this.unloadMain();
				ChatLib.command('ct load');
			}).start();
		}).trigger.setName('load');
	}

	loadMain() {
		this.enabled = true;
		let startLoading = Date.now();
		db.save();
		this.loadAllFeatures();
		logger.chat('Loaded!');
		logger.info('TrappedQOL took ' + ((Date.now() - startLoading) / 1000).toFixed(2) + 's to load');
	}
	unloadMain() {
		this.enabled = false;
		this.unloadAllFeatures();
	}
	loadAllFeatures() {
		let featuresDir = new File('./config/ChatTriggers/modules/' + metadata.name + '/features');

		let loadedFeatures = new Map();
		new Thread(() => {
			this.dataLoader = this.loadFeature('dataLoader').class;
		}).start();
		featuresDir.list().forEach((fileName) => {
			if (!fileName.includes('.js')) return;
			let feature = fileName.split('.')[0];
			if (feature == 'dataLoader') return;
			loadedFeatures.set(feature, false);
			new Thread(() => {
				this.loadFeature(feature);
				loadedFeatures.set(feature, true);
			}).start();
		});
		while ([...loadedFeatures.values()].some((a) => !a)) {
			Thread.sleep(100);
		}
	}
	loadFeature(feature) {
		feature = feature.split('.')[0];
		if (this.features[feature]) return;
		try {
			let loadedFeature = require('../features/' + feature + '.js');
			this.features[feature] = loadedFeature;
			loadedFeature.class.setId(feature);
			// loadedFeature.class._initVariables(this);
			if (loadedFeature.class.isDefaultEnabled) {
				loadedFeature.class._onEnable(this);
			}
			logger.info('■ Loaded feature ' + feature, 3);
			return loadedFeature;
		} catch (e) {
			logger.chat('§cError loading feature ' + feature);
			logger.error('Error loading feature ' + feature);
			logger.warn(JSON.stringify(e, undefined, 2));
			logger.warn(e.stack);
			throw e;
		}
	}
	unloadAllFeatures() {
		Object.keys(this.features).forEach((feature) => {
			this.unloadFeature(feature);
		});
	}
	unloadFeature(feature) {
		if (!this.features[feature]) return;
		this.features[feature].class._onDisable();
		delete this.features[feature];
		logger.info('□ Unloaded feature ' + feature);
	}
	registerEvent(type, func, context = this) {
		let id = this.lastEventId++;

		if (!func) throw new Error('Function must not be null');
		this.events[id] = {
			func,
			context,
			trigger: register(type, (...args) => {
				try {
					if (context.enabled) {
						let start = Date.now();
						this.events[id].func.call(context, ...(args || []));
						let time = Date.now() - start;
						if (time > this.longEventTime) {
							logger.warn('Long event triggered [' + time + 'ms] (' + context.getId() + '/' + type + ')', 3);
						}
					} else {
						if (this.enabled) {
							let feature = context.getId();
							new TextComponent(this.messagePrefix + 'Feature not enabled! ', {
								text: '[enable]',
								color: 'yellow',
								hoverEvent: { action: 'show_text', value: '§aClick to enable "' + feature + '"' },
								clickEvent: { action: 'run_command', value: `/soopyloadfeature ${feature}` },
							}).chat();
						}
					}
				} catch (e) {
					logger.error(`Error in ${type} event:`);
					logger.warn(JSON.stringify(e, undefined, 2));
					if (e.stack) logger.warn(e.stack);
					throw e;
				}
			}),
			id,
			type,
			register: () => {
				this.events[id].trigger.register();
				return this.events[id];
			},
			unregister: () => {
				this.events[id].trigger.unregister();
				return this.events[id];
			},
			isRegistered: () => {
				return this.events[id].trigger.isRegistered();
			},
		};

		return this.events[id];
	}
	unregisterEvent(event) {
		event.trigger.unregister();
		delete this.events[event.id];
	}
}

if (!global.trapped.featureManager) {
	global.trapped.featureManager = new FeatureManager();
	register('gameUnload', () => {
		global.trapped.featureManager = undefined;
	});
}
export default global.trapped.featureManager;
