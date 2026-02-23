import { useState } from 'react';

interface LoginScreenProps {
  onLogin: (apiKey: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [key, setKey] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLogin = () => {
    if (key.length < 20) {
      setValidationError('API Key is te kort. Controleer je sleutel.');
      return;
    }
    setValidationError(null);
    localStorage.setItem('mc_api_key', key);
    onLogin(key);
  };

  return (
    <div className="flex items-center justify-center h-full w-full bg-slate-900 flex-col gap-4 p-6">
      <div className="flex flex-col items-center gap-2 mb-4">
        <span className="text-5xl select-none">&#x1F4BB;</span>
        <h1 className="text-3xl text-white font-bold">Flow Suite</h1>
        <p className="text-slate-400 text-sm">OpenClaw MC API Visualisatie</p>
      </div>

      <p className="text-slate-300 text-center max-w-sm mb-2">
        Voer je MC API key in om je workflow te visualiseren en te beheren.
      </p>

      <input
        type="password"
        placeholder="Voer API Key in..."
        className="px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 w-80 focus:outline-none focus:border-blue-500 transition"
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
          setValidationError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleLogin();
        }}
      />

      {validationError && (
        <p className="text-red-400 text-sm">{validationError}</p>
      )}

      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded text-white font-semibold w-80 transition cursor-pointer"
      >
        Login
      </button>

      <p className="text-slate-500 text-xs mt-4">
        Je sleutel wordt lokaal opgeslagen in localStorage en niet gedeeld.
      </p>
    </div>
  );
}
