(function() {
  'use strict';

  console.log('%c[Klaviyo Monitor] Starting...', 'background: #4CAF50; color: white; padding: 2px 5px; border-radius: 2px;');

  // Store original descriptor
  let klaviyoArray = [];

  // Function to wrap push method
  function wrapPushMethod(arr) {
    if (arr.__klaviyoMonitored) return arr;
    
    const originalPush = arr.push;
    arr.push = function(...args) {
      // Capture the event BEFORE it's pushed
      args.forEach(eventData => {
        if (Array.isArray(eventData)) {
          const timestamp = new Date().toISOString();
          const type = eventData[0];
          const eventName = eventData[1];
          const params = eventData[2] || {};

          const capturedEvent = {
            timestamp,
            type,
            eventName,
            params,
            raw: eventData
          };

          console.log('%c[Klaviyo Event]', 'background: #ff6b00; color: white; padding: 2px 5px; border-radius: 2px;', capturedEvent);

          // Send to content script
          window.dispatchEvent(new CustomEvent('KLAVIYO_EVENT_CAPTURED', {
            detail: capturedEvent
          }));
        }
      });

      // Call original push
      return originalPush.apply(this, args);
    };
    
    arr.__klaviyoMonitored = true;
    return arr;
  }

  // Intercept window.klaviyo
  Object.defineProperty(window, 'klaviyo', {
    get() {
      return klaviyoArray;
    },
    set(value) {
      console.log('%c[Klaviyo Monitor] Klaviyo array set/reassigned', 'background: #2196F3; color: white; padding: 2px 5px; border-radius: 2px;');
      
      if (Array.isArray(value)) {
        klaviyoArray = wrapPushMethod(value);
      } else {
        klaviyoArray = value;
      }
      
      return true;
    },
    configurable: true,
    enumerable: true
  });

  // Initialize with empty array wrapped
  window.klaviyo = [];

  console.log('%c[Klaviyo Monitor] Initialized successfully!', 'background: #4CAF50; color: white; padding: 2px 5px; border-radius: 2px;');
})();