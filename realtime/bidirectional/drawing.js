const http = require('node:http')
const socketIO = require('socket.io')
const ns = require('node-static')
const staticServer = new ns.Server()

const server = http.createServer((req, res) => {
    staticServer.serve(req, res)
})

const io = new socketIO.Server()
io.attach(server)

io.on('connection', socket => {
    const id = socket.id

    socket.on('mousemove', (data) => {
        data.id = id
        socket.broadcast.emit('moving', data)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('clientdisconnect', id)
    })
})

server.listen(8080, () => console.log('http://localhost:8080'))
