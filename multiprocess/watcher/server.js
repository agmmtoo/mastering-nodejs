const cluster = require('node:cluster')
const numCpus = require('node:os').availableParallelism()
const http = require('node:http')
const fs = require('node:fs')
const url = require('node:url')

const admins = new Map()

admins.set('adminname', {})

const server = http.createServer((req, res) => {
    const [,method, adminId] = url.parse(req.url).pathname.split('/')

    if (method === 'favicon.ico') res.end()

    if (method === 'admin') {
        if (!admins.has(adminId)) return res.end()
        if (admins.get(adminId).socket) return res.end('You already has an open session. Please close it first.')
        return fs.createReadStream('./admin.html').pipe(res)
    }

    if (method === 'receive') {
        if (!admins.has(adminId)) return res.end()

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        })
        res.write(Array(2049).join(' ') + '\n')
        res.write(`retry: ${2000}\n`)

        res.on('close', () => admins.set(adminId, {}))
        setInterval(() => res.write(`data: PING\n\n`), 15_000)

        admins.set(adminId, { socket: res })
        return
    }

    fs.createReadStream('./client.html').pipe(res)
}).listen(2112, () => console.log('listening on http://localhost:2112'))

cluster.setupPrimary({
    exec: 'sock-worker.js',
    silent: false,
})

if (cluster.isPrimary) {
    for (let i = 0; i < numCpus; i++) cluster.fork()

    cluster
        .on('fork', (w) => `forked ${w.process.id}`)
        .on('online', (w) => `online ${w.process.id}`)
        .on('listening', (w, addr) => `listening ${w.process.id} on ${addr.address}:${addr.port}`)
        .on('error', (...args) => console.error('error', ...args))
        .on('exit', (w, code, sig) => `exit ${w.process.id} with code ${code} and signal ${sig}`)
        .on('disconnect', (w) => `disconnect ${w.process.id}`)

    Object.keys(cluster.workers).forEach((id) => {
        cluster.workers[id].on('message', (msg) => {
            admins.forEach(({ socket }, adminId) => {
                socket?.write(`data: ${JSON.stringify(msg)}\n\n`)
            })
        })
    })
}
