import React, { useState } from 'react';

const AdviceHistory = ({
  history,
  favorites,
  onSelectAdvice,
  onRemoveFavorite,
  onClearHistory,
  onCopyToast,
}) => {
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'favorites'

  const handleCopy = (e, item) => {
    e.stopPropagation(); // Avoid selecting the advice
    navigator.clipboard.writeText(`"${item.advice}"`);
    if (onCopyToast) {
      onCopyToast('Copied quotation to clipboard!');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentList = activeTab === 'history' ? history : favorites;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-lg flex flex-col min-h-[350px]">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 pb-3 mb-4 justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('history')}
              className={`text-sm font-semibold pb-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'border-emerald-400 text-slate-100'
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              History ({history.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`text-sm font-semibold pb-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'favorites'
                  ? 'border-emerald-400 text-slate-100'
                  : 'border-transparent text-slate-500 hover:text-slate-350'
              }`}
            >
              Favorites ({favorites.length})
            </button>
          </div>

          {/* Clear button for history */}
          {activeTab === 'history' && history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-450 hover:text-rose-450/80 font-medium transition-colors cursor-pointer hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-0.5 flex flex-col gap-2">
          {currentList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-10 h-10 mb-2 text-slate-650"
              >
                {activeTab === 'history' ? (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </>
                ) : (
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                )}
              </svg>
              <p className="text-xs font-semibold text-slate-450">
                {activeTab === 'history' ? 'History is currently empty' : 'No saved favorites yet'}
              </p>
              <p className="text-[10px] text-slate-550 mt-1 max-w-[200px] mx-auto">
                {activeTab === 'history'
                  ? 'Readings you fetch will populate in this timeline.'
                  : 'Star advices you love on the main card to view them here.'}
              </p>
            </div>
          ) : (
            currentList.map((item) => (
              <div
                key={`${activeTab}-${item.id}`}
                onClick={() => onSelectAdvice(item)}
                className="w-full text-left p-3 rounded-xl bg-slate-800/15 border border-slate-800/40 hover:border-slate-700/60 hover:bg-slate-800/35 transition-all group flex items-start gap-2.5 cursor-pointer relative"
              >
                {/* ID Tag */}
                <span className="text-[9px] font-bold font-mono text-slate-500 bg-slate-800 border border-slate-700/50 px-1.5 py-0.5 rounded mt-0.5">
                  #{item.id}
                </span>

                {/* Text and Date */}
                <div className="flex-1 pr-14">
                  <p className="text-xs text-slate-350 leading-relaxed font-sans line-clamp-2">
                    "{item.advice}"
                  </p>
                  {item.timestamp && activeTab === 'history' && (
                    <span className="text-[9px] text-slate-550 mt-1 block">
                      Fetched at {formatDate(item.timestamp)}
                    </span>
                  )}
                </div>

                {/* Right utility buttons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  {/* Copy Button */}
                  <button
                    onClick={(e) => handleCopy(e, item)}
                    className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/30 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copy advice text"
                    aria-label="Copy advice text"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3.5 h-3.5"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>

                  {/* Remove Button */}
                  {activeTab === 'favorites' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(item.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 border border-slate-700/30 hover:border-rose-900/30 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove from favorites"
                      aria-label="Remove from favorites"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdviceHistory;
