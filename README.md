## Microservices template

Microservice system example based on MQTT events.

prepare
```sh
npm i
```

start
```sh
node .
```

output
```
root started.
app started.
app2 started.
service:apps: message from virtual.
service:apps: Message from app
service:apps: Message from app2
virtual stopped.
app stopped.
root stopped.
app2 stopped.
```

## Services examples

Root service, starts another services.
```javascript

/**
 * Root started
 */
console.log('root started.')

/**
 * Start service 'app'
 */
start({
  name: 'app',
  script: 'services/app.js'
})

/**
 * Start service 'app2'
 */
start({
  name: 'app2',
  script: 'services/app2.js'
})

/**
 * Start service 'virtual'
 */
start({
  name: 'virtual',
  js: 'publish("apps", "message from virtual."); setTimeout(stop, 3000, "virtual");'
})

/**
 * Subscribe to 'apps' channel
 */
subscribe('apps')

/**
 * Receive messages from channels
 */
listen((topic, msg) => {
  console.log(`${topic}: ${msg.toString('utf8')}`)
})

```

'app' service
```javascript
/**
 * app started
 */
console.log('app started.')

/**
 * Publishing message in 'apps' channel
 */
publish('apps', 'Message from app')

```

'app2' service, stops another services and themself.
```javascript
/**
 * app2 started.
 */
console.log('app2 started.')

/**
 * Publishing message in 'apps' channel
 */
publish('apps', 'Message from app2')

/**
 * Stopping all services by timeout
 */
setTimeout(stop, 5000, 'app')
setTimeout(stop, 6000, 'root')
setTimeout(stop, 7000, 'app2')

```
