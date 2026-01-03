import React from 'react';
import { Language, Voice } from '../types';
import { Settings2, Mic, Timer } from 'lucide-react';

interface ConfigurationPanelProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  voice: Voice;
  setVoice: (voice: Voice) => void;
  delayMs: number;
  setDelayMs: (ms: number) => void;
  disabled: boolean;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  language,
  setLanguage,
  voice,
  setVoice,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="space-y-2 md:col-span-2">
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
             Adjust speed to respect OpenAI rate limits (RPM).
          </p>
        </div>
      </div>
    </div>
  );
};