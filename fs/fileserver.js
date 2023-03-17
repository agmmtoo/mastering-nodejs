const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const crypto = require('node:crypto')
const formidable = require('formidable')

http.createServer((request, response) => {
    let rm = request.method.toLowerCase()
    if (rm === 'post') {
        formidable({
            uploadDir: process.cwd()
        })
            .on('file', (formName, file) => {
                // process files
            })
            .on('field', (name, value) => {
                // process POSTED field data
            })
            .on('end', () => response.end('Received'))
            .parse(request)
        return
    }
    if (rm !== 'get') {
        return response.end('Unsupported Method')
    }
    let filename = path.join(__dirname, request.url)
    console.log(request.url)
    fs.stat(filename, (err, stat) => {
        if (err) {
            response.statusCode = err.errno === 34 ? 404 : 500
            return response.end()
        }
        const etag = crypto.createHash('md5').update(stat.size + stat.mtime).digest('hex')
        response.setHeader('Last-Modified', stat.mtime)
        if (request.headers['if-none-match'] === etag) {
            response.statusCode = 304
            return response.end()
        }
        response.setHeader('Content-Length', stat.size)
        response.setHeader('ETag', etag)
        response.statusCode = 200
        fs.createReadStream(filename).pipe(response)
    })
})
.listen(8000, () => console.info('http://localhost:8000'))