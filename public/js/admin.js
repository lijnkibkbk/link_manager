function getToken() {
	return 'Bearer ' + localStorage.getItem('token');
}

function showAddLinkButton() {
	let button = document.createElement('button');
	button.innerText = 'Add Link';
	button.onclick = showAddLinkForm;
	document.querySelector('.add-link-form').innerHTML = '';
	document.querySelector('.add-link-form').appendChild(button);
}

function showAddLinkForm() {
	let form = document.createElement('form');
	form.innerHTML = `
                <input type="text" name="url" placeholder="URL">
                <input type="text" name="description" placeholder="Description">
                <input type="text" name="author" placeholder="Author">
                <button type="submit">Add</button>
            `;
	form.onsubmit = addLink;
	document.querySelector('.add-link-form').innerHTML = '';
	document.querySelector('.add-link-form').appendChild(form);
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
			showAddLinkButton();
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

(async () => {
	const user = await getMe();
	if (user == null) {
		hideLogoutButton();
		return;
	}

	showAddLinkButton();
})();