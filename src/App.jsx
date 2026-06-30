import React, { useState, useEffect } from 'react';
import Icon from './components/Icon';
import WelcomeScreen from './components/WelcomeScreen';
import ReaderScreen from './components/ReaderScreen';
import { BOOKS, FALLBACK_PARAGRAPHS } from './data/books';

function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [activeBookId, setActiveBookId] = useState(null);
  const [paragraphs, setParagraphs] = useState(FALLBACK_PARAGRAPHS);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("mishne_mikra_favorites");
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error(e);
      }
    }

    const storedBookmark = localStorage.getItem("mishne_mikra_bookmark");
    if (storedBookmark) {
      try {
        const { bookId, paragraphIndex } = JSON.parse(storedBookmark);
        const savedBook = BOOKS.find(b => b.id === bookId);
        if (savedBook && savedBook.isUnlocked) {
          handleLoadBook(savedBook, paragraphIndex, true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const triggerToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLoadBook = async (book, startIdx = 0, isAuto = false) => {
    if (!book.isUnlocked) return;
    setIsLoading(true);
    setErrorMessage(null);
    setActiveBookId(book.id);

    try {
      // Append a cache-busting timestamp to prevent the browser from caching old JSON data
      const response = await fetch(`/data/${book.id}.json?t=${Date.now()}`);
      
      if (!response.ok) {
        throw new Error(`Erreur de chargement local : ${response.status}`);
      }

      const rawData = await response.json();
      let parsed = [];
      if (Array.isArray(rawData)) {
        parsed = rawData;
      } else if (rawData && typeof rawData === "object") {
        const foundArr = Object.values(rawData).find(v => Array.isArray(v));
        parsed = foundArr ? foundArr : Object.values(rawData).filter(v => v && v.texte_integral);
      }

      if (parsed.length === 0) throw new Error("JSON mal formé.");

      const normalized = parsed.map(h => {
        const t = h.texte_integral || h.texteintegral || {};
        const m = h.mots_alignes || h.motsalignes || [];
        return {
          ...h,
          texte_integral: {
            hebreu_sans_voyelles: t.hebreu_sans_voyelles || t.hebreusansvoyelles || "",
            hebreu_avec_voyelles: t.hebreu_avec_voyelles || t.hebreuavecvoyelles || "",
            francais: t.francais || ""
          },
          mots_alignes: m.map(w => ({
            id: w.id,
            hebreu_brut: w.hebreu_brut || w.hebreubrut || "",
            hebreu_voyelles: w.hebreu_voyelles || w.hebreuvoyelles || "",
            francais_mot: w.francais_mot || w.francaismot || "",
            expression_contexte: w.expression_contexte || w.expressioncontexte || "",
            infinitif: w.infinitif || null
          }))
        };
      });

      setParagraphs(normalized);
      setCurrentParagraphIndex(Math.min(normalized.length - 1, Math.max(0, startIdx)));
      setCurrentScreen("reader");
      triggerToast(isAuto ? "Marque-page automatique restauré !" : `Chargement réussi !`);
    } catch (e) {
      console.warn("Utilisation du jeu de données autonome bilingue de secours...", e);
      setParagraphs(FALLBACK_PARAGRAPHS);
      setCurrentParagraphIndex(0);
      setCurrentScreen("reader");
      triggerToast("Utilisation des données locales de secours (bilingues)", "info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBook = (bookId) => {
    const book = BOOKS.find(b => b.id === bookId);
    if (book) handleLoadBook(book, 0);
  };

  const handleSelectFavorite = (fav) => {
    const book = BOOKS.find(b => b.id === fav.bookId);
    if (book && book.isUnlocked) {
      handleLoadBook(book, fav.paragraphIndex);
    }
  };

  const handleRemoveFavorite = (fav, e) => {
    e.stopPropagation();
    const filtered = favorites.filter(
      item => !(item.bookId === fav.bookId && item.paragraphIndex === fav.paragraphIndex)
    );
    setFavorites(filtered);
    localStorage.setItem("mishne_mikra_favorites", JSON.stringify(filtered));
    triggerToast("Retiré des favoris");
  };

  const handleToggleFavorite = (pIdx) => {
    const activeBook = BOOKS.find(b => b.id === activeBookId) || BOOKS[0];
    const activeParagraph = paragraphs[pIdx];
    if (!activeParagraph) return;

    const exists = favorites.some(
      fav => fav.bookId === activeBook.id && fav.paragraphIndex === pIdx
    );
    let updated = [];

    if (exists) {
      updated = favorites.filter(
        fav => !(fav.bookId === activeBook.id && fav.paragraphIndex === pIdx)
      );
      triggerToast("Retiré de vos favoris", "info");
    } else {
      updated = [...favorites, {
        bookId: activeBook.id,
        bookTitle: activeBook.title,
        chapterId: "ch-1",
        chapterTitle: "Siman 318",
        paragraphIndex: pIdx,
        seif: activeParagraph.seif || String(pIdx + 1),
        previewHebrew: activeParagraph.texte_integral.hebreu_sans_voyelles.substring(0, 45) + "...",
        previewFrench: activeParagraph.texte_integral.francais.substring(0, 70) + "...",
        savedAt: Date.now()
      }];
      triggerToast("Ajouté aux favoris !");
    }
    setFavorites(updated);
    localStorage.setItem("mishne_mikra_favorites", JSON.stringify(updated));
  };

  const handleParagraphChange = (idx) => {
    setCurrentParagraphIndex(idx);
    if (activeBookId) {
      localStorage.setItem(
        "mishne_mikra_bookmark",
        JSON.stringify({ bookId: activeBookId, paragraphIndex: idx })
      );
    }
  };

  const activeBook = BOOKS.find(b => b.id === activeBookId) || BOOKS[0];

  return (
    <div className="relative min-h-screen bg-[#0A0A0B]">
      {isLoading && (
        <div className="fixed inset-0 bg-[#0A0A0B]/95 z-55 flex flex-col items-center justify-center p-6 text-center select-none backdrop-blur-md">
          <div className="relative mb-6 animate-pulse">
            <p className="text-amber-500 font-bold font-serif text-3xl">ש</p>
          </div>
          <h2 className="text-xl font-medium tracking-tight text-zinc-100 mb-2 font-serif">Récupération des Écrits</h2>
          <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">Veuillez patienter pendant le chargement bilingue...</p>
        </div>
      )}

      {toast && (
        <div className="fixed z-50 bottom-5 right-5 pointer-events-none max-w-sm select-none">
          <div className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-850 text-zinc-100 rounded-xl py-3 px-4.5 shadow-2xl">
            <Icon name="doubleCheck" className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{toast.text}</span>
          </div>
        </div>
      )}

      {currentScreen === "welcome" ? (
        <WelcomeScreen
          books={BOOKS}
          favorites={favorites}
          onSelectBook={handleSelectBook}
          onSelectFavorite={handleSelectFavorite}
          onRemoveFavorite={handleRemoveFavorite}
        />
      ) : (
        <ReaderScreen
          bookTitle={activeBook.title}
          bookSubtitle={activeBook.subtitle}
          chapterTitle="Siman 318"
          paragraphs={paragraphs}
          currentParagraphIndex={currentParagraphIndex}
          onParagraphChange={handleParagraphChange}
          onBackToLibrary={() => setCurrentScreen("welcome")}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}

export default App;
