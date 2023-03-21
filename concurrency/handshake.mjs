import { createClient } from 'redis'
import crypto from 'node:crypto'
import { readFile } from 'node:fs/promises'
import express, { response } from 'express'

const app = express()
const client = createClient()
await client.connect()

app.get('/authenticate/:username', async (req, res) => {
    const publicKey = Math.random()
    const username = req.params.username
    const userdata = await client.hGetAll(username)
    if (!Object.keys(userdata).length) return res.status(404).end()
    const challenge = crypto.createHash('sha256').update(publicKey + userdata.password).digest('hex')
    console.log('challenge', challenge)
    await client.setEx(challenge, 5, username)
    res.end(publicKey.toString())
})

app.get('/login/:response', async (req, res) => {
    const challengeHash = req.params.response
    console.log('ch', challengeHash)
    const exists = await client.exists(challengeHash)
    console.log(exists)
    if (!exists) return res.status(404).send('failed')
    await client.del(challengeHash)
    return res.status(200).end('OK')
})

app.get('/', async (req, res) => {
    const html = await readFile('./handshake.html')
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
})

app.use((err, req, res) => req.status(500))

app.listen(8080, () => console.log('http://localhost:8080'))

