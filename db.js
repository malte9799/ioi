import PogObject from 'PogData';
import metadata from './metadata';

if (!global.ioi.db) {
	const db = new PogObject(metadata.name, {}, 'data/ioi.data.json');
	db.autosave();
	global.ioi.db = db;

	register('gameUnload', () => {
		global.ioi.db.save();
		global.ioi.db = undefined;
	}).setPriority(Priority.LOWEST);
}

export default global.ioi.db;
