/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

export default class Feature {
	constructor() {
		this.FeatureManager = undefined;
		this.events = {};

		this.id = undefined;

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

	_onDisable() {
		Object.values(this.events).forEach((e) => {
			this.FeatureManager.unregisterEvent(e);
		});

		this.onDisable();

		this.events = {};
		this.enabled = false;
	}
	_onEnable(parent) {
		this.FeatureManager = parent;
		this.dataLoader = parent.dataLoader;
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
	registerCommand(name, func, completions) {
		let event = this.FeatureManager.registerEvent('command', func, this);
		if (completions) event.trigger.setTabCompletions(completions);
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
	registerSoundPlay(criteria, func) {
		let event = this.FeatureManager.registerEvent('soundPlay', func, this);
		event.trigger.setCriteria(criteria);
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
