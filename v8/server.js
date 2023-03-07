let net = require('net')
let repl = require('repl')

net.createServer((socket) => {
	repl
	.start({
		prompt: "> ",
		input: socket,
		output: socket,
		terminal: true
	}).on('exit', () => {
		socket.end()
	})
}).listen(8080)
