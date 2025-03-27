const ComponentMap = net.minecraft.component.ComponentMap;
const NbtOps = net.minecraft.nbt.NbtOps;
const AbstractNbtList = net.minecraft.nbt.AbstractNbtList;
const NbtCompound = net.minecraft.nbt.NbtCompound;

export default Utils = {
	itemToJson(item) {},
	nbtToJson(nbt) {
		nbt = ComponentMap.CODEC.encodeStart(Player.toMC().getRegistryManager().getOps(NbtOps.INSTANCE), nbt).getOrThrow();
	},
};

const unwrapTag = () => {};

const addCompound = (nbt) => {
	nbt.getKeys().forEach((key) => {
		const nested = nbt.get(key) instanceof AbstractNbtList || nbt.get(key) instanceof NbtCompound;
		if (nested) {
		}
	});
};
const addList = () => {};
const addValue = () => {};
