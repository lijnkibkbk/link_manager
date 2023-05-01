const sqlite3 = require('sqlite3').verbose();

const config = require("./config");

let connection = null;

const getDbConnection = () => {
	if (connection) {
		return connection;
	}
	connection = new sqlite3.Database(config.database.connection.filename, sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Connected to the SQLite database.');
	});
	return connection;
}

module.exports = {
	getDbConnection: getDbConnection
}
