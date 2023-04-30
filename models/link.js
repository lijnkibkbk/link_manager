
const {getDbConnection} = require("../config/database");
const db = getDbConnection();

class Link {
    constructor(id, url, description, tags, author, archived, archived_at, created_at, updated_at) {
        this.id = id;
        this.url = url;
        this.description = description;
        this.tags = tags;
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
            const query = "UPDATE links SET url = ?, description = ?, author = ?, archived = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            const params = [linkData.url, linkData.description, linkData.author, linkData.archived, id];
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
}

module.exports = Link;