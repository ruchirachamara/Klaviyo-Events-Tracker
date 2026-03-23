(function() {
  'use strict';

  var DEBUG = false;

  function log(msg, style) {
    if (DEBUG) console.log('%c[Klaviyo Tracker] ' + msg, style || 'color: #ff6b00;');
  }

  // Create a custom push function that intercepts calls
  function createInterceptedPush(originalPush) {
    return function(...args) {
      args.forEach(eventData => {
        if (Array.isArray(eventData) && eventData.length >= 2) {
          var capturedEvent = {
            timestamp: new Date().toISOString(),
            type: eventData[0],
            eventName: eventData[1],
            params: eventData[2] || {},
            raw: JSON.parse(JSON.stringify(eventData))
          };

          log(capturedEvent.type + ': ' + capturedEvent.eventName);

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
  var klaviyoBackingArray = [];

  Object.defineProperty(window, 'klaviyo', {
    get() {
      return klaviyoBackingArray;
    },
    set(value) {
      if (Array.isArray(value)) {
        var originalPush = value.push.bind(value);
        value.push = createInterceptedPush(originalPush);
        klaviyoBackingArray = value;
        log('Interceptor attached', 'background: #4CAF50; color: white; padding: 2px 4px; border-radius: 2px;');
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
})();