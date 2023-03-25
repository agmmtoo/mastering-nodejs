const amqp = require('amqp')

const consumer = amqp.createConnection({ host: 'localhost', port: '5672' })

consumer.on('error', console.log)
consumer.on('ready', () => {
    const exchange = consumer.exchange('node-topic-exchange', { type: 'topic' })
    consumer.queue('node-topic-queue', (q) => {
        q.bind(exchange, '#')
        q.subscribe((msg, _, c) => {
            console.log(msg.data.toString(), c)
        })
        exchange.publish('some-topic', 'Hello')
    })
    setTimeout(() => exchange.publish('another-topic', 'Okkk'), 1_000)
})



