function log(stuff) {
  console.log(stuff);
}

function doit() {
  JSWebService.instantiate("http://localhost:3000/test_service.html", function(servicePort) {
    console.log("ready to go with serviceport!");
    servicePort.on("fromTestService", function(payload) {
      log("got bounce back " + payload);
    });

    servicePort.on("autonomousFromTestService", function(payload) {
      log("got autonomous ping from test service " + payload);
    });

    servicePort.emit("toTestService", "foobar-baz");
  });
}


$(document).ready(doit);

