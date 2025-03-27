/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

if (!global.ioi) global.ioi = {};
class TrappedQOL {
	constructor() {
		this.FeatureManager = require('./class/FeatureManager.js');
		this.FeatureManager.parent = this;
	}
}

let main = register('worldLoad', () => {
	new TrappedQOL();
	new Sound({ source: 'ui.loom.select_pattern', category: Sound.Category.MASTER, pitch: 1.5, volume: 0.4 }).play();
	new Sound({ source: 'ui.toast.in', category: Sound.Category.MASTER, pitch: 1.5, volume: 2 }).play();

	main.unregister();
});

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
