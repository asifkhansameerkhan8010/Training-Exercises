// Retrieve the logged-in user and event ID from local storage or URL parameters
const loggedInUser = localStorage.getItem('loggedInUser');
const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams);
const eventId = urlParams.get('eventId');
console.log(eventId);

if (!loggedInUser || !eventId) {
    alert('Invalid access. Please log in and select an event.');
    window.location.href = 'login.html'; 
}


const eventGuestsKey = `guests_${loggedInUser}_${eventId}`;


let eventGuests = JSON.parse(localStorage.getItem(eventGuestsKey)) || [];


let editingIndex = -1;


function renderGuests() {
    const guestListBody = document.getElementById('guest-list-body');
    guestListBody.innerHTML = ''; 

    eventGuests.forEach((guest, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guest.name}</td>
            <td>${guest.email}</td>
            <td>${guest.rsvp}</td>
            <td>
                <button id="edit" onclick="editGuest(${index})">Edit</button>
                <button id="remove" onclick="removeGuest(${index})">Remove</button>
            </td>
        `;
        guestListBody.appendChild(row);
    });
}


document.getElementById('add-guest-form').addEventListener('submit', function (event) {
    event.preventDefault(); 

    const guestName = document.getElementById('guest-name').value;
    const guestEmail = document.getElementById('guest-email').value;
    const guestRSVP = document.getElementById('guest-rsvp').value;

    // Check for email uniqueness
    if (eventGuests.some(guest => guest.email === guestEmail && editingIndex === -1)) {
        alert('This email is already in use. Please use a different email.');
        return;
    }

    // Create or update guest object
    const guestDetails = {
        name: guestName,
        email: guestEmail,
        rsvp: guestRSVP
    };

    if (editingIndex > -1) {
        eventGuests[editingIndex] = guestDetails;
        editingIndex = -1; 
    } else {
        eventGuests.push(guestDetails);
    }

    // Save the updated guest list back to local storage
    localStorage.setItem(eventGuestsKey, JSON.stringify(eventGuests));
    this.reset();
    document.querySelector('.add-button').textContent = 'Add Guest'; 
    renderGuests();

    alert('Guest saved successfully!');
});

// Function to remove a guest from the list
function removeGuest(index) {
    if (confirm('Are you sure you want to remove this guest?')) {
        eventGuests.splice(index, 1);
        localStorage.setItem(eventGuestsKey, JSON.stringify(eventGuests)); 
        renderGuests(); 
    }
}

// Function to edit a guest's details
function editGuest(index) {
    const guest = eventGuests[index];
    document.getElementById('guest-name').value = guest.name;
    document.getElementById('guest-email').value = guest.email;
    document.getElementById('guest-rsvp').value = guest.rsvp;
    editingIndex = index; 
    document.querySelector('.add-button').textContent = 'Update Guest';
}

// Send invitations function
document.querySelector('.send-invites-button').addEventListener('click', function () {
    // Initialize EmailJS with your user ID
    emailjs.init('YOUR_EMAILJS_USER_ID');

    // Loop through each guest and send an email
    eventGuests.forEach(guest => { // Ensure 'guest' is defined within the loop
        const templateParams = {
            to_email: guest.email,       // Guest's email
            to_name: guest.name,         // Guest's name
            from_name: loggedInUser,     // Sender's name (logged-in user)
            eventId: eventId,            // Event ID
            rsvp: guest.rsvp             // RSVP status of the guest
        };

        emailjs.send('service_d4y6ekl', 'template_t8tmhso', templateParams)
            .then(response => {
                console.log('Invitation sent:', response);
            })
            .catch(error => {
                console.error('Error sending invitation:', error);
            });
    });

    alert('Invitations sent successfully!');
});

renderGuests();
