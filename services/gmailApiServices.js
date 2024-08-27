const { google } = require('googleapis')

async function listoflables(auth){
   const gmail = google.gmail({version:'v1',auth});
   const res = await gmail.users.labels.list({
    userId:'me',
   })
   const labels = res.data.labels;
   if(!labels || labels.length == 0){
     console.log('No lables are found');
     return;
   }
   console.log("labels:");
   labels.forEach(label => {
   console.log(`-${label.name}`)
});
    return labels;
}

//send email


async function sendEmail(auth, content) {
    const gmail = google.gmail({ version: 'v1', auth });

    // Ensure 'to' is provided and included in the raw email message
    const encodedMessage = Buffer.from(
        `To: ${content.to}\n` + 
        `Subject: ${content.subject}\n` + 
        `Content-Type: text/plain; charset="UTF-8"\n\n` + 
        `${content.text}`
    ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    try {
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
               // threadId: content.threadId || '', // Include threadId if needed
            }
        });
        console.log('Send Email Response:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}


//...............get latest message.............................................

async function getlatestMessage(auth) {
    try {
        const gmail = google.gmail({ version: 'v1', auth });

        // Fetch the latest message
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 1,
        });

        if (!res.data.messages || res.data.messages.length === 0) {
            console.log('No messages found.');
            return;
        }

        const latestMessageId = res.data.messages[0].id;
        console.log(`Latest Message Id: ${latestMessageId}`);

        // Fetch the message details
        const messageContent = await gmail.users.messages.get({
            userId: 'me',
            id: latestMessageId,
            format: 'full', // Request the full format to include all parts
        });

        const payload = messageContent.data.payload;
        let bodyData = '';

        // Check for message body in different parts
        if (payload.body.data) {
            bodyData = Buffer.from(payload.body.data, 'base64').toString();
        } else if (payload.parts) {
            // Handle multipart messages
            payload.parts.forEach(part => {
                if (part.mimeType === 'text/plain') {
                    bodyData = Buffer.from(part.body.data, 'base64').toString();
                }
            });
        }

        return {latestMessageId,bodyData};

    } catch (error) {
        console.error('Error fetching the latest message:', error);
    }
}


module.exports = {
    listoflables,
    sendEmail,
    getlatestMessage
};