# JS Web Services

What if web services were exposed as a `MessageChannel` interface
between the client and an ambassador HTML/JS frame loaded from the
service?  The client must then be a full web runtime. That's okay,
since in many cases the client is actually a web browser, or easily
has access to a web runtime (iOS, Android, Firefox OS.)

A service advertises a set of ambassador frames, say at `/.well-known/jswebservices:

```json
{
  "bookmarks": "/services/bookmarks",
  "contacts": "/services/contacts",
}
```

A single service, say `/services/contacts`, is an HTML+JS page, with
access to a special variable, `window.servicePort`:

```html
<head><title>Contacts Service</title>
<script>
window.servicePort.on("message1", function(payload) {
  // receive messages
});

// the servicePort is not immediately ready for action
window.servicePort.onReady(function() {
  // send messages
  window.servicePort.emit("message2", {"foo": "bar"});
});
</script>
</head>
<body></body>
```

### Why not just JS?

Access to DOM, cookies, localStorage, makes for easier,
well-understood client state management. Also, HTML+JS lets us shim,
which makes developing against these APIs dramatically easier. The
following could run in any modern web browser:

```html
<head><title>Contacts Service</title>

// shims window.servicePort
<script src="https://jswebservic.es/include.js"></script>

<script>
window.servicePort.on("message1", function(payload) {
  // receive messages
});

// the servicePort is not immediately ready for action
window.servicePort.onReady(function() {
  // are we shimmed and have utilities?
  // let's run some tests
  if (window.servicePort.utils) {
      window.servicePort.utils.runTestSuite('contacts');
  }
});
</script>
</head>
<body></body>
```

## A Specific Use Case: Firefox and a Contacts Service

Firefox has a local contacts database, accessible to apps via the
Contact WebAPI. But where are those contacts stored? A Contact JS Web
Service is the backend provider of this contacts data.

Firefox's internal code looks like:

```js
JSWebService.instantiate("https://mycontacts.example.com/services/contacts", function(servicePort) {
  servicePort.on("updateContacts", function(contacts) {
    // received contacts, new, or updated,
    // store them locally
    //
    // each contact includes a service-unique-ID.
  });

  servicePort.on("deleteContact", ...);

  // presence!
  servicePort.on("contactOnline", ...);
  servicePort.on("contactOffline", ...);

  // fetch all contacts (eventually, we'll optimize with diffs)
  // this will trigger the updateContacts callback above
  servicePort.emit("getAllContacts");

  // stash the service pointer so we can send it messages later
  MY_SERVICES['contacts'] = servicePort;
});
```

Then, the service's ambassador frame looks like:

```html
<head><title>Contacts Service</title>

<script>
window.servicePort.on("getAllContacts", function(req) {
   getContactsFromServer(function(contacts) {
     req.reply(contacts);
   });
});

// open a websocket for presence
// but it could be long-poll, webrtc, or who knows!
var ws = new WebSocket(".../presence");
ws.onmessage = function(event) {
  var presenceMessage = JSON.parse(event.data);
  if (presenceMessage.isOnline)
    window.servicePort.emit("contactOnline", presenceMessage.contactId);
};

</script>
</head>
<body></body>
```


Notice interesting wins from having a service ambassador:
* the ambassador chooses to use websockets, but the `MessageChannel` API definition doesn't need to know. Different services can use different mechanisms.
* the ambassador can do local caching, maintain some state, load paged data from the server, etc. The `MessageChannel` API doesn't care and can stay simple.
