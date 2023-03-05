const { Readable } = require('node:stream')
const { createWriteStream } = require('node:fs')

const r = new Readable()

let count = 0
r._read = function () {
    count++
    if (count > 10) {
        return r.push(null)
    }
    setTimeout(() => r.push(count + '\n'), 500)
}

const filename = process.argv[2] || 'stream.txt'
const writeStream = createWriteStream(filename, { flags: 'w', mode: 0o666 })

r.pipe(writeStream)