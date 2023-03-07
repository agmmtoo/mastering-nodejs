const size = parseInt(process.argv[2])
const n = process.argv[3] || 100
const buffers = []
let i
for (i = 0; i < n; i++) {
	buffers.push(Buffer.alloc(size))
	process.stdout.write(process.memoryUsage().heapTotal + "\n")
}
