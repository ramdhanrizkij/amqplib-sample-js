require('dotenv').config()

const amqp = require('amqplib')     
const AMQP_CONNECTION = process.env.AMQP_CONNECTION

amqp.connect(AMQP_CONNECTION)
  .then(conn => {
    return conn.createChannel().then(ch => {
      const sampleSplunkData = 
        {
            "ip_address":"172.31.68.15",
            "hostname":"ME-D5-MLA",
            "port_memb":"GigabitEthernet8/0/2",
            "status":"down",
            "alert_time":"1697511600"
        }

        const sampleDwdmData = {
            "ne_name":"WH-9800-SCN-LBB",
            "slot_direction":"Slot direction",
            "severity":"Critical",
            "event":"Loss of OSC Interface input optical power",
            "status":"Recovery"
        }
      

      const splunkQueue = ch.assertQueue('splunkQueue', { durable: false })    
      
      ch.sendToQueue('splunkQueue', Buffer.from(JSON.stringify(sampleSplunkData)))     
      console.log('- Sent', sampleSplunkData)

      const dwdmQueue = ch.assertQueue('dwdmQueue', { durable: false })

      ch.sendToQueue('dwdmQueue', Buffer.from(JSON.stringify(sampleDwdmData)))
      console.log('- Sent', sampleDwdmData)

    }).finally(() => {
      setTimeout(function() { conn.close(); }, 500);
    })
}).catch(console.warn)