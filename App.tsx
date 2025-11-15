
import React, { useState, useCallback } from 'react';
import { generateContent } from './services/geminiService';
import Spinner from './components/Spinner';
import ErrorAlert from './components/ErrorAlert';
import ResultDisplay from './components/ResultDisplay';
import { GenerationResult } from './types';

const App: React.FC = () => {
  const [articleText, setArticleText] = useState<string>('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!articleText.trim() || articleText.trim().length < 100) {
      setError('Article content is too short. Please provide at least 100 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generationResult = await generateContent(articleText);
      setResult(generationResult);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [articleText]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              CHT-Gen
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
            Content-to-Header & Tag Generator
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cyan-300">1. Paste Your Article</h2>
            <textarea
              value={articleText}
              onChange={(e) => setArticleText(e.target.value)}
              placeholder="Paste your full blog article here (plain text or Markdown)... The more content you provide, the better the results."
              className="w-full h-80 min-h-[20rem] p-4 bg-gray-800 border-2 border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !articleText}
              className="w-full py-4 px-6 text-lg font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Generating...' : 'Generate Assets'}
            </button>
          </div>

          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-cyan-300">2. Get Your Assets</h2>
            <div className="min-h-[24rem] flex items-center justify-center bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700 p-4">
              {isLoading && <Spinner />}
              {error && <ErrorAlert message={error} />}
              {!isLoading && !error && result && <ResultDisplay result={result} />}
              {!isLoading && !error && !result && (
                <div className="text-center text-gray-500">
                  <p className="text-lg">Your generated image and tags will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
