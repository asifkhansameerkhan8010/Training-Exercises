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
addUserButton.addEventListener('click', function () {
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var role = roleSelect.value;
    var fillerr = document.getElementById("fillerr");
    var emailerr = document.getElementById("emailerr");
    if (name && email) {
        fillerr.style.display = "none";
        if (userManager.isEmailDuplicate(email)) {
            emailerr.style.display = "block";
            return;
        }
        emailerr.style.display = "none";
        userManager.addUser(name, email, role);
        renderUserList();
        nameInput.value = '';
        emailInput.value = '';
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
        row.innerHTML = "\n            <td>".concat(rowNumber, ". ").concat(user.name, "</td>\n            <td>").concat(user.email, "</td>\n            <td>\n                <input type=\"text\" value=\"").concat(user.role, "\" class=\"role-input\" data-user-id=\"").concat(user.id, "\" style=\"display: none;\" />\n                <span class=\"role-span\">").concat(user.role, "</span>\n            </td>\n            <td>\n                <button class=\"edit-button\" data-user-id=\"").concat(user.id, "\">Edit</button>\n                <button class=\"save-button\" data-user-id=\"").concat(user.id, "\" style=\"display: none;\">Save</button>\n                <button class=\"delete-button\" data-user-id=\"").concat(user.id, "\">Delete</button>\n            </td>\n        ");
        userListTable.appendChild(row);
    });
    addEventListeners();
}
function addEventListeners() {
    userListTable.querySelectorAll('.edit-button').forEach(function (button) {
        button.addEventListener('click', function () {
            var buttonElement = button;
            var userId = parseInt(buttonElement.dataset.userId);
            var row = buttonElement.closest('tr');
            var roleInput = row.querySelector('.role-input');
            var roleSpan = row.querySelector('.role-span');
            var saveButton = row.querySelector('.save-button');
            roleSpan.style.display = 'none';
            roleInput.style.display = 'inline';
            saveButton.style.display = 'inline';
            buttonElement.style.display = 'none';
        });
    });
    userListTable.querySelectorAll('.save-button').forEach(function (button) {
        button.addEventListener('click', function () {
            var buttonElement = button;
            var userId = parseInt(buttonElement.dataset.userId);
            var row = buttonElement.closest('tr');
            var roleInput = row.querySelector('.role-input');
            var roleerr = document.getElementById("roleerr");
            var newRole = roleInput.value.trim();
            if (newRole === 'admin' || newRole === 'user') {
                userManager.updateUser(userId, 'role', newRole);
                roleerr.style.display = "none";
                renderUserList();
            }
            else {
                roleerr.style.display = "block";
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
renderUserList();
