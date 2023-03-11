const stream = require('node:stream')

const spy = new stream.PassThrough()

spy
    .on('error', (err) => console.error(err))
    .on('data', function (chunk) {
        console.info(`spied data -> ${chunk}`)
    })
    .on('end', () => console.info('\nfinished'))

process.stdin.pipe(spy).pipe(process.stdout)