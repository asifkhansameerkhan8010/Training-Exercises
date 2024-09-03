// Retrieve the logged-in user from local storage
const loggedInUser = localStorage.getItem('loggedInUser');
if (!loggedInUser) {
    alert('Please log in first.');
    window.location.href = 'login.html'; 
}

document.getElementById('username-display').innerText = `${loggedInUser}`;

// Load the events for the logged-in user
const userEventsKey = `events_${loggedInUser}`;
let userEvents = JSON.parse(localStorage.getItem(userEventsKey)) || [];

// Function to render events as cards on the dashboard
function renderEvents(events) {
    const eventsList = document.getElementById('events-list');
    eventsList.innerHTML = ''; 
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';

        // Card content
        eventCard.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <p><strong>Status:</strong> <span class="status ${event.status.toLowerCase()}">${event.status}</span></p>
            <button onclick="viewEventDetails(${event.id})">View Details</button>
            <button onclick="manageGuests(${event.id})">Manage Guests</button>
            <button onclick="editEvent(${event.id})">Edit Event</button>
            <button onclick="deleteEvent(${event.id})" style="background-color: red; color: white;">Delete</button>
        `;
        
        eventsList.appendChild(eventCard);
    });
}

// Function to delete an event
function deleteEvent(eventId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this event?')) {
        // Retrieve the logged-in user from local storage
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            alert('User not logged in');
            return;
        }
        
        const eventKey = `events_${loggedInUser}`;
        let userEvents = JSON.parse(localStorage.getItem(eventKey)) || [];
        userEvents = userEvents.filter(event => event.id !== eventId);
        localStorage.setItem(eventKey, JSON.stringify(userEvents));

        const specificEventKey = `event_${eventId}`;
        localStorage.removeItem(specificEventKey);

        const agendaKey = `agenda_${loggedInUser}_${eventId}`;
        localStorage.removeItem(agendaKey);

        const guestListKey = `guests_${loggedInUser}_${eventId}`;
        localStorage.removeItem(guestListKey);

        renderEvents(userEvents);
    }
}


// Function to filter events
function filterEvents() {
    const searchText = document.getElementById('search-bar').value.toLowerCase();
    const selectedDateFilter = document.getElementById('filter-date').value;
    const selectedCategoryFilter = document.getElementById('filter-category').value;
    const selectedStatusFilter = document.getElementById('filter-status').value;

    let filteredEvents = userEvents;

    // Apply search filter
    if (searchText) {
        filteredEvents = filteredEvents.filter(event => event.name.toLowerCase().includes(searchText));
    }

    // Apply date filter
    if (selectedDateFilter) {
        const today = new Date();
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            if (selectedDateFilter === 'today') {
                return eventDate.toDateString() === today.toDateString();
            } else if (selectedDateFilter === 'week') {
                const startOfWeek = today.getDate() - today.getDay();
                const endOfWeek = startOfWeek + 6;
                const startOfWeekDate = new Date(today.setDate(startOfWeek));
                const endOfWeekDate = new Date(today.setDate(endOfWeek));
                return eventDate >= startOfWeekDate && eventDate <= endOfWeekDate;
            } else if (selectedDateFilter === 'month') {
                return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
            }
            return true;
        });
    }

    // Apply category filter
    if (selectedCategoryFilter) {
        filteredEvents = filteredEvents.filter(event => event.category === selectedCategoryFilter);
    }

    // Apply status filter
    if (selectedStatusFilter) {
        filteredEvents = filteredEvents.filter(event => event.status === selectedStatusFilter);
    }

    renderEvents(filteredEvents);
}

// Initial rendering of events
renderEvents(userEvents);


document.getElementById('search-bar').addEventListener('input', filterEvents);


document.getElementById('filter-date').addEventListener('change', filterEvents);
document.getElementById('filter-category').addEventListener('change', filterEvents);
document.getElementById('filter-status').addEventListener('change', filterEvents);

// Logout functionality
document.getElementById('logout-button').addEventListener('click', function () {
    localStorage.removeItem('loggedInUser');
    alert('You have been logged out.');
    window.location.href = 'login.html'; 
});

// Function placeholders for event actions
function viewEventDetails(eventId) {
    showAgendaModal(eventId); 
}

function manageGuests(eventId) {
    window.location.href = `guest-management.html?eventId=${eventId}`;
}

function editEvent(eventId) {
    window.location.href = `addevent.html?eventId=${eventId}`;
}

// Function to display the agenda modal
function showAgendaModal(eventId) {
    const modal = document.getElementById('event-agenda-modal');
    const closeBtn = modal.querySelector('.close');
    const agendaItemsContainer = document.getElementById('agenda-items-container');
    
    
    agendaItemsContainer.innerHTML = '';

    // Fetch agenda data for the selected event
    const eventKey = `event_${eventId}`;
    const event = JSON.parse(localStorage.getItem(eventKey));
    
    if (event && event.agenda && event.agenda.length > 0) {
        // Display existing agenda items
        event.agenda.forEach(item => {
            const agendaItemDiv = document.createElement('div');
            agendaItemDiv.innerHTML = `
                <p><strong>Start Time:</strong> ${item.startTime}</p>
                <p><strong>End Time:</strong> ${item.endTime}</p>
                <p><strong>Description:</strong> ${item.description}</p>
            `;
            agendaItemsContainer.appendChild(agendaItemDiv);
        });
    } else {
        
        const noAgendaMessage = document.createElement('p');
        noAgendaMessage.textContent = 'No agenda items found. Please add a new agenda.';
        agendaItemsContainer.appendChild(noAgendaMessage);
    }

    
    modal.style.display = 'block';

    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}


