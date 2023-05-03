const {getDbConnection} = require("../config/database");
const db = getDbConnection();

class Tag {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	static searchTags(search) {
		return new Promise((resolve, reject) => {
			let query = "SELECT DISTINCT tag FROM links";
			const params = [];

			if (search) {
				query += " WHERE tag LIKE ?";
				params.push(`%${search}%`);
			}

			db.all(query, params, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows.map((row) => row.tag));
				}
			});
		});
	}

	static createTags(tags = []) {
		return new Promise((resolve, reject) => {
			if (tags.length === 0) {
				resolve();
				return;
			}

			const query = "INSERT OR IGNORE INTO tags (name) VALUES (?)";

			db.serialize(() => {
				db.run("BEGIN TRANSACTION");

				for (const tag of tags) {
					db.run(query, tag.name, function (err) {
						if (err) {
							db.run("ROLLBACK");
							reject(err);
							return;
						}
					});
				}

				db.run("COMMIT", (err) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			});
		});
	}


	static findTags(tags = []) {
		return new Promise((resolve, reject) => {
			if (tags.length === 0) {
				resolve([]);
				return;
			}

			const query = `SELECT * FROM tags WHERE name IN (${Array(tags.length).fill('?').join(', ')})`;
			const params = tags.map(tag => tag.name);
			db.all(query, params, function (err, rows) {
				if (err) {
					reject(err);
				} else {
					resolve(rows.map((row) => ({id: row.id, name: row.name})));
				}
			});
		});
	}
}

module.exports = Tag;