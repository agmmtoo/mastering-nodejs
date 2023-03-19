const http = require('node:http')

const server = http.createServer((req, res) => {
	let url = req.url
	const regex = /^\/listCities\/([^\/\.]+)\/([^\/\.]+)\/?$/
	let match = req.url.match(regex)
	console.log(match)
	if (match) {
		res.end(JSON.stringify(match))
	}
	res.status = 404
	res.end()
})

server.listen(8080, () => console.info('http://localhost:8080'))
