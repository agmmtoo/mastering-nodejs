const fs = require('node:fs')
fs.createReadStream('/var/log/syslog').pipe(process.stdout)

