// Retrieve the logged-in user and event ID from local storage or URL parameters
const loggedInUser = localStorage.getItem('loggedInUser');
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('eventId');

if (!loggedInUser || !eventId) {
    alert('Invalid access. Please log in and select an event.');
    window.location.href = 'login.html'; // Redirect if no user or event ID
}

// Key to store guests for the specific event
const eventGuestsKey = `guests_${loggedInUser}_${eventId}`;

// Load existing guests for the event or initialize an empty array
let eventGuests = JSON.parse(localStorage.getItem(eventGuestsKey)) || [];

// Variables to handle editing state
let editingIndex = -1;

// Function to render the guest list
function renderGuests() {
    const guestListBody = document.getElementById('guest-list-body');
    guestListBody.innerHTML = ''; // Clear existing list

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

// Event listener for the add/update guest form submission
document.getElementById('add-guest-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect guest details from the form
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
        // Update existing guest
        eventGuests[editingIndex] = guestDetails;
        editingIndex = -1; // Reset editing index
    } else {
        // Add new guest
        eventGuests.push(guestDetails);
    }

    // Save the updated guest list back to local storage
    localStorage.setItem(eventGuestsKey, JSON.stringify(eventGuests));

    // Clear the form
    this.reset();
    document.querySelector('.add-button').textContent = 'Add Guest'; // Reset button text

    // Re-render the guest list
    renderGuests();

    alert('Guest saved successfully!');
});

// Function to remove a guest from the list
function removeGuest(index) {
    if (confirm('Are you sure you want to remove this guest?')) {
        eventGuests.splice(index, 1); // Remove the guest
        localStorage.setItem(eventGuestsKey, JSON.stringify(eventGuests)); // Update local storage
        renderGuests(); // Re-render the guest list
    }
}

// Function to edit a guest's details
function editGuest(index) {
    const guest = eventGuests[index];
    document.getElementById('guest-name').value = guest.name;
    document.getElementById('guest-email').value = guest.email;
    document.getElementById('guest-rsvp').value = guest.rsvp;
    editingIndex = index; // Set editing index

    // Change the button text to "Update Guest"
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


// Initial rendering of guests
renderGuests();
