const ws = require('ws')

const ss = new ws.Server({ port: 2113 })

ss.on('connection', (socket) => {
    let lastM = null
    let kill = () => lastM && process.send({ kill: lastM.id })
    socket.on('message', (msg) => {
        lastM = JSON.parse(msg)
        process.send(lastM)
    })
    socket.on('close', kill)
    socket.on('error', kill)
})