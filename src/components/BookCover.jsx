import React from 'react';
import Icon from './Icon';

const BookCover = ({ title, subtitle, author, coverColor, isUnlocked, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative group select-none w-48 transition-all duration-300 ${
        isUnlocked ? 'hover:-translate-y-3 cursor-pointer' : 'opacity-85 cursor-not-allowed'
      }`}
    >
      <div className={`relative w-44 h-64 rounded-r shadow-xl transition-all duration-500 ease-out ${coverColor} overflow-hidden flex flex-col justify-between p-4 text-white border-l-4 border-amber-500/30`}>
        <div className="absolute inset-2 border border-amber-400/20 rounded pointer-events-none" />
        <div className="absolute inset-3 border border-amber-400/10 rounded pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-bold opacity-[0.03] select-none pointer-events-none font-hebrew-serif">
          י
        </div>
        <div className="text-center z-10">
          <p className="text-[10px] tracking-widest uppercase text-amber-300 font-semibold">{author}</p>
          <div className="h-[2px] w-8 bg-amber-400/50 mx-auto mt-1" />
        </div>
        <div className="text-center my-auto z-10 px-1">
          <h3 className="font-serif font-bold text-lg leading-snug text-amber-100 group-hover:text-white transition-colors">{title}</h3>
          {subtitle && <p className="text-[11px] mt-1.5 text-zinc-300 font-medium line-clamp-2">{subtitle}</p>}
        </div>
        <div className="flex justify-between items-center z-10 mt-auto pt-2 border-t border-white/10">
          <Icon name="book" className="w-3.5 h-3.5 text-amber-300/80" />
          <span className="text-[9px] uppercase tracking-wider text-amber-300 font-semibold">
            {isUnlocked ? "Étudier" : "Bientôt disponible"}
          </span>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-slate-100 opacity-90 rounded-r-sm" />
        <div className="absolute -inset-full top-0 h-full w-1/2 z-50 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 transition-all duration-1000 group-hover:translate-x-full" />
      </div>
      <div className="w-40 h-3 bg-black/45 rounded-full blur-sm mx-auto mt-3 transform scale-x-95 group-hover:scale-x-105 group-hover:blur-md transition-all duration-500" />
    </div>
  );
};

export default BookCover;
