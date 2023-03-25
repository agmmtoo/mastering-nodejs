const udp = require('node:dgram')

const socket = udp.createSocket('udp4')

socket.on('error', console.log)
socket.on('message', (msg, rinfo) => {
    console.log(`socket got: ${msg.toString()} from ${rinfo.address}:${rinfo.port}`)
})
socket.bind(41234)
socket.on('listening', () => console.log('socket listening'))

const client = udp.createSocket('udp4')
const message = Buffer.from('UDP says Hello!', 'utf-8')
client.send(message, 41234, 'localhost', console.log)