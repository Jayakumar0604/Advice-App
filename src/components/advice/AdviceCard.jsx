import React, { useEffect, useState } from 'react';
import Spinner from '../ui/Spinner';

const AdviceCard = ({
  advice,
  slipId,
  loading,
  error,
  onFetchRandom,
  isFavorite,
  onToggleFavorite,
  onCopy,
  readCount,
}) => {
  const [copied, setCopied] = useState(false);
  const [animateText, setAnimateText] = useState(false);

  // Trigger text fade animation when new advice arrives
  useEffect(() => {
    setAnimateText(true);
    const timer = setTimeout(() => setAnimateText(false), 500);
    return () => clearTimeout(timer);
  }, [advice]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${advice}" (Advice #${slipId || '?'})`);
    setCopied(true);
    if (onCopy) onCopy('Advice copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getTwitterShareUrl = () => {
    const text = encodeURIComponent(`"${advice}" - Advice #${slipId || '?'}`);
    return `https://twitter.com/intent/tweet?text=${text}`;
  };

  const getWhatsAppShareUrl = () => {
    const text = encodeURIComponent(`"${advice}" - Advice #${slipId || '?'}`);
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 py-8">
      {/* Background Neon Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl -z-10 rounded-3xl" />

      {/* Main Glassmorphic Card Container */}
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl shadow-emerald-950/20 text-center transition-all duration-300 hover:border-slate-700/60">
        
        {/* Upper Stats & Details */}
        <div className="flex justify-between items-center mb-6">
          {/* Read count badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/60 border border-slate-700/40 rounded-full text-xs font-medium text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Session count: <span className="text-emerald-400 font-semibold">{readCount}</span>
          </div>

          {/* Favoriting button */}
          {slipId && (
            <button
              onClick={onToggleFavorite}
              disabled={loading}
              className={`p-2 rounded-full border transition-all duration-300 ${
                isFavorite
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25 scale-105'
                  : 'bg-slate-800/40 border-slate-700/30 text-slate-400 hover:border-slate-600 hover:text-amber-400'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 transition-transform active:scale-75"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          )}
        </div>

        {/* Advice Slip ID */}
        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-emerald-400 mb-6 font-mono">
          {loading ? 'Seeking Wisdom...' : slipId ? `Advice #${slipId}` : 'Welcome'}
        </p>

        {/* Main Content Area */}
        <div className="min-h-[140px] flex items-center justify-center px-2 py-4 mb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" />
              <span className="text-slate-400 text-sm animate-pulse">Summoning cosmic guidance...</span>
            </div>
          ) : error ? (
            <div className="text-rose-400 p-4 rounded-2xl bg-rose-950/20 border border-rose-900/30 w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-8 h-8 mx-auto mb-2 text-rose-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="font-semibold text-sm mb-1">Failed to connect</p>
              <p className="text-xs text-rose-300/80">{error}</p>
              <button
                onClick={() => onFetchRandom()}
                className="mt-3 text-xs font-semibold px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg transition-all"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <q
              className={`text-xl md:text-2xl font-medium leading-relaxed text-slate-100 font-sans tracking-wide block transition-all duration-500 ${
                animateText ? 'opacity-0 scale-95 translate-y-1' : 'opacity-100 scale-100 translate-y-0'
              }`}
            >
              {advice}
            </q>
          )}
        </div>

        {/* Divider Graphic */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-700/60" />
          {/* Decorative pause sign in circle */}
          <div className="flex gap-2">
            <span className="w-1.5 h-4 bg-emerald-400/80 rounded-full" />
            <span className="w-1.5 h-4 bg-emerald-400/80 rounded-full" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-700/60" />
        </div>

        {/* Utility Share/Action bar */}
        {slipId && !loading && !error && (
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${
                copied
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800/40 border-slate-700/30 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
              title="Copy to clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                {copied ? (
                  <polyline points="20 6 9 17 4 12" />
                ) : (
                  <>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </>
                )}
              </svg>
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* X/Twitter Share */}
            <a
              href={getTwitterShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-700/30 bg-slate-800/40 text-slate-400 hover:text-sky-400 hover:border-sky-500/20 flex items-center justify-center transition-all"
              title="Share on X"
              aria-label="Share on X (formerly Twitter)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* WhatsApp Share */}
            <a
              href={getWhatsAppShareUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-700/30 bg-slate-800/40 text-slate-400 hover:text-green-400 hover:border-green-500/20 flex items-center justify-center transition-all"
              title="Share on WhatsApp"
              aria-label="Share on WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        )}

        {/* Trigger Button - Dice Container floating */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
          <button
            onClick={() => onFetchRandom()}
            disabled={loading}
            className={`w-14 h-14 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.7)] hover:scale-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group`}
            title="Generate random advice"
            aria-label="Generate random advice"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-6 h-6 transition-transform duration-700 group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="1.2" fill="currentColor" />
              <circle cx="15" cy="15" r="1.2" fill="currentColor" />
              <circle cx="9" cy="15" r="1.2" fill="currentColor" />
              <circle cx="15" cy="9" r="1.2" fill="currentColor" />
              <circle cx="12" cy="12" r="1.2" fill="currentColor" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdviceCard;
