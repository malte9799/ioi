import NonPooledThread from '../utils/nonPooledThread.js';
import metadata from '../metadata.js';
import logger from '../logger.js';
import huds from '../huds.js';
import tabcompletion from '../utils/tabcompletion.js';
// import settings from '../settings.js';

const File = Java.type('java.io.File');

class FeatureManager {
	constructor() {
		this.parent = undefined;
		this.enabled = true;
		this.messagePrefix = logger.chatPrefix || '&6[ioi]&7 ';
		this.isDev = logger.isDev;

		this.featureNames = [];
		this.features = {};
		this.events = {};
		this.lastEventId = 0;

		// this.Settings = settings;

		this.longEventTime = 20;

		new NonPooledThread(() => {
			this.loadMain();
		}).start();

		this.registerEvent('gameUnload', () => {
			this.unloadMain();
		});

		this.registerCommand(
			'ioi',
			(...args) => {
				switch (args[0]) {
					case 'load':
						new NonPooledThread(() => {
							this.loadMain();
						}).start();
						break;

					case 'unload':
						new NonPooledThread(() => {
							this.unloadMain();
						}).start();
						break;

					case 'reload':
						new NonPooledThread(() => {
							this.unloadMain();
							this.loadMain();
						}).start();
						break;

					case 'editHud':
						huds.open();
						break;

					case 'feature':
						const feat = args[2];
						if (!feat) args[1] = '';
						switch (args[1]) {
							case 'load':
								new Thread(() => {
									if (this.loadFeature(feat)) logger.chat('Feature loaded: §r' + feat);
								}).start();
								break;

							case 'unload':
								new Thread(() => {
									if (this.unloadFeature(feat)) logger.chat('Feature loaded: §r' + feat);
								}).start();
								break;

							case 'reload':
								new Thread(() => {
									this.unloadFeature(feat);
									if (this.loadFeature(feat)) logger.chat('Feature reloaded: §r' + feat);
								}).start();
								break;

							default:
								logger.chat('Feature list:');
								this.featureNames.forEach((e) => {
									const status = this.features[e] ? '§a§l✔' : '§c§l✘';
									logger.chat(status + '§r ' + e);
								});
								break;
						}
						break;
					default:
						logger.chat('help');
						break;
				}
			},
			tabcompletion({
				load: [],
				unload: [],
				reload: [],
				feature: {
					load: () => this.featureNames.filter((e) => !this.features[e]),
					unload: () => this.featureNames.filter((e) => this.features[e]),
					reload: () => this.featureNames.filter((e) => this.features[e]),
					list: [],
				},
				editHud: [],
			})
		);

		this.registerCommand('ctLoad', () => {
			new Thread(() => {
				this.unloadMain();
				ChatLib.command('ct load');
			}).start();
		});
		this.registerCommand('ctUnload', () => {
			new Thread(() => {
				this.unloadMain();
				ChatLib.command('ct unload');
			}).start();
		});
	}

	getId() {
		return 'FeatureManager';
	}

	loadMain() {
		// this.enabled = true;
		let startLoading = Date.now();
		this.loadAllFeatures();
		logger.chat('Loaded!');
		logger.info('TrappedIoI took ' + ((Date.now() - startLoading) / 1000).toFixed(2) + 's to load');
	}
	unloadMain() {
		// this.enabled = false;
		this.unloadAllFeatures();
	}

	loadAllFeatures() {
		this.featureNames = [];
		let featuresDir = new File('./config/ChatTriggers/modules/' + metadata.name + '/features');
		let devFeaturesDir = new File('./config/ChatTriggers/modules/' + metadata.name + '/features/dev');

		let loadedFeatures = new Map();
		new Thread(() => {
			this.dataLoader = this.loadFeature('dataLoader').class;
		}).start();
		const features = [...featuresDir.list(), ...devFeaturesDir.list().map((e) => 'dev/' + e)];
		features.forEach((fileName) => {
			if (!fileName.includes('.js')) return;
			let feature = fileName.split('.')[0];
			if (feature == 'dataLoader') return;
			loadedFeatures.set(feature, false);
			new Thread(() => {
				this.loadFeature(feature);
				loadedFeatures.set(feature, true);
			}).start();
		});
	}
	loadFeature(feature) {
		feature = feature.replace('.js', '');
		if (this.features[feature]) return false;
		try {
			let loadedFeature = require('../features/' + feature + '.js');
			if (!loadedFeature.class.isHidden && !this.featureNames.includes(feature)) this.featureNames.push(feature);

			if (!loadedFeature.class.isDefaultEnabled) return false;
			this.features[feature] = loadedFeature;
			loadedFeature.class.setId(feature);
			loadedFeature.class._onEnable(this);
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
		if (!this.features[feature]) return false;
		this.features[feature].class._onDisable();
		delete this.features[feature];
		logger.info('□ Unloaded feature ' + feature);
		return true;
	}
	//

	//
	registerCommand(name, func, completions = undefined) {
		let event = this.registerEvent('command', func, this);
		if (completions) event.trigger.setTabCompletions(completions || []);
		event.trigger.setName(name, true);
		return event;
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
				if (this.events[id] && !this.events[id].isRegistered()) {
					this.events[id].trigger.register();
				}
				return this.events[id];
			},
			unregister: () => {
				if (this.events[id] && this.events[id].isRegistered()) {
					this.events[id].trigger.unregister();
				}
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

if (!global.ioi.featureManager) {
	global.ioi.featureManager = new FeatureManager();
	register('gameUnload', () => {
		global.ioi.featureManager = undefined;
	});
}
export default global.ioi.featureManager;
