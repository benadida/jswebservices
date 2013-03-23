
var SOURCE = 'http://localhost:3000';

// set up the servicePort interface
window.servicePort = (function() {
  if (!window.parent) {
    console.log("jswebservice invoked without a parent window");
    return undefined;
  }

  // state
  var READY_P = false;
  var ONREADY_CB = null;

  // on ready
  var onReady = function onReady(cb) {
    ONREADY_CB = cb;
  };

  var callbacks = {};
  var on = function on(message, cb) {
    callbacks[message] = cb;
  };

  var receiveMessage = function(completeMessage) {
    var cb = callbacks[completeMessage.type];
    if (cb)
      cb(completeMessage.payload);
  };

  var emit = function(message, payload) {
    var completeMessage = {type: message, payload: payload};
    window.parent.postMessage(completeMessage, SOURCE);
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

      if (ONREADY_CB)
        ONREADY_CB();

      return;
    }

    receiveMessage(event.data);
  });

  // post the initial ack
  window.parent.postMessage({"type": "jswebservice-service-loaded"}, SOURCE);

  return {
    on: on,
    emit: emit,
    onReady: onReady
  };
})();