const state = {
	links: [],
	filterTags: [],
};

function cleanLinks() {
	document.querySelector('.links__list').innerHTML = '';
}

function showLink(link) {
	const element = renderLink(link);
	document.querySelector('.links__list').appendChild(element);

	// update link status
	pingLink(link).then(link => {
		document.querySelector(`.link[data-id="${link.id}"] .link__status`).innerText = link.status;
	});
	updateNoLinksMessage();
	return element;
}

function updateNoLinksMessage() {
	const linksCount = document.querySelector('.links__list').children.length;
	if (linksCount > 0) {
		document.querySelector('.links__empty').style.display = 'none';
	} else {
		document.querySelector('.links__empty').style.display = 'flex';
	}
}

function showLinks(links = []) {
	cleanLinks();
	state.links = links;
	for (let link of links) {
		showLink(link);
	}
}

function getLinks() {
	return fetch('/api/links')
		.then(response => response.json());
}

function getLinksByTags(tags) {
	return fetch(`/api/links?tags=${tags.map(t => t.name).join(',')}`)
		.then(response => response.json());
}

async function updateLinks() {
	let links = [];
	if (state.filterTags.length > 0) {
		links = await getLinksByTags(state.filterTags);
	} else {
		links = await getLinks();
	}
	showLinks(links);
	updateNoLinksMessage();
}

updateLinks();

function renderFilterTags() {
	const tags = state.filterTags;
	document.querySelector('.links__filter').style.display = 'block';
	if (tags.length === 0) {
		document.querySelector('.links__filter').style.display = 'none';
		return;
	}

	const container = document.querySelector('.links__filter__tags-list');
	container.innerHTML = '';
	tags.forEach(tag => {
		container.appendChild(renderTag(tag, () => {
			removeFilterTag(tag);
		}));
	});
}

function addFilterTag(tag) {
	if (state.filterTags.find(t => t.name === tag.name)) return;
	state.filterTags.push(tag);
	renderFilterTags();
	updateLinks();
}

function removeFilterTag(tag) {
	state.filterTags = state.filterTags.filter(t => t.name !== tag.name);
	renderFilterTags();
	updateLinks();
}