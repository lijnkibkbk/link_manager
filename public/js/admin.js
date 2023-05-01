function getToken() {
	return 'Bearer ' + localStorage.getItem('token');
}

function bindAddLinkButton() {
	document.querySelector('.links__add-button').onclick = showAddLinkForm;
}

function hideAddLinkForm() {
	document.querySelector('.links__add').innerHTML = '';
}

function showAddLinkForm() {
	hideAddLinkForm();
	let form = document.createElement('form');
	form.innerHTML = `
                <input type="text" name="url" placeholder="URL">
                <input type="text" name="description" placeholder="Description">
                <input type="text" name="author" placeholder="Author">
                <button type="submit">Add</button>
            `;
	form.onsubmit = addLink;
	document.querySelector('.links__add').appendChild(form);
	form.querySelector('input').focus();
}

function addLink(event) {
	event.preventDefault();
	let form = event.target;
	let url = form.url.value;
	let description = form.description.value;
	let author = form.author.value;
	fetch('/api/links', {
		method: 'POST', headers: {
			'Content-Type': 'application/json', 'Authorization': getToken(),
		}, body: JSON.stringify({url, description, author})
	})
		.then(response => response.json())
		.then(link => {
			console.log("New link", link);
			showLink(link);
			hideAddLinkForm();
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

(async () => {
	const user = await getMe();
	if (user == null) {
		hideLogoutButton();
		return;
	}

	hideLoginButton();
	bindAddLinkButton();
})();