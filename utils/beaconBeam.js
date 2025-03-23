/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

const BeaconBlockEntityRenderer = Java.type('net.minecraft.client.render.block.entity.BeaconBlockEntityRenderer');
const Identifier = Java.type('net.minecraft.util.Identifier');
const beaconBeamIdentifier = Identifier.ofVanilla('textures/entity/beacon_beam.png');
const GlStateManager = Java.type('com.mojang.blaze3d.platform.GlStateManager');

const vcp = Client.getMinecraft().getBufferBuilders().getEntityVertexConsumers();

export default renderBeaconBeam = function (xPos, yPos, zPos, color = Renderer.WHITE, height = 300, depthCheck = true) {
	Renderer.pushMatrix()
		.translate(xPos, yPos, zPos)
		.translate(-Client.camera.getX(), -Client.camera.getY() + 1.6200000047683716 + 0.38, -Client.camera.getZ());

	// if (!depthCheck) {
	// 	GlStateManager._disableDepthTest();
	// 	GL11.glDisable(GL11.GL_DEPTH_TEST);
	// }

	BeaconBlockEntityRenderer.renderBeam(Renderer.matrixStack.toMC(), vcp, beaconBeamIdentifier, Renderer.partialTicks, 1, World.getTime(), 0, height, color, 0.2, 0.25);
	// if (!depthCheck) {
	// 	GlStateManager._enableDepthTest();
	// 	GL11.glEnable(GL11.GL_DEPTH_TEST);
	// }
	Renderer.popMatrix();
};
