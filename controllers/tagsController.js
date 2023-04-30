const Tag = require('../models/tag');

exports.get = async (req, res) => {
    try {
        const { search } = req.query;
        const tags = await Tag.searchTags(search);
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера: " + error.message });
    }
};
