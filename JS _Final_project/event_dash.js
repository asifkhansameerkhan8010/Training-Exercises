document.addEventListener('DOMContentLoaded', () => {
    const eventCardsContainer = document.querySelector('.events-list');
    const modal = document.getElementById('event-agenda-modal');
    const closeModal = document.querySelector('.modal .close');
    const addAgendaItemButton = document.getElementById('add-agenda-item');
    const agendaItemsContainer = document.getElementById('agenda-items-container');
    const searchBar = document.querySelector('.search-bar');
    const filterDate = document.querySelector('.filter-date');
    const filterCategory = document.querySelector('.filter-category');
    const filterStatus = document.querySelector('.filter-status');
    const agendaForm = document.getElementById('agenda-form');
    const agendaFormFields = {
        startTime: document.getElementById('agenda-start-time'),
        endTime: document.getElementById('agenda-end-time'),
        description: document.getElementById('agenda-description')
    };

    let currentEventId = null;
    let agendaItems = JSON.parse(localStorage.getItem('agendaItems')) || {};
    let events = JSON.parse(localStorage.getItem('eventList')) || [];

    function createEventCard(event, index) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.dataset.eventId = index;

        const status = event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Unknown';

        card.innerHTML = 
            `<h3>${event.name}</h3>
            <p>Date & Time: <span>${new Date(event.date).toLocaleString()}</span></p>
            <p>Description: ${event.description}</p>
            <div class="event-status ${event.status || 'unknown'}">${status}</div>
            <div class="event-actions">
                <button class="action-button" onclick="viewDetails(${index})">View Details</button>
                <button class="action-button" onclick="manageGuests(${index})">Manage Guests</button>
                <button class="action-button" onclick="editEvent(${index})">Edit Event</button>
                <button class="delete-button" onclick="deleteEvent(${index})">Delete</button>
            </div>`;

        eventCardsContainer.appendChild(card);
    }

    function renderEventCards(filteredEvents = events) {
        eventCardsContainer.innerHTML = ''; // Clear existing cards
        filteredEvents.forEach(createEventCard);
    }

    function showModal() {
        modal.style.display = 'block';
    }

    function closeModalFunction() {
        modal.style.display = 'none';
    }

    closeModal.addEventListener('click', closeModalFunction);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModalFunction();
        }
    });

    // Show agenda items or form based on availability
    function displayAgendaOrForm() {
        agendaItemsContainer.innerHTML = '';
        if (agendaItems[currentEventId] && agendaItems[currentEventId].length > 0) {
            agendaItems[currentEventId].forEach((item, index) => {
                const agendaItem = document.createElement('div');
                agendaItem.className = 'agenda-item';
                agendaItem.innerHTML = 
                    `<p><strong>${item.startTime} - ${item.endTime}:</strong> ${item.description}</p>
                    <button onclick="editAgendaItem(${index})">Edit</button>
                    <button onclick="deleteAgendaItem(${index})">Delete</button>`;
                agendaItemsContainer.appendChild(agendaItem);
            });
            addAgendaItemButton.textContent = 'Add New Agenda Item';
            addAgendaItemButton.onclick = () => {
                showAgendaForm();
            };
        } else {
            showAgendaForm();
        }
    }

    function showAgendaForm() {
        agendaForm.reset();
        addAgendaItemButton.textContent = 'Add Agenda Item';
        addAgendaItemButton.onclick = () => {
            addAgendaItem();
        };
    }

    function addAgendaItem() {
        const startTime = agendaFormFields.startTime.value;
        const endTime = agendaFormFields.endTime.value;
        const description = agendaFormFields.description.value;

        if (startTime && endTime && description) {
            if (!agendaItems[currentEventId]) {
                agendaItems[currentEventId] = [];
            }
            agendaItems[currentEventId].push({ startTime, endTime, description });
            localStorage.setItem('agendaItems', JSON.stringify(agendaItems));
            displayAgendaOrForm();
        } else {
            alert('Please fill in all fields.');
        }
    }

    window.editAgendaItem = (index) => {
        const item = agendaItems[currentEventId][index];
        agendaFormFields.startTime.value = item.startTime;
        agendaFormFields.endTime.value = item.endTime;
        agendaFormFields.description.value = item.description;
        
        addAgendaItemButton.textContent = 'Update Agenda Item';
        addAgendaItemButton.onclick = () => {
            updateAgendaItem(index);
        };
    };

    function updateAgendaItem(index) {
        const startTime = agendaFormFields.startTime.value;
        const endTime = agendaFormFields.endTime.value;
        const description = agendaFormFields.description.value;

        if (startTime && endTime && description) {
            agendaItems[currentEventId][index] = { startTime, endTime, description };
            localStorage.setItem('agendaItems', JSON.stringify(agendaItems));
            displayAgendaOrForm();
        } else {
            alert('Please fill in all fields.');
        }
    }

    window.deleteAgendaItem = (index) => {
        if (agendaItems[currentEventId]) {
            agendaItems[currentEventId].splice(index, 1);
            localStorage.setItem('agendaItems', JSON.stringify(agendaItems));
            displayAgendaOrForm();
        }
    };

    window.viewDetails = (index) => {
        currentEventId = index;
        displayAgendaOrForm();
        showModal();
    };

    window.manageGuests = (index) => {
        alert(`Manage guests for event: ${events[index].name}`);
    };

    window.editEvent = (index) => {
        const event = events[index];
        // Redirect to addevent.html with event details in URL params
        window.location.href = `addevent.html?edit=${index}`;
    };

    // Filter and Search Functionality
    function filterAndSearchEvents() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedDate = filterDate.value;
        const selectedCategory = filterCategory.value;
        const selectedStatus = filterStatus.value;

        const filteredEvents = events.filter(event => {
            const matchesSearch = event.name.toLowerCase().includes(searchTerm) || 
                                  event.description.toLowerCase().includes(searchTerm);

            const matchesDate = selectedDate === '' || 
                                (selectedDate === 'today' && isToday(event.date)) ||
                                (selectedDate === 'week' && isThisWeek(event.date)) ||
                                (selectedDate === 'month' && isThisMonth(event.date));

            const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
            const matchesStatus = selectedStatus === '' || event.status === selectedStatus;

            return matchesSearch && matchesDate && matchesCategory && matchesStatus;
        });

        renderEventCards(filteredEvents);
    }

    // Utility functions to check dates
    function isToday(date) {
        const today = new Date();
        const eventDate = new Date(date);
        return eventDate.toDateString() === today.toDateString();
    }

    function isThisWeek(date) {
        const today = new Date();
        const eventDate = new Date(date);
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }

    function isThisMonth(date) {
        const today = new Date();
        const eventDate = new Date(date);
        return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
    }

    // Event Listeners for Search and Filter
    searchBar.addEventListener('input', filterAndSearchEvents);
    filterDate.addEventListener('change', filterAndSearchEvents);
    filterCategory.addEventListener('change', filterAndSearchEvents);
    filterStatus.addEventListener('change', filterAndSearchEvents);

    // Delete Event Functionality
    window.deleteEvent = (index) => {
        if (confirm('Are you sure you want to delete this event?')) {
            events.splice(index, 1);
            localStorage.setItem('eventList', JSON.stringify(events));
            renderEventCards();
        }
    };

    // Initialize event cards
    renderEventCards();
});

