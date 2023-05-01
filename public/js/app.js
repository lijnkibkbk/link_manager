function cleanLinks() {
	document.querySelector('.links__list').innerHTML = '';
}

function showLink({url, description, author}) {
	let item = document.createElement('div');
	item.innerHTML = `
                <a href="${url}">${url}</a>
                <span>${description}</span>
                <span>${author}</span>
            `;
	document.querySelector('.links__list').appendChild(item);
}

function showLinks(links) {
	cleanLinks();
	links.forEach(link => showLink(link));
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