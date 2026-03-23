// Listen for messages from the page context (interceptor.js -> content.js)
window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type === 'KLAVIYO_EVENT_CAPTURED') {
    chrome.storage.local.get(['klaviyoEvents'], (result) => {
      const existingEvents = result.klaviyoEvents || [];
      existingEvents.push(event.data.event);
      chrome.storage.local.set({ klaviyoEvents: existingEvents });
    });
  }
});