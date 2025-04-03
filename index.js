/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

if (!global.ioi) global.ioi = {};

import * as Updater from './updater';
import tabcompletion from './utils/tabcompletion';
import metadata from './metadata';
import logger from './logger';
import huds from './huds';

import FeatureManager from './class/FeatureManager.js';

//#region Mixins
import { onBlockBreak, onBlockPlace, onPreBlockPlace } from './mixins.js';
const onBlockBreakTrigger = createCustomTrigger('blockBreak');
const onBlockplaceTrigger = createCustomTrigger('blockPlace');
onBlockBreak.attach((instance, cir, pos) => {
	if (!World.isLoaded()) return;
	const block = World.getBlockAt(new BlockPos(pos));
	onBlockBreakTrigger.trigger(block);
});

let placedItem;
onPreBlockPlace.attach((instance, cir, itemPlacementContext) => {
	if (!World.isLoaded()) return;
	placedItem = new Item(itemPlacementContext.getStack());
});
onBlockPlace.attach((instance, cir, itemPlacementContext) => {
	if (!World.isLoaded()) return;
	const pos = itemPlacementContext.getBlockPos();
	onBlockplaceTrigger.trigger(World.getBlockAt(new BlockPos(pos)), placedItem || new Item(itemPlacementContext.getStack()));
});
//#endregion

const log = (...args) => ChatLib.chat(logger.chatPrefix + args.join(' '));

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
					break;
				default:
					new Thread(() => {
						if (tryUpdate() === -1) log('You are up to date!');
					}).start();
					break;
			}
			break;

		case 'features':
			const feat = args[2];
			if (!feat) args[1] = '';
			switch (args[1]) {
				case 'load':
					new Thread(() => {
						if (FeatureManager.loadFeature(feat)) logger.chat('Feature loaded: §r' + feat);
					}).start();
					break;
				case 'unload':
					if (FeatureManager.unloadFeature(feat)) logger.chat('Feature unloaded: §r' + feat);
					break;
				case 'reload':
					new Thread(() => {
						this.unloadFeature(feat);
						if (this.loadFeature(feat)) logger.chat('Feature reloaded: §r' + feat);
					}).start();
					break;
				case 'list':
				default:
					logger.chat('Feature list:');
					FeatureManager.featureFiles.forEach((e) => {
						const status = FeatureManager.features[e] ? '§a§l✔' : '§c§l✘';
						logger.chat(status + '§r ' + e);
					});
					break;
			}
	}
})
	.setTabCompletions(
		tabcompletion({
			reload: [],
			unload: [],
			features: {
				load: () => FeatureManager.featureFiles.filter((e) => !FeatureManager.features[e]),
				unload: () => FeatureManager.featureFiles.filter((e) => FeatureManager.features[e]),
				reload: () => FeatureManager.featureFiles.filter((e) => FeatureManager.features[e]),
				list: [],
			},
			editHud: [],
			update: [],
		})
	)
	.setName(metadata.name);

function tryUpdate(delay = 0) {
	try {
		const meta = Updater.loadMeta();
		const version = Updater.getVersion(meta);
		if (Updater.compareVersions(version, metadata.version) <= 0) return -1; // Already up to date
		if (delay > 0) Thread.sleep(delay);
		const url = Updater.getAssetURL(meta);
		try {
			Updater.downloadUpdate(url);
		} catch (e) {
			if (logger.isDev) log('failed to download update:', e, e.stack);
			else log('failed to download update');
			console.log(e + '\n' + e.stack);
			new TextComponent({ text: ChatLib.getCenteredText('&nClick to Manually Update'), clickEvent: { action: 'open_url', value: `https://github.com/${metadata.creator}/${metadata.name}/releases/latest` } }).chat();

			return 1;
		}

		// TODO: Better Chat Messages!
		log('Update Found!');
		new TextComponent({ text: ChatLib.getCenteredText('Click to View on Github'), clickEvent: { action: 'open_url', value: `https://github.com/${metadata.creator}/${metadata.name}/releases/latest` } }).chat();
		new TextComponent({ text: ChatLib.getCenteredText('Click to Print Changelog'), clickEvent: { action: 'run_command', value: `/${metadata.name} viewChangelog` } }).chat();
		log(ChatLib.getCenteredText(`§4${metadata.version} -> ${version}`));
		log('');
		if (!logger.isDev) log(ChatLib.getCenteredText('§c§lNote: Your CT Modules will be reloaded.'));
		else log(ChatLib.getCenteredText('§c§lNote: IOI will be reloaded'));
		new TextComponent(new TextComponent({ text: '§a[UPDATE]', clickEvent: { action: 'run_command', value: `/${metadata.name} update accept` } }), new TextComponent({ text: '§4[CANCLE]', clickEvent: { action: 'run_command', value: `/${metadata.name} update deny` } })).chat();

		return 0;
	} catch (e) {
		if (logger.isDev) log('failed to fetch update:', e, e.stack);
		else log('failed to fetch update');
		console.log(e + '\n' + e.stack);
	}
	return -1;
}

