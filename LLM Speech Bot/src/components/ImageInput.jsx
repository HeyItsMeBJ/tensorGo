import { useState } from 'react';
import io from 'socket.io-client';


const socket = io('http://localhost:5000'); // Connect to the backend server

function ImageInput() {
    const [response, setResponse] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (image) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(image);
            reader.onload = function () {
                const arrayBuffer = reader.result;
                const base64Image = Buffer.from(arrayBuffer).toString('base64');
                socket.emit('image', { image: base64Image });

                socket.on('image_response', (data) => {
                    setResponse(data.text);
                    setExtractedText(data.extracted_text);
                });
            };
        }
    };

    return (
        <div>
            <h2>Image Input</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <button type="submit">Send</button>
            </form>
            <p>Extracted Text: {extractedText}</p>
            <p>Response: {response}</p>
        </div>
    );
}

export default ImageInput;
