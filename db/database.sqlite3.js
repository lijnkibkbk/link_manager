const { getDbConnection } = require('../config/database');

class Link {
    constructor(id, url, description, tags, author, status, status_update_date, creation_date, update_date) {
        this.id = id;
        this.url = url;
        this.description = description;
        this.tags = tags;
        this.author = author;
        this.status = status;
        this.status_update_date = status_update_date;
        this.creation_date = creation_date;
        this.update_date = update_date;
    }

    static all(callback) {
        const db = getDbConnection();
        db.all("SELECT * FROM links", [], (err, rows) => {
            if (err) {
                callback(err, null);
                return;
            }
            const links = rows.map(row => new Link(row.id, row.url, row.description, row.tags, row.author, row.status, row.status_update_date, row.creation_date, row.update_date));
            callback(null, links);
        });
        db.close();
    }
}

module.exports = Link;
