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
