import React, { useState } from 'react';
import Spinner from '../ui/Spinner';

const SUGGESTED_TAGS = ['life', 'work', 'love', 'success', 'trust', 'family'];

const AdviceSearch = ({
  onSearch,
  searchResults,
  loading,
  error,
  onSelectAdvice,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    onSearch(tag);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-lg">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-emerald-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Search Advice Database
        </h2>

        {/* Search input field */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search wisdom (e.g., life, happiness...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title="Clear query"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700/50 border border-transparent text-slate-950 font-semibold px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-emerald-500/10 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? <Spinner size="xs" /> : 'Search'}
          </button>
        </form>

        {/* Tags Recommendation pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-slate-500 font-medium">Try tags:</span>
          {SUGGESTED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800/30 border border-slate-700/40 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/25 hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Results Panel */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 border-t border-slate-800/60">
            <Spinner size="sm" />
            <span className="text-slate-400 text-xs animate-pulse">Scouring the library...</span>
          </div>
        )}

        {/* Error / Empty state notices */}
        {!loading && error && (
          <div className="text-amber-400/90 text-xs p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Rendered Search Results */}
        {!loading && searchResults.length > 0 && (
          <div className="border-t border-slate-800/60 pt-4 max-h-[220px] overflow-y-auto custom-scrollbar flex flex-col gap-2">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
              Found {searchResults.length} advice {searchResults.length === 1 ? 'slip' : 'slips'}
            </p>
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => onSelectAdvice(result)}
                className="w-full text-left p-3 rounded-xl bg-slate-800/20 border border-slate-800/40 hover:border-emerald-500/35 hover:bg-slate-800/50 hover:shadow-sm text-slate-300 hover:text-slate-100 transition-all group flex items-start gap-2.5"
              >
                <span className="text-[10px] font-bold font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 mt-0.5">
                  #{result.id}
                </span>
                <span className="text-xs flex-1 line-clamp-2 leading-relaxed transition-all">
                  {result.advice}
                </span>
                <span className="text-slate-500 group-hover:text-emerald-400 text-xs font-semibold self-center transition-colors">
                  &rarr;
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdviceSearch;
