(function() {
  'use strict';

  // Create a custom push function that intercepts calls
  function createInterceptedPush(originalPush) {
    return function(...args) {
      console.log('%c[Klaviyo Monitor] Push called', 'background: #2196F3; color: white; padding: 2px 5px;');
      
      args.forEach(eventData => {
        if (Array.isArray(eventData) && eventData.length >= 2) {
          const timestamp = new Date().toISOString();
          const type = eventData[0];
          const eventName = eventData[1];
          const params = eventData[2] || {};

          const capturedEvent = {
            timestamp,
            type,
            eventName,
            params,
            raw: JSON.parse(JSON.stringify(eventData))
          };

          console.group('%c KLAVIYO EVENT DETECTED', 'background: #ff6b00; color: white; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 3px;');
          console.log('Type:', type);
          console.log('Event Name:', eventName);
          console.log('Parameters:', params);
          console.groupEnd();

          // Send to content script via postMessage
          window.postMessage({
            type: 'KLAVIYO_EVENT_CAPTURED',
            event: capturedEvent
          }, '*');
        }
      });

      // Call original push
      return originalPush.apply(this, args);
    };
  }

  // Intercept via Object.defineProperty
  let klaviyoBackingArray = [];

  Object.defineProperty(window, 'klaviyo', {
    get() {
      return klaviyoBackingArray;
    },
    set(value) {
      console.log('%c[Klaviyo Monitor] klaviyo setter called', 'background: #FF9800; color: white; padding: 2px 5px;');
      
      if (Array.isArray(value)) {
        const originalPush = value.push.bind(value);
        value.push = createInterceptedPush(originalPush);
        klaviyoBackingArray = value;
        
        console.log('%c[Klaviyo Monitor] Klaviyo intercepted!', 'background: #4CAF50; color: white; font-weight: bold; padding: 4px 8px; border-radius: 3px;');
      } else {
        klaviyoBackingArray = value;
      }
      
      return true;
    },
    configurable: true,
    enumerable: true
  });

  // Initialize
  window.klaviyo = [];

  console.log('%c[Klaviyo Monitor] Ready!', 'background: #4CAF50; color: white; font-weight: bold; padding: 4px 8px; border-radius: 3px;');

  // Test function
  window.__testKlaviyoMonitor = function() {
    console.log('%c[Test] Triggering test event...', 'background: #673AB7; color: white; padding: 2px 5px;');
    window.klaviyo.push(['track', 'Test Event', { test: true, timestamp: Date.now() }]);
  };
})();