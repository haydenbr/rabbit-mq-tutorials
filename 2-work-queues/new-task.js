import * as amqp from 'amqplib'

amqp
    .connect('amqp://localhost')
    .then(async connection => {
        const channel = await connection.createChannel()
        
        return {channel, connection}
    })
    .then(({ channel, connection }) => {
        const queue = 'task_queue'
        const message = process.argv[2] || 'Hello World'

        channel.assertQueue(queue, { durable: true })
        channel.sendToQueue(queue, Buffer.from(message), { timestamp: Date.now() })

        console.log(`sent message: ${message}`)

        setTimeout(() => connection.close(), 500)
    })
    .catch(err => console.error(err))
