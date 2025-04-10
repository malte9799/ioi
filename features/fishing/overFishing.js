/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />
import Feature from 'ioi/class/Feature';
import RenderLib3d from 'ioi/utils/RenderLib3d';

const FishingBobberEntity = Java.type('net.minecraft.entity.projectile.FishingBobberEntity');
const Box = Java.type('net.minecraft.util.math.Box');
const Vec3d = Java.type('net.minecraft.util.math.Vec3d');
const RenderSystem = Java.type('com.mojang.blaze3d.systems.RenderSystem');

class OverFishing extends Feature {
	constructor() {
		super();

		this.isDefaultEnabled = true;

		this.bobberPos = undefined;
		this.timeout = 1000; // in ms

		// this.lastPos = undefined;
		this.lastBox = undefined;

		this.waterY = 62;
		this.dist = 3;

		this.counter = 0;
	}

	initSettings(Settings) {}

	onEnable() {
		this.registerEvent('playerInteract', (action, pos, event) => {
			if (action.toString() !== 'UseItem') return;
			const item = Player.getHeldItem()?.getType()?.getRegistryName();
			if (!item || item !== 'minecraft:fishing_rod') return;
			const bobber = World.getAllEntitiesOfType(FishingBobberEntity).find((e) => e.toMC()?.getPlayerOwner()?.getName()?.getString() === Player.getName()) || undefined;
			if (!bobber) return;
			const pos = new Vec3d(bobber.getX(), this.waterY, bobber.getZ());
			// this.bobberPos = new Vec3f(bobber.getX(), this.waterY, bobber.getZ());
			this.bobberBox = Box.of(pos, this.dist / 2, 1, this.dist / 2);
		});

		this.registerChat('| FISH | You caught a ${size}cm ${rarity} ${name}!', (size, rarity, name, event) => {
			// if (!this.bobberPos) return;
			// if (!this.lastPos || !this.inRange(this.bobberPos, this.lastPos, this.dist)) {
			// 	this.lastPos = this.bobberPos;
			// }
			// this.bobberPos = undefined;
			if (!this.bobberBox) return;
			const sameTarget = this.lastBox && this.lastBox.intersects(this.bobberBox);
			if (sameTarget) {
				this.counter++;
			} else {
				this.counter = 1;
				this.lastBox = this.bobberBox;
			}
		});
		// TODO: unregister whenever postRenderWorld when possible
		this.registerEvent('postRenderWorld', () => {
			if (this.counter <= 1) return;
			if (!this.lastBox) return;
			const lineWidth = Math.min(this.counter, 3);
			const color = this.counter == 1 ? Renderer.getColor(255, 255, 255, 150) : this.counter == 2 ? Renderer.getColor(254, 254, 63, 200) : Renderer.getColor(254, 63, 63, 250);
			const d = this.dist / 2;
			const { x, z } = this.lastBox.getCenter();
			Renderer.pushMatrix().translate(x, this.waterY, z).enableDepth(); //.disableCull()

			RenderSystem.lineWidth(lineWidth);
			Renderer3d.begin(Renderer.DrawMode.LINES, Renderer.VertexFormat.LINES);
			Renderer3d.pos(-d, 0, -d).color(color).normal(1, 0, 0).pos(d, 0, -d).color(color).normal(1, 0, 0);
			Renderer3d.pos(d, 0, -d).color(color).normal(0, 0, 1).pos(d, 0, d).color(color).normal(0, 0, 1);
			Renderer3d.pos(d, 0, d).color(color).normal(-1, 0, 0).pos(-d, 0, d).color(color).normal(-1, 0, 0);
			Renderer3d.pos(-d, 0, d).color(color).normal(0, 0, -1).pos(-d, 0, -d).color(color).normal(0, 0, -1);
			Renderer3d.draw();
			RenderSystem.lineWidth(1.0);

			// Renderer3d.drawLine(color, -d, 0, -d, d, 0, -d, lineWidth);

			// Renderer3d.drawLine(color, -d, 0, -d, d, 0, -d, lineWidth);
			// Renderer3d.drawLine(color, d, 0, -d, d, 0, d, lineWidth);
			// Renderer3d.drawLine(color, d, 0, d, -d, 0, d, lineWidth);
			// Renderer3d.drawLine(color, -d, 0, d, -d, 0, -d, lineWidth);

			Renderer.popMatrix();

			// RenderLib3d.drawBox({ start: this.lastBox.getMinPos(), end: this.lastBox.getMaxPos(), color });
		});
	}

	onDisable() {}

	inRange(pos1, pos2, dist) {
		return Math.abs(pos1.getX() - pos2.getX()) <= dist && Math.abs(pos1.getY() - pos2.getY()) <= dist && Math.abs(pos1.getZ() - pos2.getZ()) <= dist;
	}
}
module.exports = {
	class: new OverFishing(),
};
