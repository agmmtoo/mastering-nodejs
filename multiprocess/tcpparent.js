const fork = require('node:child_process').fork
const net = require('node:net')

const children = []
require('node:os').cpus().forEach((f, idx) => {
    children.push(fork('./tcpchild.js', [idx]))
})

net.createServer((socket) => {
    const rand = Math.floor(Math.random() * children.length)
    children[rand].send(null, socket)
}).listen(8080)

console.log(children.length)