const axios = require('axios');

async function pingLink(url) {
	let status = 'Archived';
	try {
		const response = await axios.head(url);

		if (response.status >= 200 && response.status < 300) {
			status = 'Actual';
		}
	} catch (error) {
	}
	return status;
}

exports.ping = async (req, res) => {
	try {
		const {url} = req.body;
		const status = await pingLink(url);
		res.json(status);
	} catch (error) {
		res.status(500).json({message: "Помилка сервера: " + error.message});
	}
};
