const EventEmitter = require('node:events').EventEmitter

const Counter = function (i) {
    this.increment = function () {
        i++
        this.emit('incremented', i)
    }
}

// Object.setPrototypeOf(Counter.prototype, EventEmitter.prototype)
Counter.prototype = new EventEmitter()

const counter = new Counter(10)

const cb = console.log

counter.addListener('incremented', cb)
counter.increment();
counter.increment();