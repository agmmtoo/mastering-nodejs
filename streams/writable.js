const stream = require('stream')

let writable = new stream.Writable({
    highWaterMark: 10
})

writable._write = (chunk, encoding, callback) => {
    process.stdout.write(chunk)

}