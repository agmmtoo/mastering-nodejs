let net = require('net')
let sock = net.connect(8080)

process.stdin.pipe(sock)
sock.pipe(process.stdout)
