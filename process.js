'use strict'
const { connect } = require('mqtt')
const vm = require('node:vm')
const { readFile } = require('node:fs/promises')
const { fork } = require('child_process')

/**
 * Mqtt client
 */
const mqtt = connect('mqtt://test.mosquitto.org')

/**
 * Will be injected to the service script
 * @param {*} channel - channel to subscribe
 */
const subscribe = channel => {
  mqtt.subscribe(`service:${channel}`)
}

/**
 * Will be injected to the service script
 * @param {*} channel - channel to unsubscribe
 */
const unsubscribe = channel => {
  mqtt.unsubscribe(`service:${channel}`)
}

/**
 * Will be injected to the service script
 * @param {*} fn - message listener
 */
const listen = fn => {
  mqtt.on('message', fn)
}

/**
 * Will be injected to the service script
 * @param {*} channel - publish message on
 * @param {*} msg - message
 */
const publish = (channel, msg) => {
  mqtt.publish(`service:${channel}`, msg)
}

/**
 * Start new service by forking self process
 * @param {*} payload - service { name, script, ...options}
 */
const start = payload => {
  const { name, script, js } = payload
  const proc = fork(__filename, [], { detached: true })
  proc.send({ command: 'init', script, name, js })
}

/**
 * Sends 'stop' commend through mqtt
 * @param {*} name 
 */
const stop = name => {
  const message = JSON.stringify({ command: 'stop' })
  mqtt.publish(`system:${name}`, message)
}

/**
 * Add message listener for current service name
 * @param {*} name 
 */
const listenSystemChannel = name => {
  const channel = `system:${name}`
  mqtt.subscribe(channel)
  mqtt.on('message', (topic, msg) => {
    if (topic !== channel) return
    const message = JSON.parse(msg)
    if (message.command === 'stop') {
      console.log(`${name} stopped.`)
      process.exit(0)
    }
  })
}

/**
 * Create context for vm
 * @returns 
 */
const createContext = () => {
  return { process, console, setTimeout, require,
    start, stop, subscribe, unsubscribe, listen, publish, module: {}}
}

/**
 * Start vm
 * @param {*} js - js
 */
const startVm = js => {
  const src = new vm.Script(js)
  const context = createContext()
  src.runInNewContext(context)
}

/**
 * Initiate service by creating vm
 * @param {*} payload 
 */
const init = async payload => {
  const { script, name, js } = payload
  listenSystemChannel(name)
  if (js) return startVm(js)
  const src = await readFile(`${process.cwd()}/${script}`, 'utf8')
  startVm(src)
}

/**
 * Get initial data from parent
 */
process.on('message', message => {
  if (message.command === 'init') init(message)
})

/**
 * Log errors
 */
process.on('uncaughtException', console.error)

module.exports = { start }
