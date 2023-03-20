const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cookieParser())

app.get('/mycookie', (req, res) => {
    res.end(req.cookies.node_cookies)
})

app.get('/', (req, res) => {
    res.cookie('node_cookies', parseInt(Math.random() * 10e10))
    res.end("Cookie set")
})

app.listen(8080, () => console.log('http://localhost:8080'))