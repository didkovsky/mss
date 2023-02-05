'use strict'
const { start } = require('./process')

/**
 * Starting root service
 */
start({
  name: 'root',
  script: `/services/root.js`
})
