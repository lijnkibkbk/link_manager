const {getDbConnection} = require("../config/database");
const db = getDbConnection();


class Link {
	constructor(id, url, description, tags, author, archived, archived_at, created_at, updated_at) {
		this.id = id;
		this.url = url;
		this.description = description;
		this.tags = tags || [];
		this.author = author;
		this.archived = archived;
		this.archived_at = archived_at;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	static all() {
		return new Promise((resolve, reject) => {
			const query = "SELECT * FROM links";
			db.all(query, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows.map((row) => new Link(row.id, row.url, row.description, row.tags, row.author, row.archived, row.archived_at, row.created_at, row.updated_at)));
				}
			});
		});
	}

	static create(linkData) {
		return new Promise((resolve, reject) => {
			const query = "INSERT INTO links (url, description, author) VALUES (?, ?, ?)";
			const params = [linkData.url, linkData.description, linkData.author];
			db.run(query, params, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve(this.lastID);
				}
			});
		});
	}

	static patch(id, linkData) {
		return new Promise((resolve, reject) => {
			const query = "UPDATE links SET url = ?, description = ?, author = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
			const params = [linkData.url, linkData.description, linkData.author, id];
			db.run(query, params, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve(this.lastID);
				}
			});
		});
	}

	static delete(id) {
		return new Promise((resolve, reject) => {
			const query = "DELETE FROM links WHERE id = ?";
			const params = [id];
			db.run(query, params, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve(this.lastID);
				}
			});
		});
	}

	static find(id) {
		return new Promise((resolve, reject) => {
			const query = "SELECT * FROM links WHERE id = ?";
			const params = [id];
			db.get(query, params, (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(new Link(row.id, row.url, row.description, row.tags, row.author, row.archived, row.archived_at, row.created_at, row.updated_at));
				}
			});
		});
	}

	static getTags(id) {
		return new Promise((resolve, reject) => {
			const query = "SELECT tags.id, tags.name FROM tags INNER JOIN link_tags ON tags.id = link_tags.tag_id WHERE link_tags.link_id = ?";
			const params = [id];
			db.all(query, params, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows.map((row) => ({id: row.id, name: row.name})));
				}
			});
		});
	}

	static findByTags(tags) {
		return new Promise((resolve, reject) => {
			const query = "SELECT * FROM links WHERE id IN (SELECT link_id FROM link_tags WHERE tag_id IN (SELECT id FROM tags WHERE name IN (" + tags.map(() => "?").join(",") + ")))";
			const params = tags.map(tag => tag.name);
			db.all(query, params, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows.map((row) => new Link(row.id, row.url, row.description, row.tags, row.author, row.archived, row.archived_at, row.created_at, row.updated_at)));
				}
			});
		});
	}

	static clearTags(id) {
		return new Promise((resolve, reject) => {
			const query = "DELETE FROM link_tags WHERE link_id = ?";
			const params = [id];
			db.run(query, params, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve(this.lastID);
				}
			});
		});
	}

	static addTags(id, tags = []) {
		return new Promise((resolve, reject) => {
			if (tags.length === 0) {
				resolve();
				return;
			}

			const query = "INSERT INTO link_tags (link_id, tag_id) VALUES (?, ?)";
			const params = tags.map(tag => [id, tag.id]);

			db.serialize(() => {
				db.run("BEGIN TRANSACTION");

				for (const param of params) {
					db.run(query, param, function (err) {
						if (err) {
							db.run("ROLLBACK");
							reject(err);
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

}

module.exports = Link;