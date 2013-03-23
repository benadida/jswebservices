// assume window.servicePort is there

// bounce a message back when it gets here
window.servicePort.on("toTestService", function(payload) {
  window.servicePort.emit("fromTestService", payload);
});

// when port is ready, just do it.
window.servicePort.onReady(function() {
  window.servicePort.emit("autonomousFromTestService", "oh yeah baby!");
});