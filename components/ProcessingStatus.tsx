import React, { useEffect, useRef } from 'react';
import { ProcessingState, ProcessingLog } from '../types';
import { Loader2, CheckCircle, AlertCircle, Terminal } from 'lucide-react';

interface ProcessingStatusProps {
  state: ProcessingState;
  logs: ProcessingLog[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ state, logs }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (state.total === 0 && logs.length === 0) return null;

  const percentage = state.total > 0 ? Math.round((state.progress / state.total) * 100) : 0;

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {state.isProcessing ? 'Processing Batch...' : 'Status'}
          </span>
          <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {state.isProcessing && (
          <p className="mt-2 text-xs text-gray-500 flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Currently generating: <span className="font-mono font-medium">{state.currentWord}</span>
          </p>
        )}
      </div>

      <div className="bg-gray-900 p-4 h-48 overflow-y-auto font-mono text-xs">
        {logs.map((log, idx) => (
          <div key={idx} className={`mb-1 flex items-start gap-2 ${
            log.type === 'error' ? 'text-red-400' :
            log.type === 'success' ? 'text-green-400' : 'text-gray-300'
          }`}>
            <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
            {log.type === 'error' && <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />}
            {log.type === 'success' && <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />}
            {log.type === 'info' && <Terminal className="w-3 h-3 mt-0.5 shrink-0" />}
            <span className="break-all">{log.message}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};