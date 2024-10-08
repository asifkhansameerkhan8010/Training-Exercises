document.addEventListener('DOMContentLoaded', function() {
    const userListBody = document.getElementById('user-list-body');
    const addUserForm = document.getElementById('add-user-form');
    const signupError = document.getElementById('signup-error');
    let editingEmail = null; // Track the email of the user being edited

    // Function to retrieve and display users
    function displayUsers() {
        userListBody.innerHTML = '';

        const keys = Object.keys(localStorage);
        const userKeys = keys.filter(key => {
            return key.includes('@') && !key.includes('events') && !key.includes('guests') && key !== 'loggedInUser';
        });

        userKeys.forEach(key => {
            const userData = localStorage.getItem(key);
            if (userData) {
                const user = JSON.parse(userData);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role || 'user'}</td>
                    <td>
                        <button class="edit-button" data-email="${user.email}">Edit</button>
                        <button class="delete-button" data-email="${user.email}">Delete</button>
                    </td>
                `;
                userListBody.appendChild(row);
            }
        });
    }

    // Display users when the page loads
    displayUsers();

    // Handle Edit and Delete actions
    userListBody.addEventListener('click', function(event) {
        const button = event.target;
        const email = button.getAttribute('data-email');

        if (button.classList.contains('edit-button')) {
            // Handle edit action
            const user = JSON.parse(localStorage.getItem(email));
            if (user) {
                const usernameInput = document.getElementById('username');
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                const confirmPasswordInput = document.getElementById('confirm-password');
                const roleSelect = document.getElementById('role');

                if (usernameInput && emailInput && passwordInput && confirmPasswordInput && roleSelect) {
                    usernameInput.value = user.username;
                    emailInput.value = user.email;
                    passwordInput.value = user.password;
                    confirmPasswordInput.value = user.password; // Set confirmation password
                    roleSelect.value = user.role || 'user'; // Set role
                    editingEmail = email; // Set the email of the user being edited
                } else {
                    console.error('One or more form elements are missing.');
                }
            }
        } else if (button.classList.contains('delete-button')) {
            // Handle delete action
            if (confirm('Are you sure you want to delete this user?')) {
                localStorage.removeItem(email);
                deleteUserRelatedData(email);
                displayUsers(); // Refresh the user list
            }
        }
    });

    // Handle form submission for adding or updating users
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const role = document.getElementById('role').value;

            if (password !== confirmPassword) {
                signupError.textContent = 'Passwords do not match!';
                return;
            }

            if (editingEmail) {
                // Update existing user
                localStorage.removeItem(editingEmail);
                if (localStorage.getItem(email) && email !== editingEmail) {
                    signupError.textContent = 'An account with this email already exists!';
                    return;
                }
                const updatedUser = { username, email, password, role };
                localStorage.setItem(email, JSON.stringify(updatedUser));

                // Reset editing mode
                editingEmail = null;
            } else {
                // Add new user
                if (localStorage.getItem(email)) {
                    signupError.textContent = 'An account with this email already exists!';
                    return;
                }
                const newUser = { username, email, password, role };
                localStorage.setItem(email, JSON.stringify(newUser));
            }

            signupError.textContent = '';
            addUserForm.reset();
            displayUsers(); // Refresh the user list
        });
    }

    // Function to delete user-related data
    function deleteUserRelatedData(email) {
        const eventKeys = Object.keys(localStorage).filter(key => key.startsWith(`events_${email}`));
        eventKeys.forEach(key => {
            const eventData = JSON.parse(localStorage.getItem(key));
            if (eventData) {
                eventData.forEach(event => {
                    localStorage.removeItem(`guests_${email}_${event.id}`);
                });
            }
            localStorage.removeItem(key);
        });

        const agendaKey = `agenda_${email}`;
        localStorage.removeItem(agendaKey);
    }
    
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior

            // Clear user session data from local storage
            localStorage.removeItem('loggedInUser'); // Adjust this if you store authentication data differently

            // Redirect to the login page
            window.location.href = 'login.html'; // Update this to the actual path of your login page
        });
    }
});
