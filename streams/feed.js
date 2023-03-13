const stream = require('stream')

function Feed(channel) {
	let readable = new stream.Readable({
		objectMode: true
	})
	let news = [
		'Big Win!',
		'Stocks Down!',
		'Actor Sad!'
	]
	let prices = [{ price: 1 }, { price: 2 }]
	readable._read = () => {
		if (prices.length) {
			return readable.push(prices.shift())
		}
		readable.push(null)
	}
	return readable
}

let feed = new Feed()
feed.on('readable', () => {
	let data = feed.read()
	data && console.log(data)
})

feed.on('end', () => console.log('No more news'))

