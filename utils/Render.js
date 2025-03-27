const ModelTransformationMode = net.minecraft.item.ModelTransformationMode;
const VertexConsumers = Client.getMinecraft().getBufferBuilders().getEntityVertexConsumers();

const TextRenderer = Renderer.getFontRenderer();
const TextLayerType = net.minecraft.client.font.TextRenderer.class_6415;
const NEWLINE_REGEX = /\n|\r\n?/;
const Color = Java.type('java.awt.Color');

export default class Render {
	static TOP_LEFT = 'TOP_LEFT';
	static TOP = 'TOP_CENTER';
	static TOP_RIGHT = 'TOP_RIGHT';
	static LEFT = 'CENTER_LEFT';
	static CENTER = 'CENTER_CENTER';
	static RIGHT = 'CENTER_RIGHT';
	static BOTTOM_LEFT = 'BOTTOM_LEFT';
	static BOTTOM = 'BOTTOM_CENTER';
	static BOTTOM_RIGHT = 'BOTTOM_RIGHT';

	static getPositionMatrix() {
		return Renderer.matrixStack.toMC().peek().positionMatrix;
	}

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

	static string({ text, x = 0, y = 0, z = 300, scale = 1, color = Renderer.WHITE, shadow = false, backgroundColor = Renderer.getColor(0, 0, 0, 0), light = 15, align = Render.CENTER }) {
		const TextRenderer = Renderer.getFontRenderer();
		let yOffset = 0;
		align = align.split('_');
		if (align[0] == 'CENTER') y -= (TextRenderer.fontHeight / 2) * scale;
		if (align[0] == 'BOTTOM') y -= TextRenderer.fontHeight * scale;
		if (align[1] == 'CENTER') x -= (Renderer.getStringWidth(text) / 2) * scale;
		if (align[1] == 'RIGHT') x -= Renderer.getStringWidth(text) * scale;

		Renderer.pushMatrix().translate(x, y, z).scale(scale, scale, 1);
		ChatLib.addColor(text)
			.split(NEWLINE_REGEX)
			.forEach((line, i) => {
				TextRenderer.draw(line, 0, yOffset, color, shadow, Render.getPositionMatrix(), VertexConsumers, TextLayerType.NORMAL, backgroundColor, light);
				yOffset += TextRenderer.fontHeight;
			});
		Renderer.popMatrix();
		return Render;
	}

	static rect({ x = 0, y = 0, z = 300, width = 1, height = 1, scale = 1, color = Renderer.WHITE, align = Render.CENTER }) {
		align = align.split('_');
		if (align[0] == 'CENTER') y -= (height / 2) * scale;
		if (align[0] == 'BOTTOM') y -= height * scale;
		if (align[1] == 'CENTER') x -= (width / 2) * scale;
		if (align[1] == 'RIGHT') x -= width * scale;

		Renderer.pushMatrix()
			.translate(x, y, z)
			.scale((width / 8) * scale, (height / 8) * scale, 1);

		TextRenderer.draw('█', 0, 0, color, false, Render.getPositionMatrix(), VertexConsumers, TextLayerType.NORMAL, 0, 0);

		Renderer.popMatrix();
		return Render;
	}

	static item({ item, x = 0, y = 0, z = 300, scale = 1, align = Render.CENTER }) {
		align = align.split('_');
		if (align[0] == 'TOP') y += 8 * scale;
		if (align[0] == 'BOTTOM') y -= 8 * scale;
		if (align[1] == 'LEFT') x += 8 * scale;
		if (align[1] == 'RIGHT') x -= 8 * scale;

		const ItemRenderer = Client.getMinecraft().getItemRenderer();

		Renderer.pushMatrix()
			.translate(x, y, z)
			.scale(scale * 16, -scale * 16, 1);

		ItemRenderer.renderItem(item.toMC(), ModelTransformationMode.GUI, 15, 0, Renderer.matrixStack.toMC(), VertexConsumers, World.getWorld(), 0);
		Renderer.popMatrix();
		const stackSize = item.getStackSize() || 1;
		if (stackSize > 1) {
			Render.string({ text: stackSize.toString(), x: x + 9, y: y + 5.5, z: 400, align: Render.RIGHT, shadow: true });
		}
		return Render;
	}
}
