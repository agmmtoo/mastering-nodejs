process.on('message', function (message, server) {
    console.log(process.pid, ':', message)
    server.on('connection', function (socket) {
        socket.end('Child handled the connection')
    })
})