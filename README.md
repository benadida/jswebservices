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