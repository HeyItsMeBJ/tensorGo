import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import fs from 'fs';
import path from 'path';


import dotenv from 'dotenv';

import { convertSpeechToText } from './modules/speechToText.js';
import { processTextWithGPT } from './modules/textProcesing.js';
import { convertTextToSpeech } from './modules/textToSpeech.js';
import { extractTextFromImage } from './modules/ocr.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

dotenv.config(); 

const upload = multer({ dest: 'uploads/' });

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('audio', async (data) => {
        try {
            const audioBuffer = Buffer.from(data.audio, 'base64');
            const audioFilePath = path.join(process.cwd(), 'uploads', 'input.wav');
            fs.writeFileSync(audioFilePath, audioBuffer);

            const spokenText = await convertSpeechToText(audioFilePath);
            const botResponse = await processTextWithGPT(spokenText);
            const responseAudioPath = await convertTextToSpeech(botResponse);

            const responseAudio = fs.readFileSync(responseAudioPath).toString('base64');
            socket.emit('response', { text: botResponse, audio: responseAudio });
        } catch (error) {
            console.error('Error processing audio:', error);
            socket.emit('error', { message: 'Failed to process audio' });
        }
    });

    socket.on('image', async (data) => {
        try {
            const imageBuffer = Buffer.from(data.image, 'base64');
            const imageFilePath = path.join(process.cwd(), 'uploads', 'input.png');
            fs.writeFileSync(imageFilePath, imageBuffer);

            const extractedText = await extractTextFromImage(imageFilePath);
            const botResponse = await processTextWithGPT(extractedText);

            socket.emit('image_response', { text: botResponse, extracted_text: extractedText });
        } catch (error) {
            console.error('Error processing image:', error);
            socket.emit('error', { message: 'Failed to process image' });
        }
    });

    socket.on('text', async (data) => {
        try {
            console.log(data);
            
            const userText = data.text;
            const botResponse = await processTextWithGPT(userText);

            socket.emit('text_response', { text: botResponse });
        } catch (error) {
            console.error('Error processing text:', error);
            socket.emit('error', { message: 'Failed to process text' });
        }
    });
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
