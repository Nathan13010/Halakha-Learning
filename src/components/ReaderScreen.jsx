import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

const ReaderScreen = ({
  bookTitle,
  bookSubtitle,
  chapterTitle,
  paragraphs,
  currentParagraphIndex,
  onParagraphChange,
  onBackToLibrary,
  favorites,
  onToggleFavorite
}) => {
  const [readingMode, setReadingMode] = useState(3); // 1: HEB, 2: NIKOUD, 3: BILINGUE, 4: FRANÇAIS
  const [fontSize, setFontSize] = useState(18);
  const [hoveredWordId, setHoveredWordId] = useState(null);
  const [popup, setPopup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const containerRef = useRef(null);
  const wordRefs = useRef({});

  const currentParagraph = paragraphs[currentParagraphIndex] || null;
  const isFavorite = favorites.some(
    fav => fav.paragraphIndex === currentParagraphIndex
  );

  useEffect(() => {
    setPopup(null);
  }, [currentParagraphIndex, readingMode]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popup && popup.show) {
        const target = e.target;
        if (!target.closest(".clickable-word") && !target.closest(".popup-container")) {
          setPopup(null);
        }
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [popup]);

  const handleWordClick = (word, wordId) => {
    const wordElement = wordRefs.current[wordId];
    if (!wordElement || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const wordRect = wordElement.getBoundingClientRect();

    let left = wordRect.left - containerRect.left + wordRect.width / 2;
    const top = wordRect.top - containerRect.top - 8;

    const popupWidth = Math.min(320, containerRect.width * 0.90);
    const halfWidth = popupWidth / 2;
    const margin = 12;

    left = Math.max(halfWidth + margin, Math.min(left, containerRect.width - halfWidth - margin));

    setPopup({
      word,
      left,
      top,
      show: true,
    });
  };

  const searchOccurrences = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return paragraphs.map((p, idx) => {
      const hb = p.texte_integral.hebreu_sans_voyelles.toLowerCase();
      const h_avec = p.texte_integral.hebreu_avec_voyelles.toLowerCase();
      const fr = p.texte_integral.francais.toLowerCase();
      const inHebrew = hb.includes(query) || h_avec.includes(query);
      const inFrench = fr.includes(query);
      const inWords = p.mots_alignes.some(
        w => w.hebreu_brut.toLowerCase().includes(query) || 
             w.francais_mot.toLowerCase().includes(query) ||
             w.expression_contexte.toLowerCase().includes(query)
      );
      return { index: idx, matches: inHebrew || inFrench || inWords, paragraph: p };
    }).filter(item => item.matches);
  };

  const results = searchOccurrences();

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-400/35 text-zinc-100 px-0.5 rounded font-bold underline decoration-amber-500">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] flex flex-col font-sans">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLibrary}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-805 hover:bg-zinc-700 text-zinc-400 text-xs border border-zinc-700/50 cursor-pointer"
            >
              <Icon name="arrowLeft" className="w-4 h-4" />
              <span>Bibliothèque</span>
            </button>
            <div className="h-6 w-[1px] bg-zinc-700 hidden sm:block"></div>
            <div>
              <h1 className="font-medium tracking-tight text-zinc-200 text-sm md:text-base font-serif">
                {bookTitle} : {chapterTitle}
              </h1>
              <p className="text-[10px] text-zinc-500 hidden md:block italic">{bookSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
            <div className="relative flex-grow md:w-64 max-w-xs">
              <span className="absolute left-3 top-2.5 text-zinc-500">
                <Icon name="search" className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                className="bg-zinc-800/50 border border-zinc-700 rounded-full py-1.5 pl-10 pr-8 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/50 w-full text-zinc-300 placeholder-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-2.5 text-[10px] text-zinc-500 hover:text-zinc-300 uppercase font-bold"
                >
                  Effacer
                </button>
              )}
            </div>

            <button
              onClick={() => onToggleFavorite(currentParagraphIndex)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                isFavorite ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-md" : "bg-zinc-800 border-zinc-700/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
              }`}
            >
              <Icon name="star" className={`w-3.5 h-3.5 ${isFavorite ? "text-amber-500 fill-amber-500" : ""}`} />
              <span className="hidden sm:inline">{isFavorite ? "Favori" : "Sauvegarder"}</span>
            </button>

            <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
              <button onClick={() => setFontSize(p => Math.max(14, p - 2))} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                <Icon name="zoomOut" className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-zinc-300 px-1">{fontSize}px</span>
              <button onClick={() => setFontSize(p => Math.min(28, p + 2))} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                <Icon name="zoomIn" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showSearchResults && searchQuery.trim() && (
        <div className="bg-zinc-950 border-b border-zinc-850 shadow-xl overflow-hidden z-20 sticky top-15 max-h-64 overflow-y-auto px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1">
                ✦ Résultats de recherche ({results.length})
              </span>
              <button onClick={() => setShowSearchResults(false)} className="text-[10px] text-zinc-400 hover:text-white uppercase font-bold">Fermer</button>
            </div>
            {results.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 italic">Aucun résultat trouvé pour "{searchQuery}".</p>
            ) : (
              <div className="space-y-1.5 pt-1">
                {results.map((res) => (
                  <button
                    key={res.index}
                    onClick={() => {
                      onParagraphChange(res.index);
                      setShowSearchResults(false);
                    }}
                    className={`w-full text-left p-2 rounded text-xs transition-all flex items-start gap-2.5 ${res.index === currentParagraphIndex ? "bg-amber-500/10 border border-amber-500/30 text-amber-200" : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"}`}
                  >
                    <span className="font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-bold">Seïf {res.index + 1}</span>
                    <div className="flex-grow min-w-0">
                      <p className="font-serif text-[11px] truncate text-right text-zinc-400 mb-0.5" dir="rtl">{res.paragraph.texte_integral.hebreu_sans_voyelles}</p>
                      <p className="italic text-[10px] text-zinc-500 truncate">{res.paragraph.texte_integral.francais}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="bg-zinc-900/30 border-b border-zinc-800/80 px-6 py-3 sticky top-[69px] z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Chapitre</label>
              <select className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-xs font-semibold text-zinc-350 focus:outline-none">
                <option>Siman 318</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Paragraphe</label>
              <select
                value={currentParagraphIndex}
                onChange={(e) => onParagraphChange(Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
              >
                {paragraphs.map((_, idx) => (
                  <option key={idx} value={idx}>Seïf {idx + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex bg-zinc-800 rounded-lg p-1 border border-zinc-700 self-start lg:self-auto shadow-inner">
            {[
              { id: 1, label: "HEB" },
              { id: 2, label: "NIKOUD" },
              { id: 3, label: "BILINGUE" },
              { id: 4, label: "FRANÇAIS" }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setReadingMode(mode.id)}
                className={`px-3 md:px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${readingMode === mode.id ? "bg-amber-600 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button
              onClick={() => onParagraphChange(Math.max(0, currentParagraphIndex - 1))}
              disabled={currentParagraphIndex === 0}
              className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 disabled:opacity-30 cursor-pointer"
            >
              <Icon name="chevronLeft" className="w-5 h-5" />
            </button>
            <button
              onClick={() => onParagraphChange(Math.min(paragraphs.length - 1, currentParagraphIndex + 1))}
              disabled={currentParagraphIndex === paragraphs.length - 1}
              className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 disabled:opacity-30 cursor-pointer"
            >
              <Icon name="chevronRight" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <main className="flex-grow flex flex-col items-center justify-start py-6 px-4 md:px-6 relative">
        <div className="w-full max-w-2xl bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 md:p-8 space-y-6 flex flex-col relative min-h-[350px]">
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-zinc-500 select-none">
            <div className="w-1.5 h-1.5 bg-amber-500/50 rounded-full" />
            <span className="text-[8px] tracking-widest font-mono uppercase font-bold text-zinc-500">Hilkhot Chabbat</span>
          </div>
          <div className="absolute top-4 right-4 text-[9px] font-mono font-bold text-amber-500/80 uppercase tracking-widest">
            Seïf {currentParagraphIndex + 1}
          </div>

          {!currentParagraph ? (
            <div className="flex flex-col items-center justify-center p-10 text-center flex-grow">
              <Icon name="alert" className="w-10 h-10 text-amber-500 mb-3 animate-pulse" />
              <p className="text-sm text-zinc-400">Chargement de l'écrit bilingue halakhique...</p>
            </div>
          ) : (
            <div ref={containerRef} className="space-y-8 flex-grow relative pt-2">
              
              {/* CONTENEUR DE POPUP CLAMPÉ QUANT AUX COORDONNÉES DU MOT SELECTIONNÉ */}
              {popup && popup.show && (
                <div
                  style={{
                    position: "absolute",
                    left: popup.left,
                    top: popup.top,
                    transform: "translate(-50%, -100%)",
                  }}
                  className="z-40 w-[95%] max-w-[320px] md:w-80 popup-container"
                >
                  <div className="bg-zinc-800 border border-amber-500 shadow-2xl rounded-xl p-4 overflow-hidden relative mb-3">
                    <div className="flex justify-between items-start pb-2 mb-2.5 border-b border-zinc-700">
                      <div className="text-left select-none">
                        <span className="bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                          MOT-À-MOT
                        </span>
                        <p className="text-[10px] text-zinc-400 tracking-wider font-mono mt-1">
                          Réf: #{popup.word.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-hebrew-serif font-extrabold text-right text-amber-500 tracking-wide text-xl md:text-2xl" dir="rtl">
                          {popup.word.hebreu_voyelles}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 font-sans text-left">
                      <div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 block mb-0.5">
                          Traduction française
                        </span>
                        <p className="text-sm font-semibold text-zinc-100 italic">
                          {popup.word.francais_mot || "Traduction non définie"}
                        </p>
                      </div>
                      
                      <div className="h-[1px] bg-zinc-700 my-2"></div>

                      <div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 block mb-0.5">
                          Contexte d'Étude
                        </span>
                        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-2.5">
                          <p className="text-xs text-zinc-300 leading-relaxed text-left">
                            {popup.word.expression_contexte || "Aucune analyse contextuelle complémentaire."}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute h-3 w-3 bg-zinc-800 border-r border-b border-amber-500 left-1/2 -bottom-1.5 -translate-x-1/2 rotate-45" />
                  </div>
                </div>
              )}

              {/* RENDU EN FONCTION DU MODE D'ÉTUDE CHOISI */}
              {readingMode === 1 && (
                <div className="font-hebrew-serif leading-relaxed text-right pb-6 tracking-wide select-none" dir="rtl" style={{ fontSize: `${fontSize + 3}px` }}>
                  {currentParagraph.mots_alignes.map((word, idx) => {
                    const wordId = `m1-${word.id}-${idx}`;
                    const isHovered = hoveredWordId === word.id;
                    const isKeyMatched = searchQuery.trim() && word.hebreu_brut.toLowerCase().includes(searchQuery.toLowerCase().trim());
                    return (
                      <span
                        key={wordId}
                        ref={el => { if (el) wordRefs.current[wordId] = el; }}
                        onMouseEnter={() => setHoveredWordId(word.id)}
                        onMouseLeave={() => setHoveredWordId(null)}
                        onClick={() => handleWordClick(word, wordId)}
                        className={`clickable-word inline-block px-1.5 py-0.5 mx-0.5 rounded cursor-pointer transition-colors border-b-2 ${isHovered ? 'text-amber-500 bg-amber-500/10 border-amber-500' : isKeyMatched ? 'bg-amber-500/20 text-yellow-200 border-amber-500/50' : 'text-zinc-100 hover:bg-amber-500/10 border-transparent'}`}
                      >
                        {word.hebreu_brut}
                      </span>
                    );
                  })}
                </div>
              )}

              {readingMode === 2 && (
                <div className="font-hebrew-serif leading-relaxed text-right pb-6 tracking-wide select-none" dir="rtl" style={{ fontSize: `${fontSize + 4}px` }}>
                  {currentParagraph.mots_alignes.map((word, idx) => {
                    const wordId = `m2-${word.id}-${idx}`;
                    const isHovered = hoveredWordId === word.id;
                    const isKeyMatched = searchQuery.trim() && (word.hebreu_voyelles.toLowerCase().includes(searchQuery.toLowerCase().trim()) || word.hebreu_brut.toLowerCase().includes(searchQuery.toLowerCase().trim()));
                    return (
                      <span
                        key={wordId}
                        ref={el => { if (el) wordRefs.current[wordId] = el; }}
                        onMouseEnter={() => setHoveredWordId(word.id)}
                        onMouseLeave={() => setHoveredWordId(null)}
                        onClick={() => handleWordClick(word, wordId)}
                        className={`clickable-word inline-block px-1.5 py-0.5 mx-0.5 rounded cursor-pointer transition-colors border-b-2 ${isHovered ? 'text-amber-500 bg-amber-500/10 border-amber-500' : isKeyMatched ? 'bg-amber-500/20 text-yellow-200 border-amber-500/50' : 'text-zinc-100 hover:bg-amber-500/10 border-transparent'}`}
                      >
                        {word.hebreu_voyelles}
                      </span>
                    );
                  })}
                </div>
              )}

              {readingMode === 3 && (
                <div className="space-y-8 pb-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block text-right select-none">Hébreu (עִבְרִית)</span>
                    <div className="font-hebrew-serif leading-relaxed text-right tracking-wide bg-zinc-950/40 p-5 rounded-xl border border-zinc-800" dir="rtl" style={{ fontSize: `${fontSize + 2}px` }}>
                      {currentParagraph.mots_alignes.map((word, idx) => {
                        const wordId = `m3-heb-${word.id}-${idx}`;
                        const isHovered = hoveredWordId === word.id;
                        const isKeyMatched = searchQuery.trim() && (word.hebreu_voyelles.toLowerCase().includes(searchQuery.toLowerCase().trim()) || word.hebreu_brut.toLowerCase().includes(searchQuery.toLowerCase().trim()));
                        return (
                          <span
                            key={wordId}
                            ref={el => { if (el) wordRefs.current[wordId] = el; }}
                            onMouseEnter={() => setHoveredWordId(word.id)}
                            onMouseLeave={() => setHoveredWordId(null)}
                            onClick={() => handleWordClick(word, wordId)}
                            className={`clickable-word inline-block px-1.5 py-0.5 mx-0.5 rounded cursor-pointer transition-colors border-b-2 ${isHovered ? 'text-amber-500 bg-amber-500/10 border-amber-500' : isKeyMatched ? 'bg-amber-500/20 text-yellow-200 border-amber-500/50' : 'text-zinc-100 hover:bg-amber-500/10 border-transparent'}`}
                          >
                            {word.hebreu_voyelles}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block select-none">Français (Mot-à-Mot)</span>
                    <div className="leading-relaxed tracking-normal font-sans bg-zinc-950/40 p-5 rounded-xl border border-zinc-800" style={{ fontSize: `${fontSize - 2}px` }}>
                      {currentParagraph.mots_alignes.map((word, idx) => {
                        const wordId = `m3-fr-${word.id}-${idx}`;
                        const isHovered = hoveredWordId === word.id;
                        const isKeyMatched = searchQuery.trim() && word.francais_mot.toLowerCase().includes(searchQuery.toLowerCase().trim());
                        return (
                          <span
                            key={wordId}
                            ref={el => { if (el) wordRefs.current[wordId] = el; }}
                            onMouseEnter={() => setHoveredWordId(word.id)}
                            onMouseLeave={() => setHoveredWordId(null)}
                            onClick={() => handleWordClick(word, wordId)}
                            className={`clickable-word inline-block px-1 py-0.5 mx-0.5 rounded cursor-pointer transition-colors border-b-2 ${isHovered ? 'text-amber-500 bg-amber-500/10 border-amber-500' : isKeyMatched ? 'bg-amber-500/20 text-yellow-200 border-amber-500/50' : 'text-zinc-200 hover:bg-amber-500/10 border-transparent'}`}
                          >
                            {word.francais_mot}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {readingMode === 4 && (
                <div className="leading-relaxed tracking-normal font-sans pb-6 text-zinc-200 space-y-4 shadow-inner" style={{ fontSize: `${fontSize - 1}px` }}>
                  <p className="font-serif italic text-zinc-500 border-l-2 border-amber-500/40 pl-3 py-1 mb-4 text-xs md:text-sm select-none">
                    Surlignez un mot ci-dessous pour examiner sa forme hébraïque correspondante avec ses voyelles grammaticales (Nikoud).
                  </p>
                  <div>
                    {currentParagraph.mots_alignes.map((word, idx) => {
                      const wordId = `m4-${word.id}-${idx}`;
                      const isHovered = hoveredWordId === word.id;
                      const isKeyMatched = searchQuery.trim() && word.francais_mot.toLowerCase().includes(searchQuery.toLowerCase().trim());
                      return (
                        <span
                          key={wordId}
                          ref={el => { if (el) wordRefs.current[wordId] = el; }}
                          onMouseEnter={() => setHoveredWordId(word.id)}
                          onMouseLeave={() => setHoveredWordId(null)}
                          onClick={() => handleWordClick(word, wordId)}
                          className={`clickable-word inline-block px-1 py-0.5 mx-0.5 rounded cursor-pointer transition-colors border-b-2 ${isHovered ? 'text-amber-500 bg-amber-500/10 border-amber-500' : isKeyMatched ? 'bg-amber-500/20 text-yellow-200 border-amber-500/50' : 'text-zinc-200 hover:bg-amber-500/10 border-transparent'}`}
                        >
                          {word.francais_mot}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-4 py-4 opacity-30 select-none">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-500"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-500"></div>
              </div>

              <div className="pt-5 mt-5 bg-zinc-950/30 p-5 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-1.5 mb-2.5 text-zinc-500">
                  <Icon name="info" className="w-3.5 h-3.5 text-amber-500/80" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Traduction Intégrale Fluide</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic font-sans text-justify">
                  {highlightText(currentParagraph.texte_integral.francais, searchQuery)}
                </p>
              </div>

            </div>
          )}
        </div>

        <div className="w-full max-w-2xl px-6 py-3 border-t border-zinc-850 bg-zinc-900/10 text-[9px] text-zinc-500 uppercase tracking-widest font-bold flex flex-col md:flex-row items-center justify-between gap-2 mt-6 select-none">
          <div className="flex items-center gap-2">
            <Icon name="cap" className="w-4 h-4 text-amber-500/80" />
            <span>Étude bilingue progressive (Intermédiaire / Avancé)</span>
          </div>
          <span>Yalkout Yossef : Hilkhot Chabbat</span>
        </div>
      </main>
    </div>
  );
};

export default ReaderScreen;
