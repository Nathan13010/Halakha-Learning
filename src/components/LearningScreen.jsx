import React, { useState } from 'react';
import Icon from './Icon';

const LearningScreen = ({ xp, onAddXp }) => {
  const [activeModuleModal, setActiveModuleModal] = useState(null);

  // Mock modules
  const modules = [
    { id: 1, title: "Bases de Chabbat", type: "theory", completed: true, icon: "star" },
    { id: 2, title: "Cuisson (Bichoul)", type: "quiz", completed: false, icon: "fire", active: true },
    { id: 3, title: "Triage (Borer)", type: "locked", completed: false, icon: "lock" },
    { id: 4, title: "Examen Final", type: "locked", completed: false, icon: "award" }
  ];

  const handleCompleteModule = () => {
    onAddXp(15);
    setActiveModuleModal(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#F3F4F6] dark:bg-[#050505]">
      {/* Top Stats Bar */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-blue-500 font-bold bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
            <span>{xp} XP</span>
          </div>
        </div>
        <div className="flex -space-x-2">
          {/* Mock friends avatars */}
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold">JD</div>
          <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-700 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold">AL</div>
          <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-700 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold">+3</div>
        </div>
      </div>

      {/* Path View */}
      <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center">
        {/* Decorative Path Line */}
        <div className="absolute top-8 bottom-8 w-2 bg-zinc-200 dark:bg-zinc-800 left-1/2 -translate-x-1/2 z-0 rounded-full" />
        
        {/* Modules */}
        <div className="z-10 w-full max-w-sm space-y-12">
          {modules.map((mod, index) => {
            // Alternate left/right alignment slightly for a winding path effect
            const offsetClass = index % 2 === 0 ? "ml-auto" : "mr-auto";
            
            return (
              <div key={mod.id} className={`flex flex-col items-center w-24 ${offsetClass}`} style={{ transform: `translateX(${index % 2 === 0 ? '-20px' : '20px'})` }}>
                <div className="text-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                    {mod.title}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    if (mod.type !== 'locked' && !mod.completed) {
                      setActiveModuleModal(mod);
                    }
                  }}
                  disabled={mod.type === 'locked'}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg border-4
                    ${mod.completed 
                      ? 'bg-amber-500 border-amber-400 text-white shadow-amber-500/20' 
                      : mod.active 
                        ? 'bg-blue-500 border-blue-400 text-white shadow-blue-500/30 ring-4 ring-blue-500/20' 
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 shadow-none'
                    }`}
                >
                  {/* Pseudo-3D effect using inner box shadow */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)] pointer-events-none" />
                  
                  {mod.icon === 'star' && <Icon name="star" className="w-8 h-8" />}
                  {mod.icon === 'fire' && <Icon name="fire" className="w-8 h-8" />}
                  {mod.icon === 'lock' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  )}
                  {mod.icon === 'award' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                  )}

                  {mod.completed && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-zinc-900 border-2 border-amber-500 rounded-full flex items-center justify-center">
                      <Icon name="doubleCheck" className="w-3 h-3 text-amber-500" />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Modal */}
      {activeModuleModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-blue-500 text-white p-6 relative">
              <button 
                onClick={() => setActiveModuleModal(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <Icon name="close" className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-1 block">Leçon Interactive</span>
              <h2 className="text-2xl font-serif font-bold">{activeModuleModal.title}</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  Quel principe s'applique lorsqu'on place un aliment solide déjà cuit sur une plaque chauffante pendant Chabbat ?
                </p>
                <div className="space-y-2">
                  <button className="w-full text-left p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-zinc-300 dark:border-zinc-600 group-hover:border-blue-500 flex items-center justify-center"></div>
                      <span className="text-sm font-medium dark:text-zinc-200">C'est interdit car cela ressemble à une cuisson.</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-4 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-zinc-300 dark:border-zinc-600 group-hover:border-blue-500 flex items-center justify-center"></div>
                      <span className="text-sm font-medium dark:text-zinc-200">Ain Bichoul Ahar Bichoul Bédavar Yavech (Il n'y a pas de cuisson après cuisson pour un solide).</span>
                    </div>
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleCompleteModule}
                className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow-[0_4px_0_rgb(37,99,235)] active:shadow-none active:translate-y-1 transition-all"
              >
                Vérifier ma réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningScreen;
