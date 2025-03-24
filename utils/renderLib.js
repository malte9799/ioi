const UMatrixStack = Java.type('gg.essential.universal.UMatrixStack');

const ModelTransformationMode = net.minecraft.item.ModelTransformationMode;
const vcp = Client.getMinecraft().getBufferBuilders().getEntityVertexConsumers();

const TextRenderer = Renderer.getFontRenderer();

export default class Render {
	/**
	 * Returns the x and y coordinates of the center of a slot. Code originally from Antonio.
	 * @param {Number} slot - The slot number to be calculated
	 * @returns
	 */
	static getSlotCenter(slot) {
		const invSize = Player.getContainer()?.getSize() || 0;
		let x = slot % 9;
		let y = Math.floor(slot / 9);
		let renderX = Renderer.screen.getWidth() / 2 + (x - 4) * 18;
		let renderY = (Renderer.screen.getHeight() + 9) / 2 + (y - invSize / 18) * 18;
		if (slot >= invSize - 36) renderY += 13;
		return [renderX, renderY];
	}

	// static drawBlockFilled(blocks, color, depth) {
	//     if (blocks instanceof BlockPos) blocks = [blocks];
	//     if (blocks.length < 1) return;

	//     Renderer.pushMatrix()
	//       .disableCull();

	//     if (!depth) Renderer.disableDepth();

	//     Renderer3d.begin(Renderer.DrawMode.QUADS, Renderer.VertexFormat.POSITION_COLOR);

	//     blocks.forEach(it => {
	//       const { minX, minY, minZ, maxX, maxY, maxZ } = getOutlineVoxelShape(it).getBoundingBox();

	//       Renderer.pushMatrix().translate(it.x, it.y, it.z);

	//       Renderer3d
	//         .pos(minX, maxY, minZ).color(color)
	//         .pos(maxX, maxY, minZ).color(color)
	//         .pos(maxX, minY, minZ).color(color)
	//         .pos(minX, minY, minZ).color(color)

	//         .pos(minX, minY, maxZ).color(color)
	//         .pos(maxX, minY, maxZ).color(color)
	//         .pos(maxX, maxY, maxZ).color(color)
	//         .pos(minX, maxY, maxZ).color(color)

	//         .pos(minX, minY, minZ).color(color)
	//         .pos(maxX, minY, minZ).color(color)
	//         .pos(maxX, minY, maxZ).color(color)
	//         .pos(minX, minY, maxZ).color(color)

	//         .pos(minX, maxY, maxZ).color(color)
	//         .pos(maxX, maxY, maxZ).color(color)
	//         .pos(maxX, maxY, minZ).color(color)
	//         .pos(minX, maxY, minZ).color(color)

	//         .pos(minX, minY, maxZ).color(color)
	//         .pos(minX, maxY, maxZ).color(color)
	//         .pos(minX, maxY, minZ).color(color)
	//         .pos(minX, minY, minZ).color(color)

	//         .pos(maxX, minY, minZ).color(color)
	//         .pos(maxX, maxY, minZ).color(color)
	//         .pos(maxX, maxY, maxZ).color(color)
	//         .pos(maxX, minY, maxZ).color(color);

	//       Renderer.popMatrix();
	//     });

	//     Renderer3d.draw();

	//     if (!depth) Renderer.enableDepth();
	//     Renderer.enableCull().popMatrix();
	//   }

	static string(text, x = 0, y = 0, color = Renderer.WHITE, shadow = false, z = 300, scale = 1) {
		Renderer.pushMatrix().translate(x, y, z).scale(scale, scale, 1);
		Renderer.drawString(text, 0, 0, color, shadow);
		Renderer.popMatrix();
	}
	static centerString(text, x = 0, y = 0, color = Renderer.WHITE, shadow = false, z = 300, scale = 1) {
		this.string(text, x - Renderer.getStringWidth(text) / 2, y, color, shadow, z, scale);
	}

	static item(item, x = 0, y = 0, scale = 1, z = 300) {
		const ItemRenderer = Client.getMinecraft().getItemRenderer();

		Renderer.pushMatrix()
			.scale(scale, scale, 1)
			.translate(x / scale, y / scale, z)
			.scale(16.0, -16.0, 1);

		ItemRenderer.renderItem(item.toMC(), ModelTransformationMode.GUI, 15, 0, Renderer.matrixStack.toMC(), vcp, World.getWorld(), 0);
		Renderer.popMatrix();
	}
}
