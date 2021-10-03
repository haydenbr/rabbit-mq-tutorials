import * as amqp from 'amqplib'

amqp
    .connect('amqp://localhost')
    .then(async connection => {
        const channel = await connection.createChannel()

        return {channel, connection}
    })
    .then(({ channel, connection }) => {
        channel.assertQueue('rpc_queue', {
            durable: false
        })

        channel.consume('rpc_queue', (message) => {
            try {
                let index = Number.parseInt(message.content.toString())
                console.log(`computing ${index}th fibbonaci`)
                let returnValue = fibonacci(index)
                console.log(`${index}th fibbonaci number: ${returnValue}`)
    
                channel.sendToQueue(
                    message.properties.replyTo,
                    Buffer.from(returnValue.toString()),
                    { correlationId: message.properties.correlationId }
                )
    
                channel.ack(message)
            } catch {
                channel.nack(message)
            }
        })
    })
    .catch(err => console.error(err))

function fibonacci(n) {
    console.log(`computing ${n}th`)
    if (n == 0 || n == 1) {
        return n;
    }
        
    else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}