const fs = require('node:fs')

fs.watch(__filename, { persistent: false }, (event, filename) => {
    console.log(event);
    console.log(filename);
})

setImmediate(() => {
    fs.rename(__filename, __filename + '.new', console.log)
})