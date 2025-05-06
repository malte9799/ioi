/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

if (!global.ioi) global.ioi = {};

import * as Updater from './updater';
import tabcompletion from './utils/tabcompletion';
import metadata from './metadata';
import logger from './logger';
import huds from './huds';
import settings from './settings.js';

import FeatureManager from './class/FeatureManager.js';

//#region Mixins
import { ClientPlayerInteractionManager_breakBlock, BlockItem_place_head, BlockItem_place_tail } from './mixins.js';
const onBlockBreakTrigger = createCustomTrigger('blockBreak');
ClientPlayerInteractionManager_breakBlock.attach((instance, cir, pos) => {
	if (!World.isLoaded()) return;
	const block = World.getBlockAt(new BlockPos(pos));
	onBlockBreakTrigger.trigger(block);
});

const onBlockplaceTrigger = createCustomTrigger('blockPlace');
let placedItem;
BlockItem_place_head.attach((instance, cir, itemPlacementContext) => {
	if (!World.isLoaded()) return;
	placedItem = new Item(itemPlacementContext.getStack());
});
BlockItem_place_tail.attach((instance, cir, itemPlacementContext) => {
	if (!World.isLoaded()) return;
	const pos = itemPlacementContext.getBlockPos();
	onBlockplaceTrigger.trigger(World.getBlockAt(new BlockPos(pos)), placedItem || new Item(itemPlacementContext.getStack()));
});
//#endregion

let main = register('worldLoad', () => {
	main.unregister();

	new Thread(() => {
		Thread.sleep(1000);
		if (tryUpdate(1000) !== -1) {
		} else {
			FeatureManager.loadMain();
			new Sound({ source: 'ui.loom.select_pattern', category: Sound.Category.MASTER, pitch: 1.5, volume: 0.4 }).play();
			new Sound({ source: 'ui.toast.in', category: Sound.Category.MASTER, pitch: 1.5, volume: 2 }).play();
		}
	}).start();
});

register('command', (...args) => {
	switch (args[0]) {
		case 'load':
			FeatureManager.loadMain();
			break;

		case 'unload':
			FeatureManager.unloadMain();
			break;

		case 'reload':
			FeatureManager.unloadMain();
			FeatureManager.loadMain();
			break;

		case 'editHud':
			huds.open();
			break;

		case 'update':
			switch (args[1]) {
				case 'accept':
					Updater.applyUpdate();
					ChatLib.command('ct load');
					// isDev ? ChatLib.command('ioi reload') : ChatLib.command('ct load');
					break;
				case 'deny':
					Updater.deleteDownload();
					FeatureManager.loadMain();
					break;
				default:
					new Thread(() => {
						if (tryUpdate() === -1) logger.chat('You are up to date!');
					}).start();
					break;
			}
			break;

		case 'feature':
			const feat = args[2];
			if (!feat) args[1] = '';
			switch (args[1]) {
				case 'enable':
					new Thread(() => {
						if (FeatureManager.enableFeature(feat, true)) logger.chat('Feature loaded: §r' + feat);
					}).start();
					break;
				case 'disable':
					if (FeatureManager.disableFeature(feat)) logger.chat('Feature unloaded: §r' + feat);
					break;
				case 'reload':
					new Thread(() => {
						FeatureManager.unloadFeature(feat);
						if (FeatureManager.loadFeature(feat, true)) logger.chat('Feature reloaded: §r' + feat);
					}).start();
					break;
				case 'list':
				default:
					logger.chat('Feature list:');
					Onject.keys(FeatureManager.features).forEach((e) => {
						const status = FeatureManager.features[e].enabled ? '§a§l✔' : '§c§l✘';
						logger.chat(status + '§r ' + e);
					});
					break;
			}
			break;

		case 'viewChangelog':
			if (args[1] == 'list') {
			} else
				try {
					/** @type {{ version: string, changes: { type: 'feat' | 'fix' | 'misc' | 'del' | 'change', desc: string }[] }[]} */
					const changelog = Updater.getChangelogDiff(args[1] || metadata.version).reverse();
					const typeColors = {
						feat: '&a&l+ feat: &r    ',
						remove: '&c&l- remove:&r ',
						change: '&6&l/ change:&r ',
						fix: '&f&l= fix:  &r     ',
						misc: '&7&l= misc:  &r   ',
					};
					const typeSort = ['feat', 'remove', 'change', 'fix', 'misc'];
					logger.chat('&6&lChangelog');
					changelog.forEach(({ version, changes }, i) => {
						// if (i > 0) ChatLib.chat('');
						ChatLib.chat('&3&nv' + version);
						changes.sort((a, b) => typeSort.indexOf(a.type) - typeSort.indexOf(b.type)).forEach(({ type, desc }) => ChatLib.chat(typeColors[type] + desc));
					});
				} catch (e) {
					if (logger.isDev) logger.chat('&cFailed to get changelog:', e, e.stack);
					else logger.chat('&cFailed to get changelog');
					console.log(e + '\n' + e.stack);
				}
			break;

		case 'settings':
			if (args[1] == 'reset') {
				FileLib.delete(metadata.name, '/data/config.toml');
			} else settings.openGUI();
			break;
	}
})
	.setTabCompletions(
		tabcompletion({
			// reload: [],
			// unload: [],
			// load: [],
			feature: {
				enable: () => Object.keys(FeatureManager.features).filter((e) => !FeatureManager.features[e].class.enabled),
				disable: () => Object.keys(FeatureManager.features).filter((e) => FeatureManager.features[e].class.enabled),
				reload: () => Object.keys(FeatureManager.features).filter((e) => FeatureManager.features[e].class.enabled),
				list: [],
			},
			editHud: [],
			update: [],
			settings: ['reset'],
			viewChangelog: [],
		})
	)
	.setName(metadata.name);

