import * as amqp from 'amqplib'

amqp
    .connect('amqp://localhost')
    .then(connection => connection.createChannel())
    .then(async channel => {
        await channel.assertExchange('direct_logs', 'direct', {durable: false})
        let {queue} = await channel.assertQueue('', {
            durable: false
        })

        let bindingKeys = process.argv.slice(2)

        for (let key of bindingKeys) {
            await channel.bindQueue(queue, 'direct_logs', key)
        }

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