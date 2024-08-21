import  { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the backend server

function AudioInput() {
    const [response, setResponse] = useState('');
    const [audio, setAudio] = useState(null);

    const handleAudioUpload = (e) => {
        setAudio(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (audio) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(audio);
            reader.onload = function () {
                const arrayBuffer = reader.result;
                const base64Audio = Buffer.from(arrayBuffer).toString('base64');
                socket.emit('audio', { audio: base64Audio });

                socket.on('response', (data) => {
                    setResponse(data.text);
                    const audioBlob = new Blob([Buffer.from(data.audio, 'base64')], { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audioElement = new Audio(audioUrl);
                    audioElement.play();
                });
            };
        }
    };

    return (
        <div>
            <h2>Audio Input</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="audio/*" onChange={handleAudioUpload} />
                <button type="submit">Send</button>
            </form>
            <p>Response: {response}</p>
        </div>
    );
}

export default AudioInput;
