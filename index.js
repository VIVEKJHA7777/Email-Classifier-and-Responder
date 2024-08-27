require('dotenv').config();
const authorize = require('./services/googleApiAuthService');
const {  getlatestMessage } = require('./services/gmailApiServices');

const init = require('./services/queue.js');

async function handleEmail() {
  try {
     const auth = await authorize();


    // Get the latest message
    const { latestMessageId, bodyData} = await getlatestMessage(auth);

    if(latestMessageId){
     await init(latestMessageId,bodyData);
    }
  } catch (error) {
    console.error('Error handling email:', error);
  }
}
handleEmail()
