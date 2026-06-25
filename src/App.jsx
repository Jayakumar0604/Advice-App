import React, { useEffect, useState } from 'react';
import { useAdvice } from './hooks/useAdvice';
import AdviceCard from './components/advice/AdviceCard';
import AdviceSearch from './components/advice/AdviceSearch';
import AdviceHistory from './components/advice/AdviceHistory';
import {
  getHistory,
  getFavorites,
  saveHistory,
  saveFavorite,
  removeFavorite,
  clearHistory,
} from './utils/storage';

const App = () => {
  const {
    advice,
    slipId,
    loading,
    error,
    searchResults,
    searchLoading,
    searchError,
    fetchRandomAdvice,
    fetchAdviceById,
    searchAdvice,
    loadLocalAdvice,
  } = useAdvice();

  // Local storage state syncing
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const [toast, setToast] = useState(null);

  // Initialize history, favorites, and load first random advice
  useEffect(() => {
    const localHist = getHistory();
    const localFavs = getFavorites();
    setHistory(localHist);
    setFavorites(localFavs);

    // Initial fetch of advice
    fetchRandomAdvice((slip) => {
      setHistory(saveHistory(slip));
      setReadCount(1);
    });
  }, [fetchRandomAdvice]);

  // Show temporary toast message
  const triggerToast = (message) => {
    setToast(message);
    const timer = setTimeout(() => {
      setToast(null);
    }, 2500);
    return () => clearTimeout(timer);
  };

  const handleFetchRandom = () => {
    fetchRandomAdvice((slip) => {
      setHistory(saveHistory(slip));
      setReadCount((c) => c + 1);
    });
  };

  const handleSelectAdvice = (item) => {
    loadLocalAdvice(item);
    setHistory(saveHistory(item));
    
    // Scroll smoothly to top on mobile when item is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast(`Loaded advice #${item.id}`);
  };

  const handleToggleFavorite = () => {
    if (!slipId) return;
    const isCurrentFav = favorites.some((fav) => fav.id === slipId);
    
    if (isCurrentFav) {
      const updated = removeFavorite(slipId);
      setFavorites(updated);
      triggerToast('Removed from favorites.');
    } else {
      const updated = saveFavorite({ id: slipId, advice });
      setFavorites(updated);
      triggerToast('Saved to favorites!');
    }
  };

  const handleRemoveFavorite = (id) => {
    const updated = removeFavorite(id);
    setFavorites(updated);
    triggerToast('Removed from favorites.');
  };

  const handleClearHistory = () => {
    const confirmClear = window.confirm('Are you sure you want to clear your advice history?');
    if (confirmClear) {
      const updated = clearHistory();
      setHistory(updated);
      triggerToast('History cleared.');
    }
  };

  const isCurrentFavorite = favorites.some((fav) => fav.id === slipId);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative selection:bg-emerald-500/25 selection:text-emerald-300">
      
      {/* Toast Notification Box */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-slate-900 border border-slate-700/80 text-slate-100 px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {toast}
          </div>
        </div>
      )}

      {/* Modern Top Header Nav */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Holographic Glowing App Logo */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-5 h-5 text-slate-950"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                Daily Wisdom
              </h1>
              <p className="text-[10px] text-slate-500 font-medium font-sans">Interactive advice client</p>
            </div>
          </div>
          
          {/* External Links */}
          <div className="flex gap-4">
            <a
              href="https://api.adviceslip.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-350 transition-colors font-medium hover:underline"
            >
              API Docs
            </a>
          </div>
        </div>
      </header>

      {/* Main Grid Viewport */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Showcase Panel (Col Span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-center min-h-[450px]">
            <AdviceCard
              advice={advice}
              slipId={slipId}
              loading={loading}
              error={error}
              onFetchRandom={handleFetchRandom}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
              onCopy={triggerToast}
              readCount={readCount}
            />
          </div>

          {/* Interactive Search & History Panels (Col Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <AdviceSearch
              onSearch={searchAdvice}
              searchResults={searchResults}
              loading={searchLoading}
              error={searchError}
              onSelectAdvice={handleSelectAdvice}
            />

            <AdviceHistory
              history={history}
              favorites={favorites}
              onSelectAdvice={handleSelectAdvice}
              onRemoveFavorite={handleRemoveFavorite}
              onClearHistory={handleClearHistory}
              onCopyToast={triggerToast}
            />
          </div>

        </div>
      </main>

      {/* Footer Details */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Daily Wisdom App. Built with React & Tailwind CSS.</p>
          <p className="flex items-center gap-1">
            Powered by the public open-source
            <a
              href="https://api.adviceslip.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-450 hover:underline hover:text-emerald-400 font-semibold"
            >
              Advice Slip API
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;