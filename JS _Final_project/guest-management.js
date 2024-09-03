// working
document.addEventListener('DOMContentLoaded', () => {
    const guestForm = document.getElementById('add-guest-form');
    const guestListBody = document.getElementById('guest-list-body');
    const guestList = JSON.parse(localStorage.getItem('guestList')) || [];
    const existingEmails = new Set(guestList.map(guest => guest.email));

    let guestIdCounter = guestList.length > 0 ? guestList[guestList.length - 1].id + 1 : 1;
    let isEditing = false;
    let editingGuestId = null;

    function renderGuestList() {
        guestListBody.innerHTML = ''; 
        guestList.forEach(guest => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${guest.name}</td>
                <td>${guest.email}</td>
                <td id="guest-${guest.id}">${guest.rsvp}</td>
                <td>
                    <butto class="edit-btn" data-id="${guest.id}">Edit</butto
                    
                    n>
                    <button class="delete-btn" data-id="${guest.id}">Delete</button>
                </td>
            `;
            guestListBody.appendChild(newRow);
        });
    }

    function generateUniqueId() {
        return guestIdCounter++;
    }

    function deleteGuest(id) {
        const guestToDelete = guestList.find(guest => guest.id === id);
        if (guestToDelete) {
            const updatedGuestList = guestList.filter(guest => guest.id !== id);
            localStorage.setItem('guestList', JSON.stringify(updatedGuestList));
            
            // Update in-memory guest list and existingEmails set
            guestList.length = 0; // Clear current guestList
            guestList.push(...updatedGuestList);
            existingEmails.delete(guestToDelete.email);

            renderGuestList();
        }
    }

    function editGuest(id) {
        const guestToEdit = guestList.find(guest => guest.id === id);
        if (guestToEdit) {
            document.getElementById('guest-name').value = guestToEdit.name;
            document.getElementById('guest-email').value = guestToEdit.email;
            editingGuestId = id;
            isEditing = true;
            document.querySelector('.add-button').textContent = 'Update Guest';
        }
    }

    guestForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const guestName = document.getElementById('guest-name').value.trim();
        const guestEmail = document.getElementById('guest-email').value.trim();

        if (!guestName || !guestEmail) {
            alert('Please fill in both name and email fields.');
            return;
        }

        if (isEditing) {
            const guestToUpdate = guestList.find(guest => guest.id === editingGuestId);

            if (guestToUpdate && guestToUpdate.email !== guestEmail && existingEmails.has(guestEmail)) {
                alert('This email is already added. Please use a different email.');
                return;
            }

            guestToUpdate.name = guestName;
            guestToUpdate.email = guestEmail;
            localStorage.setItem('guestList', JSON.stringify(guestList));
            isEditing = false;
            editingGuestId = null;
            document.querySelector('.add-button').textContent = 'Add Guest';
        } else {
            if (existingEmails.has(guestEmail)) {
                alert('This email is already added. Please use a different email.');
                return;
            }

            const uniqueId = generateUniqueId();
            const newGuest = {
                id: uniqueId,
                name: guestName,
                email: guestEmail,
                rsvp: 'Pending'
            };

            guestList.push(newGuest);
            localStorage.setItem('guestList', JSON.stringify(guestList));
            existingEmails.add(guestEmail);
        }

        renderGuestList();
        guestForm.reset();
    });

    guestListBody.addEventListener('click', (event) => {
        const guestId = parseInt(event.target.getAttribute('data-id'), 10);
        if (event.target.classList.contains('delete-btn')) {
            deleteGuest(guestId);
        } else if (event.target.classList.contains('edit-btn')) {
            editGuest(guestId);
        }
    });

    const sendInvitesButton = document.querySelector('.send-invites-button');
    sendInvitesButton.addEventListener('click', () => {
        alert('Invitations sent to all guests!');
    });

    renderGuestList();
});



















