function renderUsers() {
    const userListBody = document.getElementById('user-list-body');
    userListBody.innerHTML = ''; 
    for (const key in localStorage) {
        if (key !== 'loggedInUser' && key !== 'admin@example.com') { 
            const storedUser = localStorage.getItem(key);

        }
    }
}
