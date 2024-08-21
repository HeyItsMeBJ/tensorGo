import  { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the backend server

function TextInput() {
    const [text, setText] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('hi');
        
        socket.emit('text', { text });

        socket.on('text_response', (data) => {
            setResponse(data.text);
        });
        socket.on('error', (data) => {
            setResponse(data.message);
        });
    };

    return (
        <div>
            <h2>Text Input</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
            <p>Response: {response}</p>
        </div>
    );
}

export default TextInput;
