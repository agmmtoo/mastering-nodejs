const http = require('http')
const fs = require('fs')
const ws = require('ws')

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.createReadStream('./ws.html', { encoding: 'utf-8' }).pipe(res).on('close', res.end)
}).listen(8080, () => console.log('http://localhost:8080'))

const SocketServer = ws.Server
const wss = new SocketServer({ port: 8081 })
wss.on('connection', (conn) => {
    conn.on('message', (s) => {
        const msg = s.toString()
        console.log(msg)
        if (msg.startsWith('num: ')) {
            const num = Number(msg.slice(5))
            conn.send(num * num)
        }
    })
    conn.send('You\'ve connected!')
})