const fs = require('node:fs')
const path = require('node:path')

fs.open('testfile.txt', 'r', (err, fd) => {
	console.log(err)
	fs.fstat(fd, (err, stats) => {
		let totalBytes = stats.size
		let buffer = Buffer.alloc(totalBytes)
		let bytesRead = 0
		let read = (chunkSize) => {
			fs.read(fd, buffer, bytesRead, chunkSize, bytesRead, (err, numBytes, bufRef) => {
				if ((bytesRead += numBytes) < totalBytes) {
					return read(Math.min(512, totalBytes - bytesRead))
				}
				fs.close(fd)
				console.log(`File read complete. Total bytes read: ${totalBytes}`)
				console.log(bufRef.toString())
			})
		}
		read(Math.min(512, totalBytes))
	})
})
