JS Web Services
=====

What if web services were exposed as a `MessageChannel` interface between
the client and an ambassador HTML/JS frame loaded from the service?
The client must then be a full web runtime.

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
// receive messages
window.servicePort.onmessage = function(message) {

}

// send messages
window.servicePort.postMessage({"action": "doit", "payload": "let's go"});
</script>
</head>
<body></body>
```

Why not just JS?
-----

Access to DOM, cookies, localStorage, makes for easier,
well-understood client state management. Also, HTML+JS lets us shim,
which makes developing against these APIs dramatically easier. The
following could run in any modern web browser:

```html
<head><title>Contacts Service</title>

// shims window.servicePort
<script src="https://jswebservic.es/include.js"></script>

<script>
// receive messages
window.servicePort.onmessage = function(message) {

}

// are we shimmed and have utilities?
// let's run some tests
if (window.servicePort.utils) {
   window.servicePort.utils.runTestSuite('contacts');
}

</script>
</head>
<body></body>
```