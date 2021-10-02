import * as amqp from 'amqplib'

amqp
    .connect('amqp://localhost')
    .then(async connection => {
        const channel = await connection.createChannel()
        
        return {channel, connection}
    })
    .then(({ channel, connection }) => {
        let message = 'message'
        let routingKeys = process.argv.slice(2)

        channel.assertExchange('animals', 'topic', {durable: false})
        
        for (let key of routingKeys) {
            channel.publish('animals', key, Buffer.from(message), { timestamp: Date.now() })
        }

        console.log(`sent message: ${message} with keys: [${routingKeys.join(', ')}]`)

        setTimeout(() => connection.close(), 500)
    })
    .catch(err => console.error(err))
