const express = require('express');
const bodyParser = require('body-parser');
const admin = require('./routes/admin');
const links = require('./routes/links');
const tags = require('./routes/tags');
const status = require('./routes/status');
const {checkJwt} = require("./middleware/jwt");
require("./db/database.sqlite3.js");
const path = require("path");


const app = express();

app.use(checkJwt);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/admin', admin);
app.use('/api/links', links);
app.use('/api/tags', tags);
app.use('/api/status', status);

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
	console.log(`http://localhost:${port}`);
});
