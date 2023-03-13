const http = require('node:http')
const url = require('node:url')

http.createServer((request, response) => {
    let cookies = request.headers.cookie

    if (!cookies) {
        console.log('no cookies')
        let name = 'session'
        let value = '123456'
        let days = 4
        let expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + days)
        let cookieText = `${name}=${value};expires=${expiryDate.toUTCString()}`

        response.setHeader('Set-Cookie', cookieText)
        response.writeHead(302, { 'Location': '/' })
        return response.end()
    } else {console.log('yes cookies')}

    cookies.split(';').forEach(cookie => {
        let m = cookie.match(/(.*?)=(.*?)$/)
        cookies[m[1].trim()] = (m[2] || '').trim()
    })

    response.end(`Cookie set: ${cookies.toString()}`)
}).listen(8080)
