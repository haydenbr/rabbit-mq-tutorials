import * as amqp from 'amqplib'
import { performance } from 'perf_hooks'

amqp
    .connect('amqp://localhost')
    .then(connection => connection.createChannel())
    .then(async channel => {
        const queue = 'task_queue'

        await channel.assertQueue(queue, {
            durable: true
        })

        await channel.prefetch(1)

        channel.consume(queue, (message) => {
            try {
                const messageContent = message.content.toString()
                const workSeconds = messageContent.split('.').length - 1

                console.log('Received message', messageContent)

                const startTime = performance.now()
                setTimeout(() => {
                    const endTime = performance.now()
                    const ellapsedTime = (endTime - startTime)/1000
                    channel.ack(message)
                    console.log(`Done work. Ellapsed time ${ellapsedTime}s`)
                }, workSeconds * 1000)
            }
            catch {
                channel.nack(message)
            }
        })
    })
    .catch(err => console.error(err))