if (!global.ioi.metadata) {
	global.ioi.metadata = JSON.parse(FileLib.read('ioi', 'metadata.json'));

	register('gameUnload', () => {
		global.ioi.metadata = undefined;
	});
}

export default global.ioi.metadata;
