import {jwtSecret} from "../config/jwt";

const jwt = require("express-jwt");

export const checkJwt = jwt({
    secret: jwtSecret,
    algorithms: ["HS256"],
});

export function isAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Доступ заборонено" });
    }
}
