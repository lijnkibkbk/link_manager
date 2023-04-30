const express = require('express');
const bodyParser = require('body-parser');
const links = require('./routes/links');
const admin = require('./routes/admin');
const {checkJwt} = require("./middleware/jwt");


const app = express();

app.use(checkJwt);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/links', links);
app.use('/api/admin', admin);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
