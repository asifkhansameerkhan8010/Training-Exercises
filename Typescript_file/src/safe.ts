interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

class UserManager {
    private users: User[] = [];
    private idCounter: number = 1;

    public addUser(name: string, email: string, role: 'admin' | 'user'): void {
        if (this.isEmailDuplicate(email)) {
            console.error('Email already exists');
            return; 
        }

        const newUser: User = {
            id: this.idCounter++,
            name,
            email,
            role,
        };
        this.users.push(newUser);
    }

    public isEmailDuplicate(email: string): boolean {
        return this.users.some(user => user.email === email);
    }

    public findUserBy<T extends keyof User>(property: T, value: User[T]): User | undefined {
        return this.users.find(user => user[property] === value);
    }

    public updateUser<T extends keyof User>(userId: number, property: T, value: User[T]): void {
        const user = this.findUserBy('id', userId);
        if (user) {
            user[property] = value;
        } else {
            console.error('User not found');
        }
    }

    public deleteUser(userId: number): void {
        this.users = this.users.filter(user => user.id !== userId);
    }

    public getUsers(): User[] {
        return this.users;
    }
}



const userManager = new UserManager();
const nameInput = document.getElementById('name') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const roleSelect = document.getElementById('role') as HTMLSelectElement;
const addUserButton = document.querySelector('.add-user-button') as HTMLButtonElement;
const userListTable = document.querySelector('.user-list tbody') as HTMLTableSectionElement;

addUserButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleSelect.value as 'admin' | 'user';
    let fillerr=document.getElementById("fillerr") as HTMLParagraphElement;
    let emailerr=document.getElementById("emailerr") as HTMLParagraphElement;
    if (name && email) {
        fillerr.style.display="none";
        if (userManager.isEmailDuplicate(email)) {
            emailerr.style.display="block";
            return; 
        }
        emailerr.style.display="none";
        userManager.addUser(name, email, role);
        renderUserList();
        nameInput.value = '';
        emailInput.value = '';
    } else {
        fillerr.style.display="block";
    }
});

function renderUserList() {
    userListTable.innerHTML = ''; 

    userManager.getUsers().forEach((user, index) => {
        const rowNumber = index + 1;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rowNumber}. ${user.name}</td>
            <td>${user.email}</td>
            <td>
                <input type="text" value="${user.role}" class="role-input" data-user-id="${user.id}" style="display: none;" />
                <span class="role-span">${user.role}</span>
            </td>
            <td>
                <button class="edit-button" data-user-id="${user.id}">Edit</button>
                <button class="save-button" data-user-id="${user.id}" style="display: none;">Save</button>
                <button class="delete-button" data-user-id="${user.id}">Delete</button>
            </td>
        `;
        userListTable.appendChild(row);
    });

    addEventListeners();
}

function addEventListeners() {
    userListTable.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', () => {
            const buttonElement = button as HTMLButtonElement;
            const userId = parseInt(buttonElement.dataset.userId!);
            const row = buttonElement.closest('tr') as HTMLTableRowElement;
            const roleInput = row.querySelector('.role-input') as HTMLInputElement;
            const roleSpan = row.querySelector('.role-span') as HTMLSpanElement;
            const saveButton = row.querySelector('.save-button') as HTMLButtonElement;

            roleSpan.style.display = 'none';
            roleInput.style.display = 'inline';
            saveButton.style.display = 'inline';
            buttonElement.style.display = 'none';
        });
    });

    userListTable.querySelectorAll('.save-button').forEach(button => {
        button.addEventListener('click', () => {
            const buttonElement = button as HTMLButtonElement;
            const userId = parseInt(buttonElement.dataset.userId!);
            const row = buttonElement.closest('tr') as HTMLTableRowElement;
            const roleInput = row.querySelector('.role-input') as HTMLInputElement;
            const roleerr=document.getElementById("roleerr") as HTMLParagraphElement;
            const newRole = roleInput.value.trim();
            if (newRole === 'admin' || newRole === 'user') {
                userManager.updateUser(userId, 'role', newRole);
                roleerr.style.display="none";
                renderUserList();
            } else {
                roleerr.style.display="block";
            }
        });
    });

    userListTable.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
            const buttonElement = button as HTMLButtonElement;
            const userId = parseInt(buttonElement.dataset.userId!);
            userManager.deleteUser(userId);
            renderUserList();
        });
    });
}

renderUserList();
