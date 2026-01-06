
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const assets = [
  {
    name: "THE SCRAPER",
    role: "SCOUT UNIT",
    desc: "Fast, lightweight units designed for web exploration and rapid data collection. Highly evasive.",
    img: "https://picsum.photos/seed/scraper/400/500",
    stats: { speed: 90, fire: 10, armor: 20 }
  },
  {
    name: "THE CODER",
    role: "MARINE UNIT",
    desc: "Standard issue unit specialized in logic execution and file manipulation. Equipped with high-precision lasers.",
    img: "https://picsum.photos/seed/coder/400/500",
    stats: { speed: 50, fire: 70, armor: 50 }
  },
  {
    name: "THE ARCHITECT",
    role: "TANK UNIT",
    desc: "Slow, expensive, heavy impact units for large-scale codebase refactoring and structural changes.",
    img: "https://picsum.photos/seed/architect/400/500",
    stats: { speed: 20, fire: 90, armor: 100 }
  },
  {
    name: "THE BUG",
    role: "ALIEN THREAT",
    desc: "Target units representing GitHub issues or runtime errors. Must be eliminated to complete the mission.",
    img: "https://picsum.photos/seed/bug/400/500",
    stats: { speed: 60, fire: 40, armor: 60 }
  }
];

const Gallery: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <div className="inline-block px-3 py-1 border border-cyan-500/30 text-cyan-400 text-[10px] tracking-[0.3em] font-orbitron mb-4">
            FIELD_ASSETS
          </div>
          <h2 className="text-4xl font-orbitron">UNIT CLASSES</h2>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          {assets.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-12 h-2 transition-all ${active === i ? 'bg-cyan-500 w-16' : 'bg-slate-800'}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] overflow-hidden border border-slate-800 bg-slate-900 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={assets[active].img}
              alt={assets[active].name}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8">
            <div className="text-cyan-500 font-orbitron text-[10px] tracking-[0.4em] mb-2">{assets[active].role}</div>
            <h3 className="text-4xl font-black font-orbitron">{assets[active].name}</h3>
          </div>
          {/* Tactical Frame */}
          <div className="absolute inset-4 border border-cyan-500/10 pointer-events-none" />
        </div>

        <div className="space-y-8">
          <motion.div
            key={`desc-${active}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <p className="text-xl text-slate-300 font-rajdhani leading-relaxed italic">
              "{assets[active].desc}"
            </p>

            <div className="space-y-4">
              {Object.entries(assets[active].stats).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between font-orbitron text-[10px] text-slate-500 mb-1 uppercase tracking-widest">
                    <span>{key}</span>
                    <span>{val}%</span>
                  </div>
                  <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      className="h-full bg-cyan-400"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-800">
               <button className="px-8 py-3 bg-cyan-500 text-black font-orbitron text-xs font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                  VIEW_SCHEMATICS
               </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
