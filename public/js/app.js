function cleanLinks() {
	document.querySelector('.links__list').innerHTML = '';
}

function showLink(link) {
	const element = renderLink(link);
	document.querySelector('.links__list').appendChild(element);
	return element;
}

function showLinks(links) {
	cleanLinks();
	for (let link of links) {
		showLink(link);
	}
}

function getLinks() {
	return fetch('/api/links')
		.then(response => response.json());
}

function updateLinks() {
	getLinks()
		.then(links => showLinks(links));
}

updateLinks();