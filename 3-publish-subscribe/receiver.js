import * as amqp from 'amqplib'

amqp
    .connect('amqp://localhost')
    .then(connection => connection.createChannel())
    .then(async channel => {
        await channel.assertExchange('logs', 'fanout', {durable: false})
        let {queue} = await channel.assertQueue('', {
            durable: false
        })

        console.log(`created anonymous queue: ${queue}`)

        await channel.bindQueue(queue, 'logs', '')

        channel.consume(
            queue,
            (message) => console.log('Received message', {
                content: message.content.toString(),
                fields: message.fields,
                properties: message.properties
            }),
            { noAck: true }
        )
    })
    .catch(err => console.error(err))