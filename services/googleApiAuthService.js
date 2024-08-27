const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require("googleapis");

//define scope
const SCOPE = ['https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.send']


const TOKEN_PATH = path.join(__dirname, '../credentials/token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials/credentials.json');


// read previously authorized credentials from saved file

async function loadSavedCredentialsifExists(){
    try{
       const content = await fs.readFile(TOKEN_PATH,'utf-8');
       const credentials = JSON.parse(content);
       return google.auth.fromJSON(credentials);
    }
    catch(err){
       console.log("error in loadSavedCredentialsifExists function ",err);
       return null; 
    }
}

//if token file is not created then generate the token
async function saveCredentials(client){
   const content = await fs.readFile(CREDENTIALS_PATH);
   const keys = JSON.parse(content);
   const key = keys.web || keys.installed;
   const payload = JSON.stringify({
      type:'authorised_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token
   })
   await fs.writeFile(TOKEN_PATH,payload);
}

// generate token............................
async function authorize(){
   let client = await loadSavedCredentialsifExists();
   if(client){
      return client;
   }

   client = await authenticate({
      scopes:SCOPE,
      keyfilePath:CREDENTIALS_PATH,
   });

   if(client.credentials){
      await saveCredentials(client);
   }
   return client;
}


module.exports = authorize;