// const EntityMixin = new Mixin('net.minecraft.entity.Entity');
// const MinecraftClientMixin = new Mixin('net.minecraft.client.MinecraftClient');

// export const entity_getTeamColorValue = EntityMixin.inject({
// 	method: 'getTeamColorValue',
// 	at: new At('HEAD'),
// 	cancellable: true,
// });

// export const minecraftClient_hasOutline = MinecraftClientMixin.inject({
// 	method: 'hasOutline',
// 	at: new At('HEAD'),
// 	locals: new Local({
// 		type: 'Lnet/minecraft/entity/Entity;',
// 		ordinal: 0,
// 	}),
// 	cancellable: true,
// });
//

//
// index.js
//
// import { minecraftClient_hasOutline } from './mixins.js';
// const PlayerEntity = net.minecraft.entity.player.PlayerEntity;
// const playerOutlineMap = new Set();
// minecraftClient_hasOutline.attach((instance, cir, entity) => {
// 	if (!entity instanceof PlayerEntity) return;
// 	const key = entity.getUuid().toString();
// 	if (playerOutlineMap.has(key)) {
// 		cir.setReturnValue(true);
// 	}
// });
//
