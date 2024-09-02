"use strict";
// UserManager class for managing users
var UserManager = /** @class */ (function () {
    function UserManager() {
        // private array to hold the users
        this.users = [];
   
        this.idCounter = 1;
    }
    UserManager.prototype.addUser = function (name, email, role) {
        var newUser = {
            id: this.idCounter++,
            name: name,
            email: email,
            role: role,
        };
        this.users.push(newUser);
    };
    // Generic method to find a user by any property (e.g., by ID or email)
    UserManager.prototype.findUserBy = function (property, value) {
        return this.users.find(function (user) { return user[property] === value; });
    };
    // Method to update a user's role, ensuring only valid roles are assigned
    UserManager.prototype.updateUserRole = function (userId, newRole) {
        var user = this.findUserBy('id', userId);
        if (user) {
            user.role = newRole;
        }
        else {
            console.error('User not found');
        }
    };
    // Method to delete a user by id
    UserManager.prototype.deleteUser = function (userId) {
        this.users = this.users.filter(function (user) { return user.id !== userId; });
    };
    // Method to get the list of users
    UserManager.prototype.getUsers = function () {
        return this.users;
    };
    return UserManager;
}());
// Initialize UserManager
var userManager = new UserManager();
// HTML Elements
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var roleSelect = document.getElementById('role');
var addUserButton = document.querySelector('.add-user-button');
var userListTable = document.querySelector('.user-list tbody');
// Add user button click event
addUserButton.addEventListener('click', function () {
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var role = roleSelect.value;
    if (name && email) {
        userManager.addUser(name, email, role);
        renderUserList();
        nameInput.value = '';
        emailInput.value = '';
    }
    else {
        alert('Please enter both name and email.');
    }
});
// Render user list in the table
function renderUserList() {
    userListTable.innerHTML = ''; // Clear current list
    userManager.getUsers().forEach(function (user) {
        var row = document.createElement('tr');
        row.innerHTML = "\n            <td>".concat(user.name, "</td>\n            <td>").concat(user.email, "</td>\n            <td>").concat(user.role, "</td>\n            <td>\n                <button class=\"edit-button\" onclick=\"editUser(").concat(user.id, ")\">Edit</button>\n                <button class=\"delete-button\" onclick=\"deleteUser(").concat(user.id, ")\">Delete</button>\n            </td>\n        ");
        userListTable.appendChild(row);
    });
}
// Edit user role
window.editUser = function (userId) {
    var newRole = prompt('Enter new role (admin/user):');
    if (newRole === 'admin' || newRole === 'user') {
        userManager.updateUserRole(userId, newRole);
        renderUserList();
    }
    else {
        alert('Invalid role!');
    }
};
// Delete user
window.deleteUser = function (userId) {
    userManager.deleteUser(userId);
    renderUserList();
};
