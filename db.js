import PogObject from 'PogData';
import metadata from './metadata';

if (!global.trapped.db) {
	const db = new PogObject(metadata.name, {}, 'data/trapped.data.json');
	db.autosave();
	global.trapped.db = db;

	register('gameUnload', () => {
		global.trapped.db = undefined;
	});
}

export default global.trapped.db;
