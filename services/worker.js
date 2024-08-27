const { Worker } = require('bullmq');
const { categorizeEmail } = require('./openaiService.js');
const { sendEmail } = require('./gmailApiServices.js');
const authorize = require('./googleApiAuthService');

const connection = {
  host: 'localhost',
  port: 6379    
};

const worker = new Worker('email-queue', async (job) => {
  const emailContent = job.data.emailContent;
  const latestMessageId = job.data.latestMessageId;
  const recipientEmail = job.data.email;

 // console.log('Received job with email content:', emailContent);
 // console.log(`Message rec id: ${job.id}`);
 // console.log('Processing message');
//  console.log(`Sending email to ${recipientEmail}`);

  let auth;
  try {
   // console.log('Starting authorization...');
    auth = await authorize();
  //  console.log('Authorization successful:', auth);
  } catch (error) {
    console.error('Error during authorization:', error);
    throw error;
  }

  if (emailContent) {
    try {
      console.log('Classifying email content...');
      let label;
      try {
        label = await categorizeEmail(emailContent);
      } catch (error) {
        label = 'Interested';  // Fallback to 'Interested' if classification fails
      }
      console.log('Email classified as:', label);

      let replyContent;
      switch (label) {
        case 'Interested':
          replyContent = 'Thank you for your interest! Would you like to schedule a demo call? Please suggest a convenient time.';
          break;
        case 'Not Interested':
          replyContent = 'Thank you for your response. If you have any questions, feel free to reach out.';
          break;
        case 'More Information':
          replyContent = 'We appreciate your interest! Please let us know what specific information you need, and we’ll provide it.';
          break;
        default:
          replyContent = 'Thank you for your email. We will get back to you shortly.';
      }

      const replyMessage = {
        to: recipientEmail,         // Pass recipient email address here
        subject: 'Re: Your Inquiry', // Subject for the reply
        text: replyContent,          // Body of the email
        threadId: latestMessageId || '',  // Include threadId if applicable
      };

    //  console.log('Reply message:', replyMessage);
      await sendEmail(auth, replyMessage).catch(console.error);
      console.log('Email Sent');
    } catch (error) {
      console.error('Error processing email:', error);
    }
  }
}, { connection });