//#region DEBUG
const mapping = [
	'class_2604', //EntitySpawnS2CPacket
	'class_2616', //EntityAnimationS2CPacket
	'class_2620', //BlockBreakingProgressS2CPacket
	'class_2622', //BlockEntityUpdateS2CPacket
	'class_2623', //BlockEventS2CPacket
	'class_2626', //BlockUpdateS2CPacket
	'class_2629', //BossBarS2CPacket
	'class_2632', //DifficultyS2CPacket
	'class_2637', //ChunkDeltaUpdateS2CPacket
	'class_2639', //CommandSuggestionsS2CPacket
	'class_2641', //CommandTreeS2CPacket
	'class_2645', //CloseScreenS2CPacket
	'class_2649', //InventoryS2CPacket
	'class_2651', //ScreenHandlerPropertyUpdateS2CPacket
	'class_2653', //ScreenHandlerSlotUpdateS2CPacket
	'class_2661', //DisconnectS2CPacket
	'class_2663', //EntityStatusS2CPacket
	'class_2666', //UnloadChunkS2CPacket
	'class_2668', //GameStateChangeS2CPacket
	'class_2670', //KeepAliveS2CPacket
	'class_2672', //ChunkDataS2CPacket
	'class_2673', //WorldEventS2CPacket
	'class_2675', //ParticleS2CPacket
	'class_2676', //LightUpdateS2CPacket
	'class_2683', //MapUpdateS2CPacket
	'class_2684', //EntityS2CPacket
	'class_2685', //EntityS2CPacket.MoveRelative
	'class_2686', //EntityS2CPacket.Rotate
	'class_2687', //EntityS2CPacket.RotateAndMoveRelative
	'class_2696', //PlayerAbilitiesS2CPacket
	'class_2703', //PlayerListS2CPacket
	'class_2708', //PlayerPositionLookS2CPacket
	'class_2716', //EntitiesDestroyS2CPacket
	'class_2718', //RemoveEntityStatusEffectS2CPacket
	'class_2724', //PlayerRespawnS2CPacket
	'class_2726', //EntitySetHeadYawS2CPacket
	'class_2729', //SelectAdvancementTabS2CPacket
	'class_2735', //UpdateSelectedSlotS2CPacket
	'class_2736', //ScoreboardDisplayS2CPacket
	'class_2739', //EntityTrackerUpdateS2CPacket
	'class_2743', //EntityVelocityUpdateS2CPacket
	'class_2744', //EntityEquipmentUpdateS2CPacket
	'class_2748', //ExperienceBarUpdateS2CPacket
	'class_2749', //HealthUpdateS2CPacket
	'class_2751', //ScoreboardObjectiveUpdateS2CPacket
	'class_2752', //EntityPassengersSetS2CPacket
	'class_2757', //ScoreboardScoreUpdateS2CPacket
	'class_2759', //PlayerSpawnPositionS2CPacket
	'class_2761', //WorldTimeUpdateS2CPacket
	'class_2765', //PlaySoundFromEntityS2CPacket
	'class_2767', //PlaySoundS2CPacket
	'class_2772', //PlayerListHeaderS2CPacket
	'class_2775', //ItemPickupAnimationS2CPacket
	'class_2777', //EntityPositionS2CPacket
	'class_2779', //AdvancementUpdateS2CPacket
	'class_2781', //EntityAttributesS2CPacket
	'class_2783', //EntityStatusEffectS2CPacket
	'class_3944', //OpenScreenS2CPacket
	'class_4273', //ChunkLoadDistanceS2CPacket
	'class_4282', //ChunkRenderDistanceCenterS2CPacket
	'class_4463', //PlayerActionResponseS2CPacket
	'class_5889', //WorldBorderInitializeS2CPacket
	'class_5894', //OverlayMessageS2CPacket
	'class_5900', //TeamS2CPacket
	'class_5903', //SubtitleS2CPacket
	'class_5904', //TitleS2CPacket
	'class_5905', //TitleFadeS2CPacket
	'class_6373', //PlayPingS2CPacket
	'class_6682', //SimulationDistanceS2CPacket
	'class_7439', //GameMessageS2CPacket
	'class_7495', //ServerMetadataS2CPacket
	'class_7597', //ChatSuggestionsS2CPacket.Action
	'class_7828', //PlayerRemoveS2CPacket
	'class_8042', //BundleS2CPacket
	'class_8143', //EntityDamageS2CPacket
	'class_8913', //UpdateTickRateS2CPacket
	'class_8914', //TickStepS2CPacket
	'class_9834', //SetCursorItemS2CPacket
	'class_9835', //SetPlayerInventoryS2CPacket
	'class_10264', //EntityPositionSyncS2CPacket
	'class_10266', //RecipeBookAddS2CPacket

	'', //
	'', //
	'', //
	'', //
	'', //
];

const packetIgnore = [];

// register('PacketReceived', (packet, event) => {
// 	if (packetIgnore.includes(packet.class.getSimpleName())) return;
//  console.log(packet.toString());
// 	ChatLib.chat(packet.toString());
// });

// register('packetSent', (packet, event) => {
// 	if (packetIgnore.includes(packet.class.getSimpleName())) return;
// 	console.log(packet.toString());
// 	ChatLib.chat(packet.toString());
// });
//

//
// import { minecraftClient_hasOutline } from './mixins.js';
// const PlayerEntity = net.minecraft.entity.player.PlayerEntity;
// const playerOutlineMap = new Set(['a305d4d6-bec0-4983-ab0a-356a45ae849d']);

// minecraftClient_hasOutline.attach((instance, cir, entity) => {
// 	if (!entity instanceof PlayerEntity) return;
// 	const key = entity.getUuid().toString();
// 	if (playerOutlineMap.has(key)) {
// 		cir.setReturnValue(true);
// 	}
// });

// register('command', (name) => {
// 	playerOutlineMap.add(World.getPlayerByName('9799ms').getUUID().toString());
// }).setName('addGlow');
// register('command', (name) => {
// 	playerOutlineMap.delete(World.getPlayerByName('9799ms').getUUID().toString());
// }).setName('removeGlow');
//
//#endregion
