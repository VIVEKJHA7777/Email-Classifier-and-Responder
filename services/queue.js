
const {Queue} =require('bullmq')

const notificationQueue = new Queue('email-queue',{
    connection:{
        host: 'localhost',
        port: 6379
    }
});

async function init(latestMessageId,emailContent){
//  console.log(emailContent);
//  console.log('queue.js');
 const res = await notificationQueue.add('message id', {
  latestMessageId:latestMessageId,
  emailContent:emailContent,
  email: process.env.YOUR_EMAIL_ADDRESS
})
    console.log('Job added to Queue:', res.id);
}
module.exports = init;