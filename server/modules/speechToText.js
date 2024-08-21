import fs from 'fs';
import { SpeechClient } from '@google-cloud/speech';

const speechClient = new SpeechClient();

export async function convertSpeechToText(filePath) {
    const audioBytes = fs.readFileSync(filePath).toString('base64');
    const audio = { content: audioBytes };
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
    };
    const request = { audio, config };

    const [response] = await speechClient.recognize(request);
    return response.results.map(result => result.alternatives[0].transcript).join('\n');
}
