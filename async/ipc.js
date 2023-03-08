console.log('running...')

setInterval(() => {}, 1e6)

process.on('SIGUSR1', (e) => {
	console.log('Got a signal!', e)
})
