require('dotenv').config()

const amqp = require('amqplib')
const AMQP_CONNECTION = process.env.AMQP_CONNECTION

amqp.connect(AMQP_CONNECTION)
  .then(conn=> {
    return conn.createChannel().then(ch => {

      const splunkQueue = ch.assertQueue('splunkQueue', { durable: false })
      if(splunkQueue){
        splunkQueue.then(() => {
          return ch.consume('splunkQueue', msg => {
            let json_data = JSON.parse(msg.content.toString());
            console.log("- Received splunkQueue : ",json_data)
            // TODO: Save data to DB
          }, { noAck: true })
        })
        .then(() => {
          console.log('* Waiting for messages. Ctrl+C to exit')
        })
      }
      
      const dwdmQueue = ch.assertQueue('dwdmQueue', { durable: false })      // Deklarasi antrian
      if(dwdmQueue){
        dwdmQueue.then(() => {
          return ch.consume('dwdmQueue', msg => {
            let json_data = JSON.parse(msg.content.toString());
            console.log("- Received dwdmQueue : ",json_data)
            // TODO: Save data to DB
          }, { noAck: true })
        })
        .then(() => {
          console.log('* Waiting for messages. Ctrl+C to exit')
        })
      }

    })
}).catch(console.warn)