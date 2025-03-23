/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/feature';
import logger from '../logger';
import RenderLib from '../utils/renderLib';
import renderBeaconBeam from '../utils/beaconBeam';

// const BakedModelManager = net.minecraft.client.render.model.BakedModelManager
// const Identifier = net.minecraft.util.Identifier
// const ItemRenderer = net.minecraft.client.render.item.ItemRenderer
// const ModelTransformationMode = net.minecraft.item.ModelTransformationMode
// const vcp = Client.getMinecraft().getBufferBuilders().getEntityVertexConsumers()

// const ITEM = new Item(new ItemType('minecraft:dirt')).toMC();

class Debug extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;
		this.isHidden = true;
		this.isTogglable = false;

		// this.image = Image.fromAsset('inventory3rows.png');
	}

	initSettings(Settings) {}

	onEnable() {
		// this.registerPacketReceived(net.minecraft.network.packet.s2c.play.BlockUpdateS2CPacket, (packet, event) => {
		// 	// const blockType = packet.getState().toString().match(/{minecraft:(\S*)}/)[1]
		// 	// const blockPos = packet.getPos();
		// 	const blockType = new BlockType(packet.getState().getBlock());
		// 	const blockPos = new BlockPos(packet.getPos());
		// 	const block = new Block(blockType, blockPos, null);
		// 	// logger.chat(`BlockUpdate: ${block}`);
		// });
		// this.registerEvent('preRenderWorld', () => {
		// 	// RenderLib.drawBlockFilled(new BlockPos(0, 70, 0),Renderer.WHITE)
		// 	// renderBeaconBeam(2058, 60, 62, Renderer.RED, 300, false);
		// 	// renderBeaconBeam(2058, 60, 65);
		// });
		// this.registerEvent('postGuiRender', () => {
		// 	// renderItem(ItemStack stack, ModelTransformationMode transformationMode, int light, int overlay, MatrixStack matrices, VertexConsumerProvider vertexConsumers, @Nullable World world, int seed)
		// 	// ItemRenderer.renderItem(ITEM, ModelTransformationMode.GUI, 15, 0, Renderer.matrixStack.toMC(), vcp, World.getWorld(), 0)
		// });
	}

	onDisable() {}
}
module.exports = {
	class: new Debug(),
};
