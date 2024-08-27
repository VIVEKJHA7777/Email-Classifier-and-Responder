# Automated Email Response System with Gmail API and OpenAI Integration

This project is an automated email response system that integrates Gmail API and OpenAI. It fetches the latest email using the Gmail API, classifies the content using OpenAI's GPT-3.5, and responds to the email based on the classification. BullMQ is used for job queuing, and Redis serves as the message broker.

## Features

- **Gmail Integration:** Uses Gmail API to fetch the latest message and send automated email replies.
- **OpenAI Integration:** Classifies emails into categories such as "Interested", "Not Interested", and "More Information" using OpenAI GPT-3.5.
- **Automated Replies:** Based on the classified email content, a suitable reply is generated and sent back to the sender.
- **BullMQ for Queuing:** Implements BullMQ for handling email processing tasks asynchronously.
- **Redis Integration:** Redis is used as the message broker for the BullMQ job queue.

## Project Structure

- `index.js`: The entry point of the application. It authorizes the Gmail API, fetches the latest email, and adds the job to the queue.
- `services/gmailApiServices.js`: Handles Gmail API interactions such as fetching the latest email and sending a reply.
- `services/googleApiAuthService.js`: Manages Google API authentication and token storage.
- `services/openAiService.js`: Integrates OpenAI GPT-3.5 to classify email content.
- `services/queue.js`: Adds email processing tasks to the BullMQ queue.
- `services/worker.js`: Processes the tasks from the BullMQ queue, classifies the email using OpenAI, and sends the appropriate response.

## Installation

1. **Clone the repository**:

   ```bash
   git clone "https://github.com/VIVEKJHA7777/Email-Classifier-and-Responder"
   ```

2. **Install dependencies**:

   ```bash
   cd Email-Classifier-and-Responder
   npm install
   ```

3. **Setup Environment Variables**:
   
   Create a `.env` file in the root directory with the following contents:

   ```bash
   OPENAI_API_KEY=<Your OpenAI API Key>
   YOUR_EMAIL_ADDRESS=<Your Gmail Address>
   ```

4. **Google API Setup**:
   
   - Create a project in the [Google Developers Console](https://console.developers.google.com/).
   - Enable the Gmail API.
   - Download the `credentials.json` file and place it in the `credentials/` folder.
   
5. **Redis Setup**:
   
   Ensure that Redis is running on your machine or hosted remotely. By default, this project connects to Redis at `localhost:6379`.

6. **Run the Application**:

   ```bash
   node index.js
   cd services
   node worker.js
   ```

## Usage

- The system fetches the latest email, classifies its content using OpenAI, and sends an automated reply based on the classification.
- Email classifications and responses are handled through a BullMQ job queue, ensuring scalability.

## Gmail API Authorization

1. The application checks for saved credentials. If no valid credentials are found, the system will prompt for Google authorization.
2. The `gmailApiAuthService.js` file manages token generation and credential storage.
3. After authorization, the token is saved locally in the `credentials/token.json` file for future use.

## Job Queue and Worker

- The `queue.js` file adds a job to the BullMQ queue.
- The `worker.js` file listens for new jobs and processes them asynchronously. It classifies the email content using OpenAI, generates a reply, and sends it via the Gmail API.

## OpenAI Email Classification

- The `openAiService.js` handles email classification using OpenAI's GPT-3.5.
- The email content is categorized into one of three categories: 
  - Interested
  - Not Interested
  - More Information




