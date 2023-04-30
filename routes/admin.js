const express = require("express");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config/jwt");
const router = express.Router();

const adminUser = {
    id: 1,
    username: "admin",
    password: "adminpassword",
    role: "admin",
};

function hasAccess(user, username, password) {
    return username === user.username && password === user.password;
}
router.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;

    const user = adminUser;

    if (!hasAccess(user, username, password)) {
        res.status(401).json({ success: false, message: "Невірний логін або пароль" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
        expiresIn: "1h"
    });

    res.json({ success: true, token });
});

module.exports = router;
