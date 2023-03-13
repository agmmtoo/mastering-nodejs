const http = require('node:http')
const qs = require('node:querystring')

http.createServer((req, res) => {
    let body = ''
    if (req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        return res.end(`
        <form action='/submit' method='POST'>
        <input type='text' name='sometext' />
        <input type='submit' value='Send some text' />
        </form>
        `)
    }
    if (req.url === '/submit') {
        req.on('readable', () => {
            let data = req.read()
            data && (body += data)
        })
        req.on('end', () => {
            let fields = qs.parse(body)
            res.end(`Thanks for sending: ${fields.sometext}`)
        })
    }
}).listen(8080)