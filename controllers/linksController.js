const Link = require('../models/link');

exports.getAll = async (req, res) => {
    try {
        const links = await Link.all();
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера: " + error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const linkData = req.body;
        const createdLink = await Link.create(linkData);
        res.json(createdLink);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера: " + error.message });
    }
};

exports.get = (req, res) => {
    try {
        const { id } = req.params;
        const link = Link.find(id);
        res.json(link);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера: " + error.message });
    }
};

exports.update = (req, res) => {
    try {
        const { id } = req.params;
        const linkData = req.body;
        const updatedLink = Link.patch(id, linkData);
        res.json(updatedLink);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера: " + error.message });
    }
};

exports.delete = (req, res) => {
    try {
        const { id } = req.params;
        const deletedLink = Link.delete(id);
        res.json(deletedLink);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера: " + error.message });
    }
};
