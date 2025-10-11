// Listen for messages from the page context
window.addEventListener('message', (event) => {
  // Only accept messages from same origin
  if (event.source !== window) return;
  
  if (event.data.type === 'KLAVIYO_EVENT_CAPTURED') {
    const eventData = event.data.event;
    
    console.log('%c[Content Script] Saving event to storage', 'background: #9C27B0; color: white; padding: 2px 5px;', eventData);
    
    // Save to chrome storage
    chrome.storage.local.get(['klaviyoEvents'], (result) => {
      const existingEvents = result.klaviyoEvents || [];
      existingEvents.push(eventData);
      
      chrome.storage.local.set({ klaviyoEvents: existingEvents }, () => {
        console.log('%c[Content Script] Event saved! Total events:', 'background: #4CAF50; color: white; padding: 2px 5px;', existingEvents.length);
      });
    });
  }
});

console.log('%c[Content Script] Listening for Klaviyo events...', 'background: #2196F3; color: white; padding: 2px 5px;');