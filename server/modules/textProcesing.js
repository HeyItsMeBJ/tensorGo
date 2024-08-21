import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: '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',
});

export async function processTextWithGPT(text) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'owner', content: text }],
        }); 

        return response.choices[0].message.content;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error('Rate limit exceeded. Please check your quota and billing details.');
        } else {
            console.error('Error processing text with GPT:', error);
        }
        throw new Error('Failed to process text'); 
    }
}

async function testAPI() {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'owner', content: 'Hello, world!' }],
        });
        console.log(response);
    } catch (error) {
        console.error('Error:', error);
    }
}

testAPI();