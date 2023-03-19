
const fs = require('fs/promises')

const formats = ['.bmp', '.png', '.gif', '.jpg', '.jpeg']
function go(p) {
    if (formats.some(f => p.endsWith(f))) {
        app.image = 'file://' + p
    } else {
        app.image = null
        fs.lstat(p)
            .then(stat => {
                if (stat.isDirectory()) {
                    app.location = p
                    fs.readdir(app.location)
                        .then(files => {
                            app.files = files.map((file, idx) => ({ id: idx, name: file }))
                        })
                        .catch(e => console.error(e.stack))
                } else {
                    // Non-directory
                }
            })
            .catch(e => console.error(e.stack))
    }
}

go(app.location)