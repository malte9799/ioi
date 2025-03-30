/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import RendererUtils, { RenderLayers } from './RendererUtils';

const Color = java.awt.Color;

const VertexRendering = Java.type('net.minecraft.client.render.VertexRendering');
const RenderLayer = Java.type('net.minecraft.client.render.RenderLayer');
const Vector3f = Java.type('org.joml.Vector3f');
const Vec3d = Java.type('net.minecraft.util.math.Vec3d');

const VCP = Client.getMinecraft().getBufferBuilders().getEntityVertexConsumers();

export default class RenderLib3d {
	static drawBox({ start = new Vec3i(0, 0, 0), size = new Vec3i(1, 1, 1), end = undefined, color = Renderer.WHITE, depthTest = true, filled = false, lineWidth = 2 }) {
		if (end) size = end.subtract(start);
		color = Color.decode(color);

		Renderer.pushMatrix().translate(start.getX() - Client.camera.getX(), start.getY() - Client.camera.getY(), start.getZ() - Client.camera.getZ());

		if (filled) {
			const vertexConsumer = VCP.getBuffer(depthTest ? RenderLayer.getDebugFilledBox() : RenderLayers.getFilledThroughWalls());
			VertexRendering.drawFilledBox(Renderer.matrixStack.toMC(), vertexConsumer, 0, 0, 0, size.getX(), size.getY(), size.getZ(), color.red / 255.0, color.green / 255.0, color.blue / 255.0, 1.0);
		} else {
			const vertexConsumer = VCP.getBuffer(depthTest ? RenderLayers.getLines(lineWidth) : RenderLayers.getLinesThroughWalls(lineWidth));
			VertexRendering.drawBox(Renderer.matrixStack.toMC(), vertexConsumer, 0, 0, 0, size.getX(), size.getY(), size.getZ(), color.red / 255.0, color.green / 255.0, color.blue / 255.0, 1.0);
		}

		Renderer.popMatrix();
	}
	static drawOutline(voxelShape, offset = new Vec3i(0, 0, 0), color = Renderer.WHITE, lineWidth = 1, depthTest = true) {
		color = Color.decode(color);

		const vertexConsumer = VCP.getBuffer(RenderLayers.getLines(lineWidth));
		VertexRendering.drawOutline(Renderer.matrixStack.toMC(), vertexConsumer, voxelShape, offset.getX(), offset.getY(), offset.getZ(), 1.0, 1.0, 1.0, 1.0);
	}
	static drawLine({ start = new Vec3i(0, 0, 0), vector = new Vec3i(0, 0, 0), end = undefined, color = Renderer.WHITE, lineWidth = 1, depthTest = true }) {
		if (end) vector = end.subtract(start);
		color = Color.decode(color);

		vector = new Vec3d(vector.getX(), vector.getY(), vector.getZ());

		Renderer.pushMatrix().translate(start.getX() - Client.camera.getX(), start.getY() - Client.camera.getY(), start.getZ() - Client.camera.getZ());

		const vertexConsumer = VCP.getBuffer(depthTest ? RenderLayers.getLines(lineWidth) : RenderLayers.getLinesThroughWalls(lineWidth));
		VertexRendering.drawVector(Renderer.matrixStack.toMC(), vertexConsumer, new Vector3f(0, 0, 0), vector, RendererUtils.colorToARGB(color));

		Renderer.popMatrix();
	}
}
