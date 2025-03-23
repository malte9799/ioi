const UMatrixStack = Java.type('gg.essential.universal.UMatrixStack');

export default class RenderLib2d {
	static drawRecr(x, y, width, height, color) {}
	static drawCenterString(text, x, y, color = Renderer.WHITE, shadow = false) {
		Renderer.drawString(text, x - Renderer.getStringWidth(text) / 2, y, color, shadow);
	}
	static getSlotCenter(slot) {
		let x = slot % 9;
		let y = Math.floor(slot / 9);
		let renderX = Renderer.screen.getWidth() / 2 + (x - 4) * 18;
		let renderY = (Renderer.screen.getHeight() + 9) / 2 + (y - Player.getContainer().getSize() / 18) * 18;
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
}
