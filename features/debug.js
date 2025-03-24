/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from '../class/feature';
import logger from '../logger';
import Render from '../utils/renderLib';
import renderBeaconBeam from '../utils/beaconBeam';

const ITEM = new Item(new ItemType('minecraft:grass_block'));

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
		// 	// Render.drawBlockFilled(new BlockPos(0, 70, 0),Renderer.WHITE)
		// 	// renderBeaconBeam(2058, 60, 62, Renderer.RED, 300, false);
		// 	// renderBeaconBeam(2058, 60, 65);
		// });
		this.registerEvent('postGuiRender', () => {
			// const [x, y] = Render.getSlotCenter(0);
			// Render.item(ITEM, x - 16, y);
		});
	}

	onDisable() {}
}
module.exports = {
	class: new Debug(),
};
