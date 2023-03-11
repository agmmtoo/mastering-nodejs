const https = require('node:https')
const fs = require('node:fs')

https.createServer({
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
}, (req, res) => {
    res.writeHead(200)
    res.end('hello secur eworld')
}).listen(443)