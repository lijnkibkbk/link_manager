function cleanLinks() {
	document.querySelector('.link-container').innerHTML = '';
}

function showLink({url, description, author}) {
	let item = document.createElement('div');
	item.innerHTML = `
                <a href="${url}">${url}</a>
                <span>${description}</span>
                <span>${author}</span>
            `;
	document.querySelector('.link-container').appendChild(item);
}

function showLinks(links) {
	cleanLinks();
	links.forEach(link => showLink(link));
}

function getLinks() {
	fetch('/api/links')
		.then(response => response.json())
		.then(links => showLinks(links));
}

getLinks();