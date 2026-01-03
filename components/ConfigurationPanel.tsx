import React from 'react';
import { Language, Voice } from '../types';
import { Settings2, Mic, Timer, Gauge } from 'lucide-react';

interface ConfigurationPanelProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  voice: Voice;
  setVoice: (voice: Voice) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  delayMs: number;
  setDelayMs: (ms: number) => void;
  disabled: boolean;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  language,
  setLanguage,
  voice,
  setVoice,
  speed,
  setSpeed,
  delayMs,
  setDelayMs,
  disabled
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Settings2 className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-gray-900">Configuration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Target Language (Context)</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            disabled={disabled}
            className="block w-full rounded-md border-gray-300 py-2.5 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm border shadow-sm"
          >
            {Object.values(Language).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Mic className="w-4 h-4" /> Voice
          </label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value as Voice)}
            disabled={disabled}
            className="block w-full rounded-md border-gray-300 py-2.5 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm border shadow-sm"
          >
            {Object.values(Voice).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Speed Slider */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-2"><Gauge className="w-4 h-4" /> Speed</span>
            <span className="text-emerald-600 font-bold">x{speed.toFixed(2)}</span>
          </label>
          <input 
            type="range" 
            min="0.25" 
            max="4.0" 
            step="0.25"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>0.25x</span>
            <span>1.0x</span>
            <span>4.0x</span>
          </div>
        </div>

        {/* Delay Slider */}
        <div className="space-y-2">
           <label className="block text-sm font-medium text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-2"><Timer className="w-4 h-4" /> Delay Between Requests</span>
            <span className="text-emerald-600 font-bold">{delayMs} ms</span>
          </label>
          <input 
            type="range" 
            min="100" 
            max="5000" 
            step="100"
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <p className="text-xs text-gray-500">
             Adjust to manage rate limits.
          </p>
        </div>
      </div>
    </div>
  );
};