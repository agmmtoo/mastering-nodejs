const fs = require('node:fs')

let walk = (dir, done) => {
    let results = {}
    fs.readdir(dir, (err, list) => {
        let pending = list.length
        if (err || !pending) {
            return done(err, results)
        }
        list.forEach(file => {
            let dfile = require('path').join(dir, file)
            fs.stat(dfile, (err, stat) => {
                if (stat.isDirectory()) {
                    return walk(dfile, (err, res) => {
                        results[file] = res
                        !--pending && done(null, results)
                    })
                }
            })
        })
    })
}

walk('.', (err, res) => console.log(require('util').inspect(res, { depth: null })))