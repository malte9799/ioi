const HandledScreenMixin = new Mixin('net.minecraft.client.gui.screen.ingame.HandledScreen');
HandledScreenMixin.widenField('x');
HandledScreenMixin.widenField('y');

const MouseMixin = new Mixin('net.minecraft.client.Mouse');
MouseMixin.widenMethod('onMouseButton');

const IntPropertyMixin = new Mixin('net.minecraft.state.property.IntProperty');
IntPropertyMixin.widenField('min');
IntPropertyMixin.widenField('max');

const ClientPlayerInteractionManagerMixin = new Mixin('net.minecraft.client.network.ClientPlayerInteractionManager');
export const ClientPlayerInteractionManager_breakBlock = ClientPlayerInteractionManagerMixin.inject({
	at: new At('HEAD'),
	method: 'breakBlock',
	locals: new Local({
		type: 'Lnet/minecraft/util/math/BlockPos;',
		index: 1,
	}),
});

const BlockItemMixin = new Mixin('net.minecraft.item.BlockItem');
export const BlockItem_place_head = BlockItemMixin.inject({
	at: new At('HEAD'),
	method: 'place(Lnet/minecraft/item/ItemPlacementContext;)Lnet/minecraft/util/ActionResult;',
	locals: new Local({
		type: 'Lnet/minecraft/item/ItemPlacementContext;',
		index: 1,
	}),
});
export const BlockItem_place_tail = BlockItemMixin.inject({
	at: new At('TAIL'),
	method: 'place(Lnet/minecraft/item/ItemPlacementContext;)Lnet/minecraft/util/ActionResult;',
	locals: new Local({
		type: 'Lnet/minecraft/item/ItemPlacementContext;',
		index: 1,
	}),
});

// const EntityMixin = new Mixin('net.minecraft.entity.Entity');
// export const entity_getTeamColorValue = EntityMixin.inject({
// 	method: 'getTeamColorValue',
// 	at: new At('HEAD'),
// 	cancellable: true,
// });

const MinecraftClientMixin = new Mixin('net.minecraft.client.MinecraftClient');
export const MinecraftClient_hasOutline = MinecraftClientMixin.inject({
	method: 'hasOutline',
	at: new At('HEAD'),
	locals: new Local({
		type: 'Lnet/minecraft/entity/Entity;',
		ordinal: 0,
	}),
	cancellable: true,
});
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
