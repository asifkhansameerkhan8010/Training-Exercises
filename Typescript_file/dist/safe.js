"use strict";
var UserManager = /** @class */ (function () {
    function UserManager() {
        this.users = [];
        this.idCounter = 1;
    }
    UserManager.prototype.addUser = function (name, email, role) {
        if (this.isEmailDuplicate(email)) {
            console.error('Email already exists');
            return;
        }
        var newUser = {
            id: this.idCounter++,
            name: name,
            email: email,
            role: role,
        };
        this.users.push(newUser);
    };
    UserManager.prototype.isEmailDuplicate = function (email) {
        return this.users.some(function (user) { return user.email === email; });
    };
    UserManager.prototype.findUserBy = function (property, value) {
        return this.users.find(function (user) { return user[property] === value; });
    };
    UserManager.prototype.updateUser = function (userId, property, value) {
        var user = this.findUserBy('id', userId);
        if (user) {
            user[property] = value;
        }
        else {
            console.error('User not found');
        }
    };
    UserManager.prototype.deleteUser = function (userId) {
        this.users = this.users.filter(function (user) { return user.id !== userId; });
    };
    UserManager.prototype.getUsers = function () {
        return this.users;
    };
    return UserManager;
}());
var userManager = new UserManager();
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var roleSelect = document.getElementById('role');
var addUserButton = document.querySelector('.add-user-button');
var userListTable = document.querySelector('.user-list tbody');
var isEditing = false;
var editingUserId = null;
addUserButton.addEventListener('click', function () {
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var role = roleSelect.value;
    var fillerr = document.getElementById("fillerr");
    var emailerr = document.getElementById("emailerr");
    if (name && email) {
        fillerr.style.display = "none";
        if (isEditing) {
            if (editingUserId !== null) {
                var currentUser = userManager.findUserBy('id', editingUserId);
                if (currentUser && currentUser.email !== email && userManager.isEmailDuplicate(email)) {
                    emailerr.style.display = "block";
                    return;
                }
                userManager.updateUser(editingUserId, 'name', name);
                userManager.updateUser(editingUserId, 'email', email);
                userManager.updateUser(editingUserId, 'role', role);
                isEditing = false;
                editingUserId = null;
                addUserButton.textContent = 'Add User';
            }
        }
        else {
            if (userManager.isEmailDuplicate(email)) {
                emailerr.style.display = "block";
                return;
            }
            emailerr.style.display = "none";
            userManager.addUser(name, email, role);
        }
        renderUserList();
        clearInputFields();
    }
    else {
        fillerr.style.display = "block";
    }
});
function renderUserList() {
    userListTable.innerHTML = '';
    userManager.getUsers().forEach(function (user, index) {
        var rowNumber = index + 1;
        var row = document.createElement('tr');
        row.innerHTML = "\n            <td>".concat(rowNumber, ". ").concat(user.name, "</td>\n            <td>").concat(user.email, "</td>\n            <td>").concat(user.role, "</td>\n            <td>\n                <button class=\"edit-button\" data-user-id=\"").concat(user.id, "\">Edit</button>\n                <button class=\"delete-button\" data-user-id=\"").concat(user.id, "\">Delete</button>\n            </td>\n        ");
        userListTable.appendChild(row);
    });
    addEventListeners();
}
function addEventListeners() {
    userListTable.querySelectorAll('.edit-button').forEach(function (button) {
        button.addEventListener('click', function () {
            var buttonElement = button;
            var userId = parseInt(buttonElement.dataset.userId);
            var user = userManager.findUserBy('id', userId);
            if (user) {
                nameInput.value = user.name;
                emailInput.value = user.email;
                roleSelect.value = user.role;
                isEditing = true;
                editingUserId = userId;
                addUserButton.textContent = 'Save Changes';
            }
        });
    });
    userListTable.querySelectorAll('.delete-button').forEach(function (button) {
        button.addEventListener('click', function () {
            var buttonElement = button;
            var userId = parseInt(buttonElement.dataset.userId);
            userManager.deleteUser(userId);
            renderUserList();
        });
    });
}
function clearInputFields() {
    nameInput.value = '';
    emailInput.value = '';
    roleSelect.value = 'user';
}
renderUserList();
