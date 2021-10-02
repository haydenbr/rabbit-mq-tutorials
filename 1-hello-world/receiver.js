import * as amqp from 'amqplib'

amqp
    .connect('amqp://localhost')
    .then(connection => connection.createChannel())
    .then(channel => {
        const queue = 'hello'

        channel.assertQueue(queue, {
            durable: false
        })

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