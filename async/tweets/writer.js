let fs = require('node:fs')
let crypto = require('node:crypto')

let tweetFile = 'tweets.txt'

let writeStream = fs.createWriteStream(tweetFile, {
    flags: 'a'
})

let cleanBuffer = function (len) {
    let buf = Buffer.alloc(len)
    buf.fill('\0')
    return buf
}

let check = function () {
    let text = crypto.randomBytes(70).toString('hex')
    let buffer = cleanBuffer(text.length)
    buffer.write(text, 0, 140)

    writeStream.write(buffer)
    setTimeout(check, 10000)
}

check()