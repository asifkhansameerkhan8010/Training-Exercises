// Function to render the user list
function renderUsers() {
    const userListBody = document.getElementById('user-list-body');
    userListBody.innerHTML = ''; // Clear existing list

    // Iterate through all users in local storage
    for (const key in localStorage) {
        if (key !== 'loggedInUser' && key !== 'admin@example.com') { // Skip logged-in user and admin credentials
            const storedUser = localStorage.getItem(key);

            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);

                    // Ensure user object has expected properties
                    if (user.username && user.email && user.role) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>
                                <button onclick="editUser('${key}')">Edit</button>
                                <button onclick="deleteUser('${key}')">Delete</button>
                            </td>
                        `;
                        userListBody.appendChild(row);
                    }
                } catch (e) {
                    console.error('Error parsing user data', e);
                }
            }
        }
    }
}
