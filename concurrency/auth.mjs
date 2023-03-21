import { createClient } from 'redis'
import { createServer } from 'node:http'

const client = createClient()
await client.connect()


createServer(async function (req, res) {
	let auth = req.headers['authorization']
	if (!auth) {
		res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Secure Area"' })
		return res.end('<html><body>Please enter some credentials.</body></html>')
	}

	let tmp = auth.split(' ')
	let buf = Buffer.from(tmp[1], 'base64')
	let plain_auth = buf.toString()
	let creds = plain_auth.split(':')
	let username = creds[0]

	try {
		const data = await client.get(username)
		console.log(data)
		res.statusCode = 200
		res.end('<html><body>Welcome!</body></html>')
	} catch (error) {
		res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="secure Area"' })
		return res.end('<html><body>You are not authorized.</body></html>')
	}
}).listen(8080, () => console.log('http://localhost:8080'))
