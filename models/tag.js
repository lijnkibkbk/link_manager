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
}

module.exports = Tag;