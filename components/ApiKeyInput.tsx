import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  disabled: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey, disabled }) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
        OpenAI API Key
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Key className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type={showKey ? "text" : "password"}
          name="api-key"
          id="api-key"
          disabled={disabled}
          className="block w-full rounded-md border-gray-300 pl-10 pr-10 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500 border shadow-sm"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:text-gray-600"
        >
          {showKey ? (
            <EyeOff className="h-5 w-5 text-gray-400" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500">
        The key is used directly with OpenAI's API from your browser.
      </p>
    </div>
  );
};