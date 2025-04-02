import PogObject from 'PogData';
import metadata from 'ioi/metadata';

if (!global.ioi.db) {
	const db = new PogObject(metadata.name, {}, 'data/ioi.data.json');
	db.autosave();
	global.ioi.db = db;

	register('gameUnload', () => {
		if (global.ioi.huds) global.ioi.huds.save();
		global.ioi.huds = undefined;
		global.ioi.db.save();
		global.ioi.db = undefined;
	});
}

export default global.ioi.db;
