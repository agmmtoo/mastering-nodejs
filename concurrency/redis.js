const redis = require('redis')

const client = redis.createClient()
client.set('userId', 'jack', (err) => {
	client.get('userId', (err, data) => {
		console.log(data)
	})
})
