import React from 'react';
import Icon from './Icon';
import BookCover from './BookCover';

const WelcomeScreen = ({ books, favorites, onSelectBook, onSelectFavorite, onRemoveFavorite }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] flex flex-col justify-between py-12 px-6 md:px-8 font-sans">
      <header className="max-w-6xl mx-auto w-full mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-semibold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase mb-5 shadow-sm">
          <Icon name="cap" className="w-4 h-4" />
          <span>Étude Talmudique & Halakhique</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100 mb-4 font-serif">
          Mishné <span className="text-amber-500">Mikra</span>
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base font-light">
          Analyse interactive des textes bilingues hébreu/français. Cliquez ou tapotez sur n'importe quel mot pour obtenir sa traduction contextuelle et grammaticale.
        </p>
      </header>

      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 flex-grow">
        <div className="lg:col-span-3 space-y-8 flex flex-col">
          <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
            <Icon name="library" className="w-4 h-4 text-amber-500/80" />
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Votre Bibliothèque</h2>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700 font-mono font-bold ml-auto select-none">
              {books.length} LIVRE(S)
            </span>
          </div>

          <div className="space-y-12 py-4">
            <div className="relative pt-6 pb-4 px-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl shadow-inner flex flex-wrap justify-center sm:justify-start gap-8">
              {books.map((book) => (
                <BookCover
                  key={book.id}
                  title={book.title}
                  subtitle={book.subtitle}
                  author={book.author}
                  coverColor={book.coverColor}
                  isUnlocked={book.isUnlocked}
                  onClick={() => book.isUnlocked && onSelectBook(book.id)}
                />
              ))}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-zinc-800 rounded-b-2xl border-t border-zinc-700 pointer-events-none z-10 shadow" />
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 mt-auto">
            <h3 className="text-xs uppercase tracking-widest text-zinc-450 font-bold flex items-center gap-1.5 mb-2.5 select-none">
              <Icon name="info" className="w-4 h-4 text-amber-500" />
              Comment étudier ?
            </h3>
            <ul className="text-xs text-zinc-400 space-y-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-amber-500/80">✦</span>
                <span>Sélectionnez un ouvrage débloqué (notamment le volume <strong className="text-zinc-200">Yalkout Yossef - Hilkhot Chabbat</strong>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500/80">✦</span>
                <span>Basculez entre les différents modes dans la barre d'outils (Hébreu pur, avec Nikoud, Bilingue, ou Français).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500/80">✦</span>
                <span>Touchez tout terme pour obtenir sa traduction française exacte accompagnée d'analyses halakhiques contextuelles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500/80">✦</span>
                <span>Sauvegardez vos paragraphes importants pour les retrouver instantanément ici en mode révision.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col h-full">
          <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800 mb-4">
            <Icon name="star" className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Favoris</h2>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700 font-mono font-bold ml-auto select-none">
              {favorites.length}
            </span>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 flex-grow flex flex-col justify-start max-h-[460px] lg:max-h-full overflow-y-auto">
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-2 my-auto select-none">
                <Icon name="star" className="w-6 h-6 text-zinc-700 mb-3" />
                <p className="text-xs text-zinc-400 font-medium">Aucun paragraphe sauvegardé</p>
                <p className="text-[10px] text-zinc-600 mt-1 max-w-[180px] leading-relaxed">
                  Cliquez sur l'icône étoile ★ dans le lecteur pour ajouter un paragraphe à vos favoris.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((fav, index) => (
                  <div
                    key={index}
                    onClick={() => onSelectFavorite(fav)}
                    className="p-3 bg-zinc-900/40 hover:bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 rounded-lg group cursor-pointer transition-all duration-200 text-left relative"
                  >
                    <button
                      onClick={(e) => onRemoveFavorite(fav, e)}
                      className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-red-500/10 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      title="Supprimer des favoris"
                    >
                      <Icon name="trash" className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider block mb-1">
                      {fav.bookTitle} • Seïf {fav.paragraphIndex + 1}
                    </span>
                    <p className="text-sm text-zinc-200 font-medium line-clamp-1 mb-1 font-hebrew text-right" dir="rtl">
                      {fav.previewHebrew}
                    </p>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 italic leading-relaxed">
                      {fav.previewFrench}
                    </p>
                    <div className="flex justify-end items-center mt-3 pt-1.5 border-t border-zinc-800/50 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] text-amber-600/80 font-bold uppercase tracking-wider flex items-center gap-0.5">
                        Étudier &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto w-full text-center border-t border-zinc-800/85 pt-6 text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 Mishné Mikra • Yalkout Yossef Interactif</span>
        <span className="text-zinc-600">Localisation LocalStorage sécurisée • Étude moderne de la Halakha</span>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
