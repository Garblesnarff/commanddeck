
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Comparison from './components/Comparison';
import Features from './components/Features';
import Integration from './components/Integration';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500 selection:text-black overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none z-0" />
      
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050505]"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              className="h-1 bg-[#00f3ff] mb-4"
            />
            <div className="font-orbitron text-cyan-400 text-sm tracking-widest animate-pulse">
              INITIALIZING COMMAND_DECK UPLINK...
            </div>
            <div className="mt-8 font-mono text-xs text-slate-500">
              [SYSTEM] Booting Visualization Engine v1.0.4
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className={`relative z-10 transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-md border-b border-cyan-500/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-cyan-400 flex items-center justify-center relative">
              <div className="w-1 h-1 bg-cyan-400 absolute top-0 left-0" />
              <div className="w-1 h-1 bg-cyan-400 absolute top-0 right-0" />
              <div className="w-1 h-1 bg-cyan-400 absolute bottom-0 left-0" />
              <div className="w-1 h-1 bg-cyan-400 absolute bottom-0 right-0" />
              <span className="font-orbitron font-black text-cyan-400 text-xl italic">CD</span>
            </div>
            <div className="font-orbitron font-bold tracking-tighter text-xl">
              COMMAND<span className="text-cyan-400">DECK</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-orbitron text-xs tracking-widest text-slate-400">
            <a href="#features" className="hover:text-cyan-400 transition-colors">THE_INTEL</a>
            <a href="#integration" className="hover:text-cyan-400 transition-colors">DEPLOYMENT</a>
            <a href="#assets" className="hover:text-cyan-400 transition-colors">ASSETS</a>
            <a href="https://github.com" target="_blank" className="px-4 py-2 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">
              ENGAGE_RECON
            </a>
          </div>
        </nav>

        <section id="hero" className="min-h-screen">
          <Hero />
        </section>

        <section id="comparison" className="py-24 px-8 max-w-7xl mx-auto">
          <Comparison />
        </section>

        <section id="features" className="py-24 bg-slate-900/50 backdrop-blur-sm border-y border-cyan-500/10 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
          <Features />
        </section>

        <section id="integration" className="py-24 px-8 max-w-7xl mx-auto">
          <Integration />
        </section>

        <section id="assets" className="py-24 px-8 max-w-7xl mx-auto overflow-hidden">
          <Gallery />
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default App;
