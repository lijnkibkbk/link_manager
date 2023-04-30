module.exports = {
    database: {
        client: 'sqlite3',
        connection: {
            filename: './db/database.sqlite3'
        },
    },
    jwt: {
        secret: "your_jwt_secret",
    }
}