if (!global.trapped.metadata) {
	global.trapped.metadata = JSON.parse(FileLib.read('trapped', 'metadata.json'));

	register('gameUnload', () => {
		global.trapped.metadata = undefined;
	});
}

export default global.trapped.metadata;
