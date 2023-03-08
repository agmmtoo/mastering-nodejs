process.on('message', (m) => {
    console.log('Parent said: ', m)
    process.send('Hi mom')
})