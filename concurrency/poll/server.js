const fs = require('node:fs')
const express = require('express')
const cookieParser = require('cookie-parser')
const redis = require('redis')

const receiver = redis.createClient()
const publisher = redis.createClient()

receiver.on('error', err => console.error('Redis receiver error ', err))
publisher.on('error', err => console.error('Redis publisher error ', err))

await receiver.connect()
await publisher.connect()

const app = express()
app.use(cookieParser())

let connections = {}

app.get('/poll', (req, res) => {
    let id = req.cookies.node_poll_id
    if (!id) return
    connections[id] = res
})

app.get('/', (req, res) => {
    res.cookie('node_poll_id', Math.random().toString(36).substring(2, 9))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.createReadStream('./index.html', { encoding: 'utf-8' }).pipe(res)
    res.end()
})

app.listen(2112, () => console.log('http://localhost:2112'))

receiver.subscribe('stdin_message')
receiver.on('message', (channel, message) => {
    let conn
    for (conn in connections) {
        connections[conn].end(message)
    }
    console.log(`Received message: ${message} on channel: ${channel}`)
})

process.stdin.on('readable', function () {
    let msg = this.read()
    if (msg) {
        publisher.publish('stdin_message', msg.toString())
    }
})