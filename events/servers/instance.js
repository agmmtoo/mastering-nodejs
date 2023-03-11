const http = require('node:http')

const server = new http.Server()

server.on('connection', (socket) => {
    let now = new Date()
    console.log(`Client has arrived: ${now}`)
    socket.on('end', () => console.log(`client left: ${new Date()}`))
})

server.setTimeout(2000, socket => socket.end())
server.listen(8080, console.log)