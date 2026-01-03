import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { Download, FileAudio, PlayCircle, Trash2 } from 'lucide-react';

import { ApiKeyInput } from './components/ApiKeyInput';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { ProcessingStatus } from './components/ProcessingStatus';
import { generateSpeech, sanitizeFilename } from './services/geminiService';
import { pcmToWav } from './utils/audioUtils';
import { Language, Voice, ProcessingLog, ProcessingState } from './types';

interface GeneratedAudio {
  word: string;
  url: string;
  filename: string;
}

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [wordsInput, setWordsInput] = useState('');
  const [language, setLanguage] = useState<Language>(Language.Lithuanian);
  const [voice, setVoice] = useState<Voice>(Voice.Kore);
  
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [generatedItems, setGeneratedItems] = useState<GeneratedAudio[]>([]);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    total: 0,
    currentWord: '',
  });

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      generatedItems.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, [generatedItems]);

  const addLog = (message: string, type: ProcessingLog['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const handleProcess = useCallback(async () => {
    if (!apiKey) {
      alert("Please enter a valid Gemini API Key.");
      return;
    }

    const words = wordsInput.split('\n').map(w => w.trim()).filter(w => w.length > 0);
    if (words.length === 0) {
      alert("Please enter at least one word.");
      return;
    }

    // Clear previous items
    generatedItems.forEach(item => URL.revokeObjectURL(item.url));
    setGeneratedItems([]);

    setProcessingState({
      isProcessing: true,
      progress: 0,
      total: words.length,
      currentWord: '',
    });
    setLogs([]); 
    addLog(`Starting batch process for ${words.length} words in ${language}...`);

    const zip = new JSZip();
    const folderName = `pronunciations_${language.toLowerCase()}_${new Date().toISOString().slice(0,10)}`;
    const folder = zip.folder(folderName);

    if (!folder) {
        addLog("Failed to create ZIP folder.", 'error');
        setProcessingState(prev => ({ ...prev, isProcessing: false }));
        return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      setProcessingState(prev => ({ ...prev, progress: i, currentWord: word }));
      
      try {
        addLog(`Generating audio for: "${word}"`, 'info');
        
        // Rate limiting precaution
        if (i > 0) await new Promise(r => setTimeout(r, 500));

        const pcmBuffer = await generateSpeech(apiKey, word, language, voice);
        
        // Convert raw PCM to WAV
        const wavBuffer = pcmToWav(pcmBuffer);
        const filename = `${sanitizeFilename(word)}.wav`;
        
        // Add to ZIP
        folder.file(filename, wavBuffer);

        // Create preview URL
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        setGeneratedItems(prev => [...prev, { word, url, filename }]);
        addLog(`Success: ${filename}`, 'success');
        successCount++;
      } catch (err: any) {
        addLog(`Failed "${word}": ${err.message}`, 'error');
        failureCount++;
      }
    }

    setProcessingState(prev => ({ ...prev, progress: words.length, currentWord: 'Finalizing ZIP...' }));
    addLog(`Batch complete. Success: ${successCount}, Failures: ${failureCount}. Zipping...`);

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${folderName}.zip`);
      addLog("ZIP file downloaded successfully.", 'success');
    } catch (err: any) {
      addLog(`Failed to generate ZIP: ${err.message}`, 'error');
    }

    setProcessingState(prev => ({ ...prev, isProcessing: false, currentWord: '' }));

  }, [apiKey, wordsInput, language, voice, generatedItems]);

  const clearResults = () => {
     generatedItems.forEach(item => URL.revokeObjectURL(item.url));
     setGeneratedItems([]);
     setLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 rounded-full shadow-lg">
              <FileAudio className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">PolyGlot TTS Batcher</h1>
          <p className="mt-2 text-lg text-gray-600">
            Generate pronunciation files in bulk using Gemini AI.
          </p>
        </div>

        {/* API Key Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <ApiKeyInput 
            apiKey={apiKey} 
            setApiKey={setApiKey} 
            disabled={processingState.isProcessing} 
          />
        </div>

        {/* Configuration */}
        <ConfigurationPanel
          language={language}
          setLanguage={setLanguage}
          voice={voice}
          setVoice={setVoice}
          disabled={processingState.isProcessing}
        />

        {/* Input Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label htmlFor="words" className="block text-sm font-medium text-gray-700 mb-2">
            Word List (One per line)
          </label>
          <textarea
            id="words"
            rows={8}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border font-mono"
            placeholder={`Labas\nAčiū\nViso gero...`}
            value={wordsInput}
            onChange={(e) => setWordsInput(e.target.value)}
            disabled={processingState.isProcessing}
          />
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
             <span>Supported languages: Lithuanian, Russian.</span>
             <span>{wordsInput.split('\n').filter(w => w.trim()).length} words detected</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleProcess}
          disabled={processingState.isProcessing || !wordsInput.trim() || !apiKey}
          className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white transition-all
            ${processingState.isProcessing || !wordsInput.trim() || !apiKey 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
        >
          {processingState.isProcessing ? (
            <span className="flex items-center gap-2">Processing...</span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Generate & Download ZIP
            </span>
          )}
        </button>

        {/* Status & Logs */}
        <ProcessingStatus state={processingState} logs={logs} />

        {/* Audio Previews */}
        {generatedItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-600" />
                Audio Previews ({generatedItems.length})
              </h3>
              <button 
                onClick={clearResults}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {generatedItems.map((item, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.word}</p>
                    <p className="text-xs text-gray-500 font-mono truncate">{item.filename}</p>
                  </div>
                  <audio 
                    controls 
                    src={item.url} 
                    className="h-8 w-full sm:w-64"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}