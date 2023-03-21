import { createClient } from 'redis'
import crypto from 'node:crypto'
import { createReadStream } from 'node:fs'
import express, { response } from 'express'

const app = express()
const client = createClient()
await client.connect()

app.get('/authenticate/:username', async (req, res) => {
    const publicKey = Math.random()
    const username = req.params.username
    const userdata = await client.hGetAll(username)
    if (!Object.keys(userdata).length) return res.status(404)
    const challenge = crypto.createHash('sha256').update(publicKey + userdata.password).digest('hex')
    await client.setEx(challenge, 5, username)
    res.end(challenge)
})

app.get('/login/:response', async (req, res) => {
    const challengeHash = req.params.response
    const exists = await client.exists(challengeHash)
    if (!exists) res.status(404)
    await client.del(challengeHash)
    res.status(200).end('OK')
})

app.get('/', async (req, res) => {
    createReadStream('./handshake.html').pipe(res)
})

app.use((err, req, res) => req.status(500))

app.listen(8080, () => console.log('http://localhost:8080'))

