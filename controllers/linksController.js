const Link = require('../models/link');
const Tag = require("../models/tag");

exports.getAll = async (req, res) => {
	try {
		const {tags: filterTags = ''} = req.query;
		let tags = filterTags.split(',').map(t => t.trim()).filter(t => t.length > 0).map(t => ({name: t}));
		let links = [];
		if (tags.length > 0) {
			links = await Link.findByTags(tags);
		} else {
			links = await Link.all();
		}
		for (let link of links) {
			link.tags = await Link.getTags(link.id);
		}
		res.json(links);
	} catch (error) {
		res.status(500).json({message: "Помилка сервера: " + error.message});
	}
};

exports.create = async (req, res) => {
	try {
		const linkData = req.body;
		const createdLinkID = await Link.create(linkData);

		if (linkData.tags && linkData.tags.length > 0) {
			await Tag.createTags(linkData.tags);
		}
		linkData.tags = await Tag.findTags(linkData.tags);
		await Link.addTags(createdLinkID, linkData.tags);

		const createdLink = await Link.find(createdLinkID);
		createdLink.tags = linkData.tags;
		res.json(createdLink);
	} catch (error) {
		res.status(500).json({message: "Помилка сервера: " + error.message});
	}
};

exports.get = async (req, res) => {
	try {
		const {id} = req.params;
		const link = Link.find(id);
		link.tags = await Link.getTags(id);
		res.json(link);
	} catch (error) {
		res.status(500).json({message: "Помилка сервера: " + error.message});
	}
};

exports.update = async (req, res) => {
	try {
		const {id} = req.params;
		const linkData = req.body;
		const updatedLink = await Link.patch(id, linkData);
		if (linkData.tags && linkData.tags.length > 0) {
			await Tag.createTags(linkData.tags);
		}
		await Link.clearTags(id);
		linkData.tags = await Tag.findTags(linkData.tags);
		await Link.addTags(id, linkData.tags);
		res.json(updatedLink);
	} catch (error) {
		res.status(500).json({message: "Помилка сервера: " + error.message});
	}
};

exports.delete = (req, res) => {
	try {
		const {id} = req.params;
		const deletedLink = Link.delete(id);
		res.json(deletedLink);
	} catch (error) {
		res.status(500).json({message: "Помилка сервера: " + error.message});
	}
};
