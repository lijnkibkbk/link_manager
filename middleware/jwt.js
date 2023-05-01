const jwt = require("express-jwt");
const config = require("../config/config");


const checkJwt = jwt.expressjwt({
    secret: config.jwt.secret,
    algorithms: ["HS256"],
    credentialsRequired: false,
});

function isAdmin(req, res, next) {
    if (req.auth && req.auth.role === "admin") {
        next();
    } else {
        res.status(403).json({message: "Доступ заборонено"});
    }
}

module.exports = {
    checkJwt,
    isAdmin,
}