const fs = require('node:fs')
const readline = require('node:readline')

let cells = 6 * 36
let buffer = Buffer.alloc(cells)
let rand

while (cells--) {
    rand = Math.random() * 3
    buffer[cells] = rand < 1 ? 78 : rand < 2 ? 87 : 76
}

fs.open('scores.txt', 'w+', (err, fd) => {
    if (err) return console.error('open error: ', err)
    fs.write(fd, buffer, 0, buffer.length, 0, (err, writtenBytes, buffer) => {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        let quest = () => {
            rl.question('month/day', index => {
                if (!index) return rl.close()
                let md = index.split('/')
                let pos = parseInt(md[0] - 1) * 31 + parseInt(md[1] - 1)
                fs.read(fd, Buffer.alloc(1), 0, 1, pos, (err, br, buff) => {
                    let v = buff.toString()
                    console.log(v)
                    console.log(v === 'W' ? 'Win!' : v === 'L' ? 'Loss...' : 'No game')
                    quest()
                })
            })
        }
        quest()
    })
})