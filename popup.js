let expandedEvents = new Set();

function toggleEvent(eventId) {
  const eventElement = document.getElementById(eventId);
  if (!eventElement) return;
  
  if (expandedEvents.has(eventId)) {
    expandedEvents.delete(eventId);
    eventElement.classList.remove('expanded');
  } else {
    expandedEvents.add(eventId);
    eventElement.classList.add('expanded');
  }
}

function expandAll() {
  const allEvents = document.querySelectorAll('.event');
  allEvents.forEach(event => {
    expandedEvents.add(event.id);
    event.classList.add('expanded');
  });
}

function collapseAll() {
  const allEvents = document.querySelectorAll('.event');
  allEvents.forEach(event => {
    expandedEvents.delete(event.id);
    event.classList.remove('expanded');
  });
}

function displayEvents() {
  chrome.storage.local.get(['klaviyoEvents'], (result) => {
    const events = result.klaviyoEvents || [];
    const container = document.getElementById('events');
    const countEl = document.getElementById('count');
    const statusEl = document.getElementById('status');
    
    countEl.textContent = `${events.length} event${events.length !== 1 ? 's' : ''}`;
    
    if (events.length === 0) {
      container.innerHTML = `
        <div class="no-events">
          No events captured yet
          <br><br>
          <small>
            <strong>Events will appear here as they are triggered</strong><br><br>
            Check the console for debug messages<br>
            Test with: <code>window.__testKlaviyoMonitor()</code>
          </small>
        </div>
      `;
      statusEl.textContent = 'Waiting for events... (auto-refreshing)';
      return;
    }

    statusEl.textContent = `Last updated: ${new Date().toLocaleTimeString()} (auto-refreshing)`;

    container.innerHTML = events.slice().reverse().map((event, index) => {
      const eventLabel = event.type === 'identify' ? 'User Identification' : event.eventName;
      const typeClass = event.type === 'identify' ? 'identify' : '';
      const eventId = `event-${events.length - index}`;
      const isExpanded = expandedEvents.has(eventId);
      
      return `
        <div class="event ${isExpanded ? 'expanded' : ''}" id="${eventId}">
          <div class="event-header" data-event-id="${eventId}">
            <div class="event-header-left">
              <span class="accordion-icon">▼</span>
              <span class="event-type ${typeClass}">${event.type}</span>
              <span>${eventLabel}</span>
            </div>
            <div class="event-header-right">
              <span class="event-number">#${events.length - index}</span>
            </div>
          </div>
          <div class="event-content">
            <div class="event-details">
              <div class="event-detail-row">
                <strong>Time:</strong> ${new Date(event.timestamp).toLocaleString()}
              </div>
              ${event.params && Object.keys(event.params).length > 0 ? `
                <div class="event-detail-row"><strong>Parameters:</strong></div>
                <pre>${JSON.stringify(event.params, null, 2)}</pre>
              ` : '<div class="event-detail-row"><em>No parameters</em></div>'}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers to headers
    document.querySelectorAll('.event-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const eventId = e.currentTarget.getAttribute('data-event-id');
        toggleEvent(eventId);
      });
    });
  });
}

document.getElementById('clear').addEventListener('click', () => {
  if (confirm('Clear all captured events?')) {
    chrome.storage.local.set({ klaviyoEvents: [] }, () => {
      expandedEvents.clear();
      displayEvents();
      alert('All events cleared!');
    });
  }
});

document.getElementById('refresh').addEventListener('click', () => displayEvents());

document.getElementById('expandAll').addEventListener('click', () => expandAll());

document.getElementById('collapseAll').addEventListener('click', () => collapseAll());

// Initial load and auto-refresh every 2 seconds
displayEvents();
setInterval(displayEvents, 2000);