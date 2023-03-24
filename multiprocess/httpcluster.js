const cluster = require('node:cluster')
const http = require('node:http')
const cpus = require('node:os').availableParallelism()

if (cluster.isPrimary) {
    for (let i = 0; i < cpus; i++) {
        cluster.fork()
    }
}

if (cluster.isWorker) {
    http.createServer((req, res) => {
        res.writeHead(200)
        res.end(`Hello from ${cluster.worker.id} ${process.pid}`)
    }).listen(8080)
}