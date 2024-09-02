document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const eventListKey = 'eventList'; // Key for local storage

    // Load existing events from local storage
    let eventList = JSON.parse(localStorage.getItem(eventListKey)) || [];

    // Check if editing an existing event
    const urlParams = new URLSearchParams(window.location.search);
    const editIndex = urlParams.get('edit');
    if (editIndex !== null) {
        const event = eventList[editIndex];
        document.getElementById('event-name').value = event.name;
        document.getElementById('event-date').value = event.date;
        document.getElementById('location').value = event.location;
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-status').value = event.status;
        document.getElementById('event-category').value = event.category;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedEvent = {
                name: document.getElementById('event-name').value,
                date: document.getElementById('event-date').value,
                location: document.getElementById('location').value,
                description: document.getElementById('event-description').value,
                status:document.getElementById('event-status').value,
                category: document.getElementById('event-category').value
            };

            eventList[editIndex] = updatedEvent;
            localStorage.setItem(eventListKey, JSON.stringify(eventList));
            alert('Event updated successfully!');
            window.location.href = 'event_dash.html'; // Redirect back to dashboard
        });
    } else {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newEvent = {
                name: document.getElementById('event-name').value,
                date: document.getElementById('event-date').value,
                location: document.getElementById('location').value,
                description: document.getElementById('event-description').value,
                status:document.getElementById('event-status').value,
                category: document.getElementById('event-category').value
            };

            eventList.push(newEvent);
            localStorage.setItem(eventListKey, JSON.stringify(eventList));
            form.reset();
            alert('Event saved successfully!');
            window.location.href = 'event_dash.html'; // Redirect back to dashboard
        });
    }
});
