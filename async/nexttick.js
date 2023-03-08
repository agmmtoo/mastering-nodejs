const events = require('node:events')

function Emitter() {
    let emitter = new events.EventEmitter()
    process.nextTick(() => emitter.emit('start'))
    return emitter
}

let myEmitter = new Emitter()

myEmitter.on('start', () => {
    console.log('Started')
})