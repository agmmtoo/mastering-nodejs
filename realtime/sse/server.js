const http = require('node:http')
const url = require('node:url')
const ss = require('node-static')

const static = new ss.Server()

const server = http.createServer((req, res) => {
    const timepath = url.parse(req.url, true).pathname.split('/')[1]
    if (timepath === 'time') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        })
        res.write(Array(2048).join(' ') + '\n')
        const timerId = setInterval(() => {
            const time = new Date()
            res.write(`data:${time.toISOString()}\n\n`)
        }, 1000)
        res.on('close', () => console.log('client disconnected'))
        return
    }

    static.serve(req, res)
})

server.listen(8080, () => console.log('http://localhost:8080'))