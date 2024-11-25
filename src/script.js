// Get today's date
const today = new Date();

// Utility function to format date as "Day, DD MMM"
function formatDate(date) {
  const options = { weekday: 'short', day: '2-digit', month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

// Calculate dates for events
const events = [
  { title: "Today", date: formatDate(today) },
  { title: "Tomorrow", date: formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000)) },
  { title: "Weekend", date: `${formatDate(new Date(today.getTime() + (6 - today.getDay()) * 24 * 60 * 60 * 1000))} – ${formatDate(new Date(today.getTime() + (7 - today.getDay()) * 24 * 60 * 60 * 1000))}` }
];

// Populate events
const newEventsContainer = document.getElementById("new-events-container");

events.forEach(event => {
  const newEventCard = document.createElement("div");
  newEventCard.className = "new-event-card";

  newEventCard.innerHTML = `
    <h3>${event.title}</h3>
    <p class="new-date">${event.date}</p>
  `;

  newEventsContainer.appendChild(newEventCard);
});


const eventsGrid = document.getElementById('events-grid');
    const event = JSON.parse(localStorage.getItem('events')) || [];

    // Populate events
    function loadEvents() {
      eventsGrid.innerHTML = ''; // Clear existing cards
      event.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';

        eventCard.innerHTML = `
          <div class="event-tag">${event.eventType}</div>
          <img src="default-event.jpg" alt="${event.eventName}">
          <div class="event-info">
            <h3>${event.eventName}</h3>
            <p><span>${event.eventDate}</span> | <span>${event.eventTime}</span></p>
            <p>${event.eventMode}</p>
            <button>BUY NOW</button>
          </div>
        `;
        eventsGrid.appendChild(eventCard);
      });
      
   // Add event listeners to delete buttons (only for admins)
   if (userType === 'admin') {
    document.querySelectorAll('.delete-event').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        deleteEvent(index);
      });
    });
  }

    }

    // Load events when the page loads
    window.onload = loadEvents;

    const signInButton = document.querySelector('.sign-in');
    const userType = localStorage.getItem('userType');
  
    if (userType) {
      signInButton.textContent = 'Sign Out';
      signInButton.addEventListener('click', () => {
        localStorage.removeItem('userType');
        alert('You have been signed out.');
        window.location.reload();
      });
    } else {
      signInButton.addEventListener('click', () => {
        window.location.href = 'login.html';
      });
    }


// Function to delete an event
// Delete event
function deleteEvent(index) {
    if (confirm('Are you sure you want to delete this event?')) {
      event.splice(index, 1); // Remove event from array
      localStorage.setItem('events', JSON.stringify(event)); // Update localStorage
      loadEvents(); // Reload the events
      alert('Event deleted successfully!');
    }
  }
  
  // Load events when the page loads
  window.onload = loadEvents;
  