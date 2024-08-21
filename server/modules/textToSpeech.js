import { exec } from 'child_process';
import path from 'path';

export async function convertTextToSpeech(text) {
    const responseAudioPath = path.join(process.cwd(), 'uploads', 'response.mp3');
    const command = `gtts-cli "${text}" --output ${responseAudioPath}`;
    return new Promise((resolve, reject) => {
        exec(command, (error) => {
            if (error) return reject(error);
            resolve(responseAudioPath);
        });
    });
}
