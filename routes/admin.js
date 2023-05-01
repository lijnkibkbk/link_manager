const express = require("express");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const router = express.Router();

const adminUser = {
	id: 1,
	role: "admin",
  username: "admin",
  password: "admin",
};

function hasAccess(user, username, password) {
	return username === user.username && password === user.password;
}

router.post("/login", async (req, res) => {
	const {username, password} = req.body;

	const user = adminUser;

	if (!hasAccess(user, username, password)) {
		res.status(401).json({success: false, message: "Невірний логін або пароль"});
		return;
	}

	const token = jwt.sign({id: user.id, role: user.role}, config.jwt.secret, {
		expiresIn: "1h"
	});

	res.json({success: true, token});
});

router.get("/me", async (req, res) => {
		try {
			const token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, config.jwt.secret);
			res.json({success: true, user: decoded});
		} catch (error) {
			res.status(401).json({success: false, message: "Невірний токен"});
		}
	}
);

module.exports = router;
