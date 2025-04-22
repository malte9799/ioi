import NonPooledThread from '../utils/nonPooledThread.js';
import metadata from '../metadata.js';
import logger from '../logger.js';
import huds from '../huds.js';
import tabcompletion from '../utils/tabcompletion.js';
import settings from '../settings.js';

const File = Java.type('java.io.File');

class FeatureManager {
	constructor() {
		this.enabled = false;
		this.isDev = logger.isDev;

		this.features = {};
		this.events = {};
		this.dynamicEvents = {};
		this.lastEventId = 0;

		this.longEventTime = 40;

		this.registerEvent('gameUnload', () => {
			this.unloadMain();
		});
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

		this.registerEvent('step', () => {
			Object.entries(this.dynamicEvents).forEach(([id, funcs]) => {
				let enabled = true;
				funcs.forEach((func) => {
					if (!func()) enabled = false;
				});
				if (enabled) this.events[id].register();
				else this.events[id].unregister();
			});
		}).trigger.setDelay(5);
	}

	getId() {
		return 'FeatureManager';
	}

	loadMain() {
		new NonPooledThread(() => {
			this.enabled = true;
			let startLoading = Date.now();
			this.loadAllFeatures();
			logger.chat('Loaded!');
			logger.info('IoI took ' + ((Date.now() - startLoading) / 1000).toFixed(2) + 's to load');
		}).start();
	}
	unloadMain() {
		this.enabled = false;
		this.unloadAllFeatures();
	}

	getAllFeatureFiles(directory) {
		const dir = new java.io.File(directory);
		const result = [];

		if (!dir.exists() || !dir.isDirectory()) {
			return result;
		}

		function traverseDirectory(folder, parentPath = '') {
			const files = folder.listFiles();

			if (files == null) return;

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const fileName = file.getName();

				const filePath = parentPath.length > 0 ? parentPath + '/' + fileName : fileName;

				if (file.isDirectory()) {
					traverseDirectory(file, filePath);
				} else {
					if (fileName.endsWith('.js')) {
						result.push(filePath.slice(0, -3));
					}
				}
			}
		}

		traverseDirectory(dir);
		return result;
	}

	loadAllFeatures() {
		const loadedFeatures = new Map();
		const featureFiles = this.getAllFeatureFiles('./config/ChatTriggers/modules/' + metadata.name + '/features');
		new Thread(() => {
			this.dataLoader = this.loadFeature('dataLoader').class;
		}).start();
		featureFiles.forEach((feature) => {
			if (feature == 'dataLoader') return;
			loadedFeatures.set(feature, false);
			new Thread(() => {
				this.loadFeature(feature);
				loadedFeatures.set(feature, true);
			}).start();
		});
		while (this.enabled && [...loadedFeatures.values()].some((a) => !a)) {
			Thread.sleep(100);
		}
	}
	loadFeature(feature, force = false) {
		if (this.features[feature]) return false;
		try {
			let loadedFeature = require('../features/' + feature + '.js');
			this.features[feature] = loadedFeature;
			loadedFeature.class.setId(feature);
			loadedFeature.class._initSettings(settings);
			loadedFeature.class.FeatureManager = this;
			if (force || loadedFeature.class.isTogglable ? settings.getValue(feature + '_mainToggle') : loadedFeature.class.isDefaultEnabled) this.enableFeature(feature);
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
		this.disableFeature(feature);
		delete this.features[feature];
		logger.info('□ Unloaded feature ' + feature);
		return true;
	}

	enableFeature(feature) {
		if (!this.features[feature] || this.features[feature].class.enabled) return false;
		this.features[feature].class._onEnable();
		return true;
	}
	disableFeature(feature) {
		if (!this.features[feature] || !this.features[feature].class.enabled) return false;
		this.features[feature].class._onDisable();
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
				if (!this.enabled) return;
				try {
					if (context.enabled) {
						let start = Date.now();
						this.events[id].func.call(context, ...(args || []));
						let time = Date.now() - start;
						if (time > this.longEventTime) {
							logger.warn('Long event triggered [' + time + 'ms] (' + context.getId() + '/' + type + ')', 3);
						}
					} else {
						let feature = context.getId();
						new TextComponent(logger.chatPrefix + 'Feature not enabled! ', {
							text: '[enable]',
							color: 'yellow',
							hoverEvent: { action: 'show_text', value: '§aClick to enable "' + feature + '"' },
							clickEvent: { action: 'run_command', value: `/ioi features load ${feature}` },
						}).chat();
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
			when: (...funcs) => {
				funcs.forEach((func) => {
					if (!func()) this.events[id].unregister();
				});
				this.dynamicEvents[id] = funcs;
				return this.events[id];
			},
		};

		return this.events[id];
	}
	unregisterEvent(event) {
		event.trigger.unregister();
		if (this.dynamicEvents[event.id]) delete this.dynamicEvents[event.id];
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
