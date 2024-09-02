document.addEventListener("DOMContentLoaded", () => {
    const addUserForm = document.getElementById("addUserForm");
    const userTableBody = document.querySelector(".user-table tbody");
    let editIndex = null; // Variable to track the index of the user being edited

    // Sample users data
    const users = [
        { username: "john_doe", email: "john@example.com", role: "User" },
        { username: "admin_user", email: "admin@example.com", role: "Admin" }
    ];

    // Function to render the users in the table
    function renderUsers() {
        userTableBody.innerHTML = ""; // Clear existing rows
        users.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="edit-button" onclick="editUser(${index})">Edit</button>
                    <button class="delete-button" onclick="deleteUser(${index})">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    // Function to handle adding or editing a user
    function handleUserSubmit(event) {
        event.preventDefault();
        const username = addUserForm.username.value.trim();
        const email = addUserForm.email.value.trim();
        const password = addUserForm.password.value.trim();
        const role = addUserForm.role.value;

        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!isUniqueEmail(email, editIndex)) {
            alert("Email must be unique.");
            return;
        }

        if (username && email && password) {
            if (editIndex === null) {
                // Adding a new user
                users.push({ username, email, role });
            } else {
                // Editing an existing user
                users[editIndex] = { username, email, role };
                editIndex = null; // Reset after editing
            }
            renderUsers();
            addUserForm.reset();
        } else {
            alert("Please fill in all fields.");
        }
    }

    // Function to edit a user
    window.editUser = function (index) {
        const user = users[index];
        addUserForm.username.value = user.username;
        addUserForm.email.value = user.email;
        addUserForm.password.value = ""; // Clear password field for security
        addUserForm.role.value = user.role;
        editIndex = index; // Track the index being edited
    };

    // Function to delete a user
    window.deleteUser = function (index) {
        if (confirm("Are you sure you want to delete this user?")) {
            users.splice(index, 1);
            renderUsers();
        }
    };

    // Function to validate email format
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Function to check for unique email
    function isUniqueEmail(email, currentIndex) {
        return !users.some((user, index) => user.email === email && index !== currentIndex);
    }

    // Event listener for form submission
    addUserForm.addEventListener("submit", handleUserSubmit);

    // Initial render of the user list
    renderUsers();
});