function tryUpdate(delay = 0) {
	try {
		const meta = Updater.loadMeta();
		if (!meta) {
			logger.chat('&cNo release found!');
			return -1;
		}
		const version = Updater.getVersion(meta);
		if (Updater.compareVersions(version, metadata.version) <= 0) return -1; // Already up to date
		if (delay > 0) Thread.sleep(delay);
		const url = Updater.getAssetURL(meta);
		try {
			Updater.downloadUpdate(url);
		} catch (e) {
			if (logger.isDev) logger.chat('&cFailed to download update:', e, e.stack);
			else logger.chat('Failed to download update');
			console.log(e + '\n' + e.stack);
			new TextComponent({ text: ChatLib.getCenteredText('&nClick to Manually Update'), clickEvent: { action: 'open_url', value: `https://github.com/${metadata.creator}/${metadata.name}/releases/latest` } }).chat();

			return 1;
		}

		logger.chat('§lThere is an update Avalable!');
		new TextComponent(logger.chatPrefix, new TextComponent({ text: '§e§u[Github]', clickEvent: { action: 'open_url', value: `https://github.com/${metadata.creator}/${metadata.name}/releases/latest` } }), '  ', new TextComponent({ text: '§6§u[Changelog]', clickEvent: { action: 'run_command', value: `/${metadata.name} viewChangelog` } })).chat();
		logger.chat(`§cv${metadata.version}§r ->§a v${version}`);
		logger.chat('');
		if (!logger.isDev) logger.chat('§cNote: Your CT Modules will be reloaded.');
		else logger.chat('§cNote: IOI will be reloaded');
		new TextComponent(logger.chatPrefix, new TextComponent({ text: '§a§l[UPDATE]', clickEvent: { action: 'run_command', value: `/${metadata.name} update accept` } }), '  ', new TextComponent({ text: '§4§l[CANCLE]', clickEvent: { action: 'run_command', value: `/${metadata.name} update deny` } })).chat();

		return 0;
	} catch (e) {
		if (logger.isDev) logger.chat('&cFailed to fetch update:', e, e.stack);
		else logger.chat('&cFailed to fetch update');
		console.logger.chat(e + '\n' + e.stack);
	}
	return -1;
}
