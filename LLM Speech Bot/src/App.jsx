
import TextInput from './components/TextInput';
import AudioInput from './components/AudioInput';
import ImageInput from './components/ImageInput';
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>LLM Bot</h1>
            <TextInput />
            <AudioInput />
            <ImageInput />
        </div>
    );
}

export default App;
