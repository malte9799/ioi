/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

const RenderSystem = Java.type('com.mojang.blaze3d.systems.RenderSystem');

export default class RendererUtils {
	static getSlotPos(slotIndex) {
		const screen = Player.getContainer().screen;
		if (!(screen instanceof net.minecraft.client.gui.screen.ingame.HandledScreen)) return;
		const slot = screen.getScreenHandler().slots.get(slotIndex);
		return new Vec3i(screen.x + slot.x, screen.y + slot.y, 0);
	}
	static getSlotCenter(slot) {
		const { x, y } = RendererUtils.getSlotPos(slot);
		return new Vec3i(x + 8, y + 8, 0);
	}
	static getPositionMatrix() {
		return Renderer.matrixStack.toMC().peek().positionMatrix;
	}
	static setupRender() {
		RenderSystem.disableCull();
		RenderSystem.enableBlend();
		RenderSystem.defaultBlendFunc();
	}
	static endRender() {
		RenderSystem.disableBlend();
		RenderSystem.enableCull();
	}

	// static getSlotCenter(slot) {
	// 	const invSize = Player.getContainer()?.getSize() || 0;
	// 	let x = slot % 9;
	// 	let y = Math.floor(slot / 9);
	// 	let renderX = Renderer.screen.getWidth() / 2 + (x - 4) * 18;
	// 	let renderY = (Renderer.screen.getHeight() + 9) / 2 + (y - invSize / 18) * 18;
	// 	if (slot >= invSize - 36) renderY += 13;
	// 	return [renderX, renderY];
	// }

	static colorToARGB(color) {
		return (color.getAlpha() << 24) | (color.getRed() << 16) | (color.getGreen() << 8) | color.getBlue();
	}
}

export class Align {
	static TOP_LEFT = 'TOP_LEFT';
	static TOP = 'TOP_CENTER';
	static TOP_RIGHT = 'TOP_RIGHT';
	static LEFT = 'CENTER_LEFT';
	static CENTER = 'CENTER_CENTER';
	static RIGHT = 'CENTER_RIGHT';
	static BOTTOM_LEFT = 'BOTTOM_LEFT';
	static BOTTOM = 'BOTTOM_CENTER';
	static BOTTOM_RIGHT = 'BOTTOM_RIGHT';
}

const VertexFormat = Java.type('net.minecraft.client.render.VertexFormat');
const VertexFormats = Java.type('net.minecraft.client.render.VertexFormats');
const RenderPhase = Java.type('net.minecraft.client.render.RenderPhase');
const RenderLayer = Java.type('net.minecraft.client.render.RenderLayer');
const OptionalDouble = Java.type('java.util.OptionalDouble');
export class RenderLayers {
	static getFilledThroughWalls = () =>
		RenderLayer.of(
			'filled_through_walls',
			VertexFormats.POSITION_COLOR,
			VertexFormat.class_5596.TRIANGLE_STRIP, // .DrawMode.
			1536,
			false,
			true,
			RenderLayer.class_4688 // .MultiPhaseParameters.builder()
				.method_23598()
				.program(RenderPhase.POSITION_COLOR_PROGRAM)
				.layering(RenderPhase.POLYGON_OFFSET_LAYERING)
				.transparency(RenderPhase.TRANSLUCENT_TRANSPARENCY)
				.depthTest(RenderPhase.ALWAYS_DEPTH_TEST)
				.build(false)
		);

	static getLinesThroughWalls = (lineWidth = 2) =>
		RenderLayer.of(
			'lines_through_walls',
			VertexFormats.LINES,
			VertexFormat.class_5596.LINES, // .DrawMode.
			1536,
			false,
			true,
			RenderLayer.class_4688 // .MultiPhaseParameters.builder()
				.method_23598()
				.program(RenderPhase.LINES_PROGRAM)
				.cull(RenderPhase.DISABLE_CULLING)
				.layering(RenderPhase.VIEW_OFFSET_Z_LAYERING)
				.transparency(RenderPhase.TRANSLUCENT_TRANSPARENCY)
				.depthTest(RenderPhase.ALWAYS_DEPTH_TEST)
				.target(RenderPhase.ITEM_ENTITY_TARGET)
				.writeMaskState(RenderPhase.ALL_MASK)
				.lineWidth(new RenderPhase.class_4677(OptionalDouble.of(lineWidth))) // .LineWidth()
				.build(false)
		);

	static getLines = (lineWidth = 2) =>
		RenderLayer.of(
			'lines',
			VertexFormats.LINES,
			VertexFormat.class_5596.LINES, // .DrawMode.
			1536,
			false,
			true,
			RenderLayer.class_4688 // .MultiPhaseParameters.builder()
				.method_23598()
				.program(RenderPhase.LINES_PROGRAM)
				.cull(RenderPhase.DISABLE_CULLING)
				.layering(RenderPhase.VIEW_OFFSET_Z_LAYERING)
				.transparency(RenderPhase.TRANSLUCENT_TRANSPARENCY)
				.depthTest(RenderPhase.ALWAYS_DEPTH_TEST)
				.target(RenderPhase.ITEM_ENTITY_TARGET)
				.writeMaskState(RenderPhase.ALL_MASK)
				.lineWidth(new RenderPhase.class_4677(OptionalDouble.of(lineWidth))) // .LineWidth()
				.build(false)
		);
}

export class OutlineMode {
	static CENTER = 'CENTER';
	static OUTLINE = 'OUTLINE';
	static INLINE = 'INLINE';
}
