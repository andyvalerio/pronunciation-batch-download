# Pronunciation Batch Download

A powerful web-based tool designed to batch generate audio pronunciations for lists of words using Google's Gemini AI. Users can input a list of words, select a target language and voice persona, and download a ZIP file containing individual `.wav` audio files for each word.

**Live Demo:** [https://valerio.nu/pronunciation/](https://valerio.nu/pronunciation/)

## Features

*   **Batch Processing:** Convert a list of words (one per line) into audio files automatically.
*   **Multiple Languages:** Supports Lithuanian, Russian, Italian, Czech, Swedish, and English.
*   **AI-Powered TTS:** Utilizes the advanced text-to-speech capabilities of the Gemini 2.5 Flash model.
*   **Voice Selection:** Choose from multiple distinct voice personas (Kore, Puck, Charon, Fenrir, Zephyr).
*   **ZIP Export:** Automatically packages all generated audio files into a single ZIP archive for easy download.
*   **Secure:** API keys are processed locally in the browser and are never stored or sent to a backend server.
*   **Audio Previews:** Listen to generated pronunciations directly in the browser before downloading.

## How It Works

1.  **Enter API Key:** Input your Google Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/)).
2.  **Configure:** Select the target language and preferred voice.
3.  **Input Words:** Paste your list of words or sentences into the text area.
4.  **Generate:** Click the button to start the batch process. The tool handles rate limiting and file generation.
5.  **Download:** Once complete, a ZIP file containing all pronunciations is automatically downloaded.

## Tech Stack

*   **Frontend:** React 19, Vite
*   **Styling:** Tailwind CSS, Lucide React (Icons)
*   **AI Integration:** Google GenAI SDK (`@google/genai`)
*   **File Handling:** JSZip, FileSaver.js
*   **Deployment:** Basic-FTP for static hosting deployment

## Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Build for production:
    ```bash
    npm run build
    ```

## Deployment

The project includes a `deploy.js` script for FTP deployment.

1.  Create a `.env` file with your FTP credentials:
    ```env
    FTP_HOST=ftp.yourserver.com
    FTP_USER=yourusername
    FTP_PASSWORD=yourpassword
    FTP_REMOTE_ROOT=/public_html/pronunciation
    ```
2.  Run the deploy script:
    ```bash
    npm run deploy
    ```

## License

MIT
