// Ensure the user is logged in
const loggedInUser = localStorage.getItem('loggedInUser');
if (!loggedInUser) {
    alert('You must be logged in to add or edit events.');
    window.location.href = 'login.html'; 
}

// Load existing events for the logged-in user or initialize an empty array
const userEventsKey = `events_${loggedInUser}`;
let userEvents = JSON.parse(localStorage.getItem(userEventsKey)) || [];


function populateForm(eventId) {
    const event = userEvents.find(event => event.id === eventId);
    if (event) {
        const nameInput = document.getElementById('event-name');
        const dateInput = document.getElementById('event-date');
        const locationInput = document.getElementById('location');
        const descriptionInput = document.getElementById('event-description');
        const statusInput = document.getElementById('event-status');
        const categoryInput = document.getElementById('event-category');
        const submitButton = document.getElementById('submit-button');

        if (nameInput) nameInput.value = event.name || '';
        if (dateInput) dateInput.value = event.date || '';
        if (locationInput) locationInput.value = event.location || '';
        if (descriptionInput) descriptionInput.value = event.description || '';
        if (statusInput) statusInput.value = event.status || '';
        if (categoryInput) categoryInput.value = event.category || '';
        if (submitButton) submitButton.innerText = 'Update Event';
    } else {
        console.error('Event not found');
    }
}

// Check if we are editing an event
const urlParams = new URLSearchParams(window.location.search);
const eventId = parseInt(urlParams.get('eventId'), 10);

if (eventId) {
    populateForm(eventId);
}

// Event listener for the event form submission
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('event-description').value;
    const status = document.getElementById('event-status').value;
    const category = document.getElementById('event-category').value;

    // Create a new event object or update the existing one
    const newEvent = {
        id: eventId || Date.now(), // Use existing ID if editing, else generate new
        name: eventName,
        date: eventDate,
        location: location,
        description: description,
        status: status,
        category: category,
        guests: [] 
    };

    if (eventId) {
        const index = userEvents.findIndex(event => event.id === eventId);
        if (index !== -1) {
            userEvents[index] = newEvent;
        }
    } else {
        userEvents.push(newEvent);
    }

    // Save the updated events array back to local storage
    localStorage.setItem(userEventsKey, JSON.stringify(userEvents));

    this.reset();

    alert('Event saved successfully!');
    window.location.href = 'dashboard.html'; 
});
