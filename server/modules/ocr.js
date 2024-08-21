import Tesseract from 'tesseract.js';

export async function extractTextFromImage(filePath) {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    return text.trim();
}
