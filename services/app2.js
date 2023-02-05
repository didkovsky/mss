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
