console.log('running...')

setInterval(() => {}, 1e6)

process.on('SIGINT', () => {
	console.log('we received the SIGINT signal!')
	process.exit(1)
})
