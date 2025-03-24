export default class WroldLib {
	static getBlocksInDistance(type, point, distance) {
		const blocks = [];
		const hDistance = distance / 2;
		for (let x = -hDistance + point.x; x <= hDistance + point.x; x++) {
			for (let y = -hDistance + point.y; y <= hDistance + point.y; y++) {
				for (let z = -hDistance + point.z; z <= hDistance + point.z; z++) {
					const block = World?.getBlockAt(x, y, z);
					if (!block) return;
					if (block.type.getRegistryName() === type) {
						blocks.push(block);
					}
				}
			}
		}
		return blocks;
	}
}
