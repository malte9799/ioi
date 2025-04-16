/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

export default class Feature {
	constructor() {
		this.FeatureManager = undefined;
		this.events = {};

		this.id = undefined;

		this.description = '';

		this.enabled = false;
		this.isDefaultEnabled = false;
		this.isTogglable = true;
		this.isHidden = false;
	}

	initSettings(Settings) {}
	onDisable() {}
	onEnable() {}

	setId(id) {
		this.id = id;
	}
	getId() {
		return this.id;
	}

	_initSettings(Settings) {
		if (this.isTogglable) {
			const [category, subcategory] = this.id.includes('/') ? this.id.split('/') : [this.id, ''];
			Settings.addProperty('SWITCH', {
				name: this.id + '_mainToggle',
				displayName: subcategory ? subcategory : 'Enabled',
				description: this.description,
				category,
				subcategory,
				value: this.isDefaultEnabled,
				hidden: this.isHidden,
			}).setCallbackConsumer((value) => {
				if (value) {
					this._onEnable();
				} else {
					this._onDisable();
				}
			});
		}
		this.initSettings(Settings);
	}
	_onDisable() {
		if (!this.enabled) return;
		Object.values(this.events).forEach((e) => {
			this.FeatureManager.unregisterEvent(e);
		});

		this.onDisable();

		this.events = {};
		this.enabled = false;
	}
	_onEnable() {
		if (this.enabled) return;
		this.dataLoader = this.FeatureManager.dataLoader;
		this.enabled = true;

		this.onEnable();
	}

	registerActionBar(criteria, func, triggerIfCanceled = null) {
		let event = this.FeatureManager.registerEvent('actionBar', func, this);
		event.trigger.setChatCriteria(criteria);
		if (triggerIfCanceled) event.trigger.setPriority(triggerIfCanceled);
		this.events[event.id] = event;
		return event;
	}
	registerChat(criteria, func, triggerIfCanceled = null) {
		let event = this.FeatureManager.registerEvent('chat', func, this);
		event.trigger.setChatCriteria(criteria);
		if (triggerIfCanceled) event.trigger.setPriority(triggerIfCanceled);
		this.events[event.id] = event;
		return event;
	}
	registerCommand(name, func, completions = undefined) {
		let event = this.FeatureManager.registerEvent('command', func, this);
		if (completions) event.trigger.setTabCompletions(completions || []);
		event.trigger.setName(name, true);
		this.events[event.id] = event;
		return event;
	}
	registerPacketReceived(packetClass, func) {
		let event = this.FeatureManager.registerEvent('packetReceived', func, this);
		event.trigger.setFilteredClasses(Array.isArray(packetClass) ? packetClass : [packetClass]);
		this.events[event.id] = event;
		return event;
	}
	registerPacketSent(packetClass, func) {
		let event = this.FeatureManager.registerEvent('packetSent', func, this);
		event.trigger.setFilteredClasses(Array.isArray(packetClass) ? packetClass : [packetClass]);
		this.events[event.id] = event;
		return event;
	}
	registerRenderBlockEntity(filterClasses, func) {
		let event = this.FeatureManager.registerEvent('renderBlockEntity', func, this);
		event.trigger.setFilteredClasses(Array.isArray(filterClasses) ? filterClasses : [filterClasses]);
		this.events[event.id] = event;
		return event;
	}
	registerRenderEntity(filterClasses, func) {
		let event = this.FeatureManager.registerEvent('renderEntity', func, this);
		event.trigger.setFilteredClasses(Array.isArray(filterClasses) ? filterClasses : [filterClasses]);
		this.events[event.id] = event;
		return event;
	}
	registerSoundPlay(criteria = undefined, func) {
		let event = this.FeatureManager.registerEvent('soundPlay', func, this);
		if (criteria) event.trigger.setCriteria(criteria);
		this.events[event.id] = event;
		return event;
	}
	registerStep(isFps, interval, func) {
		let event = this.FeatureManager.registerEvent('step', func, this);
		isFps ? event.trigger.setFps(interval) : event.trigger.setDelay(interval);
		this.events[event.id] = event;
		return event;
	}

	registerEvent(type, func) {
		let event = this.FeatureManager.registerEvent(type, func, this);
		this.events[event.id] = event;
		return event;
	}
}
