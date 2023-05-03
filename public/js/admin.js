function getToken() {
	return 'Bearer ' + localStorage.getItem('token');
}

function hideAddLinkButton() {
	document.querySelector('.links__add-button').style.display = 'none';
}

function findLinkElement(link) {
	return document.querySelector(`.link[data-id="${link.id}"]`);
}

function bindAddLinkButton() {
	const newLink = {id: -1, tags: []};
	document.querySelector('.links__add-button').onclick = () => {
		if (findLinkElement(newLink)) return;
		showLink(newLink);
		// scroll to top
		window.scrollTo(0, 0);
		// focus on url input
		const newLinkElement = findLinkElement(newLink);
		newLinkElement.querySelector('.link__url-input').focus();
	}
}

function hideAddLinkForm() {
	document.querySelector('.links__add').innerHTML = '';
}

function addLink(link) {
	fetch('/api/links', {
		method: 'POST', headers: {
			'Content-Type': 'application/json', 'Authorization': getToken(),
		}, body: JSON.stringify(link)
	})
		.then(response => response.json())
		.then(link => {
			console.log("New link", link);
			hideAddLinkForm();
			return showLink(link);
		});
}


function patchLink(link) {
	console.log("Updating", link);
	fetch(`/api/links/${link.id}`, {
		method: 'PATCH', headers: {
			'Content-Type': 'application/json', 'Authorization': getToken(),
		}, body: JSON.stringify(link)
	})
		.then(response => response.json())
		.then(link => {
			console.log("Updated", link);
			return updateLinks();
		});
}

function deleteLink(link) {
	fetch(`/api/links/${link.id}`, {
		method: 'DELETE', headers: {
			'Authorization': getToken(),
		}
	})
		.then(response => {
			console.log("Deleted", link);
			return updateLinks();
		});
}

async function getMe() {
	try {
		const res = await fetch('/api/admin/me', {
			headers: {
				'Authorization': getToken(),
			},
		});
		if (res.status === 401) {
			return Promise.resolve(null);
		}

		let response = await res.json();
		console.log("User", response.user);
		document.querySelector('.user').innerText = response.user.role;
		return response.user;
	} catch (error) {
		console.error("Error", error);
		document.querySelector('.user').innerText = '';
		return Promise.resolve(null);
	}
}

function hideLogoutButton() {
	document.querySelector('.logout').style.display = 'none';
}

function hideLoginButton() {
	document.querySelector('.login').style.display = 'none';
}

let _isAdmin = false;

function isAdmin() {
	return _isAdmin;
}

(async () => {
	const user = await getMe();
	if (user == null) {
		hideLogoutButton();
		hideAddLinkButton();
		return;
	}

	_isAdmin = user.role === 'admin';
	hideLoginButton();
	bindAddLinkButton();
})();