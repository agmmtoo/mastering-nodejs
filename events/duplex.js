const stream = require('node:stream')
const net = require('node:net')

net.createServer(socket => {
    socket.write('Go ahead and type something!')
    socket.setEncoding('utf-8')
    socket.on('readable', function () {
        process.stdout.write(this.read())
    })
}).listen(8080)