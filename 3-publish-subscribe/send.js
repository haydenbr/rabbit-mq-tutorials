import * as amqp from 'amqplib'

amqp
    .connect('amqp://localhost')
    .then(async connection => {
        const channel = await connection.createChannel()
        
        return {channel, connection}
    })
    .then(({ channel, connection }) => {
        let message = 'message'
        channel.assertExchange('logs', 'fanout', {durable: false})
        channel.publish('logs', '', Buffer.from(message), { timestamp: Date.now() })

        console.log(`sent message: ${message}`)

        setTimeout(() => connection.close(), 500)
    })
    .catch(err => console.error(err))
