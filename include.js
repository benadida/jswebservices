
var SOURCE = 'http://localhost:3000';

// set up the servicePort interface
window.servicePort = (function() {
  if (!window.parent) {
    console.log("jswebservice invoked without a parent window");
    return undefined;
  }

  // state
  var READY_P = false;

  var receiveMessage = function(message) {
    console.log("got message");
    console.log(message);
  };

  // get ready for messages
  window.addEventListener("message", function(event) {
    // ignore all messages from bad sources
    if (event.origin != SOURCE)
      return;

    if (!READY_P) {
      // until ready, don't do anything
      if (event.data.type != "jswebservice-client-ready")
        return

      READY_P = true;

      return;
    }

    receiveMessage(event.data);
  });

  // post the initial ack
  window.parent.postMessage({"type": "jswebservice-service-loaded"}, "*");

  return {
  };
})();