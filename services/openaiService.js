const OpenAI = require('openai');
require('dotenv').config({path:'../.env'});

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

const categorizeEmail = async (emailBody) => {
    const prompt = `Classify this email: "${emailBody}" into one of these categories: Interested, Not Interested, More Information.`;
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 60,
    });

    return response.choices[0].message.content.trim();
};

module.exports = { categorizeEmail };
