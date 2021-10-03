import * as amqp from 'amqplib'
import { argv } from 'process'
import * as uuid from 'uuid'

amqp
    .connect('amqp://localhost')
    .then(connection => connection.createChannel())
    .then(async channel => {
        const { queue } = await channel.assertQueue('', {
            exclusive: true,
        })

        await channel.assertQueue('rpc_queue', {
            durable: false
        })

        var arg = argv[2]
        channel.sendToQueue('rpc_queue', Buffer.from(arg), {
            replyTo: queue,
            correlationId: uuid.v4()
        })

        channel.consume(queue, (message) => {
            let result = message.content.toString()
            let correlationId = message.properties.correlationId

            console.log(`response for ${correlationId}: ${result}`)

            process.exit(0)
        })
    })
    .catch(err => console.error(err))