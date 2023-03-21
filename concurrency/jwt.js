const crypto = require('node:crypto')
const url = require('node:url')
const express = require('express')
const multer = require('multer')
const jwt = require('jwt-simple')

const app = express()

app.set('jwtSecret', 'shhhhhhhhh')

const server = app.listen(8080, () => console.log(server.address(), 'http://localhost:8080'))

app.use(express.static(__dirname))

app.post('/login', multer().none(), auth, function (req, res) {
    const nowSeconds = Math.floor(Date.now() / 1000)
    const plus7Days = nowSeconds + (60 * 60 * 24 * 7)

    const token = jwt.encode({
        'iss': 'http://agmmtoo.me',
        'aud': ['http://agmmtoo.me', 'http://blog.agmmtoo.me'],
        'sub': 'agmmtoo:unique_id',
        'iat': nowSeconds,
        'exp': plus7Days,
        'sessionData': encrypt(JSON.stringify({
            'department': 'sales',
        }))
    }, app.get('jwtSecret'))

    res.send({
        token: token
    })
})

app.post('/tokendata', multer().none(), function (req, res) {
    const token = req.get('Authorization').split(' ')[1]
    const decoded = jwt.decode(token, app.get('jwtSecret'))
    decoded.sessionData = JSON.parse(decrypt(decoded.sessionData))
    const now = Math.floor(Date.now() / 1000)
    if (now > decoded.exp) {
        return res.end(JSON.stringify({
            error: 'Token expired'
        }))
    }
    res.send(decoded)
})

function encrypt(plainText) {
    const cipher = crypto.createCipher('aes-256-cbc', app.get('jwtSecret'))
    return cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex')
}

function decrypt(encrypted) {
    const decipher = crypto.createDecipher('aes-256-cbc', app.get('jwtSecret'))
    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8')
}

function auth(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.end(JSON.stringify({
            error: 'Bad Credentials'
        }))
    }
    next()
}