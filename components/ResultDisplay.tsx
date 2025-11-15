import React, { useState, useEffect } from 'react';
import { GenerationResult } from '../types';
import { DownloadIcon, CopyIcon, CheckIcon, ExportIcon } from './icons';

interface ResultDisplayProps {
  result: GenerationResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [sheetsCopied, setSheetsCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (sheetsCopied) {
      const timer = setTimeout(() => setSheetsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [sheetsCopied]);

  const handleCopy = () => {
    if (result?.tags) {
      navigator.clipboard.writeText(result.tags);
      setCopied(true);
    }
  };

  const handleExport = () => {
    if (result) {
      const tsvContent = `${result.imageUrl}\t${result.tags}`;
      navigator.clipboard.writeText(tsvContent);
      setSheetsCopied(true);
    }
  };

  if (!result) return null;

  return (
    <div className="w-full bg-gray-800/50 p-6 md:p-8 rounded-2xl border border-gray-700 shadow-2xl shadow-cyan-500/10 transition-all duration-500 ease-in-out transform animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-6 tracking-wide">Generated Assets</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Header Image</h3>
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700">
            <img src={result.imageUrl} alt="Generated header" className="w-full h-full object-cover" />
          </div>
          <a
            href={result.imageUrl}
            download="generated-header.png"
            className="mt-4 inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
          >
            <DownloadIcon />
            Download Image
          </a>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3">SEO Tags</h3>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex-grow bg-gray-900 text-gray-200 font-mono p-4 rounded-lg border border-gray-700 break-words">
              {result.tags}
            </div>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 inline-flex items-center justify-center px-6 py-3 font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                copied
                  ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                  : 'bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-400'
              }`}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied!' : 'Copy Tags'}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Export</h3>
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={handleExport}
              className={`inline-flex items-center justify-center w-full md:w-auto px-6 py-3 font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                sheetsCopied
                  ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                  : 'bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-400'
              }`}
            >
              {sheetsCopied ? <CheckIcon /> : <ExportIcon />}
              {sheetsCopied ? 'Copied!' : 'Copy for Sheets'}
            </button>
            <p className="text-xs text-gray-500">Copies a row (Image URL, Tags) for pasting into a spreadsheet.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultDisplay;