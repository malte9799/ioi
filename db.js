import PogObject from 'PogData';
import metadata from './metadata';

// class DB extends PogObject {
// 	constructor() {
// 		super(metadata.name, {});
// 	}

//     ensurePath(path) {

//     }
// }

if (!global.trapped.db) {
	const db = new PogObject(metadata.name, {});
	db.autosave();
	global.trapped.db = db;

	register('gameUnload', () => {
		global.trapped.db = undefined;
	});
}

export default global.trapped.db;
