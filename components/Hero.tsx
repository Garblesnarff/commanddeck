
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RTSDemo from './RTSDemo';
import CommandTerminal from './CommandTerminal';

const Hero: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-8 flex flex-col items-center text-center max-w-7xl mx-auto min-h-screen justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-4"
      >
        <div className="inline-block px-3 py-1 border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] tracking-[0.3em] font-orbitron mb-6 uppercase animate-pulse">
          STATUS: UPLINK_STABLE // VERSION 1.0.4_RELEASE
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-8xl font-black font-orbitron mb-8 leading-none tracking-tighter"
      >
        STOP READING LOGS. <br />
        <span className="text-cyan-400 relative">
          START COMMANDING.
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-cyan-400/20" />
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-2xl text-slate-400 text-lg md:text-xl font-light mb-12 font-rajdhani tracking-wide"
      >
        The RTS-style observability suite for AI Agents. 
        Visualizing the <span className="text-cyan-300 font-bold italic">Model Context Protocol</span> in real-time battlefield telemetry.
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center mt-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative group h-[400px] border border-cyan-500/30 bg-black overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.1)]"
        >
          <div className="absolute inset-0 z-0 opacity-40">
            <RTSDemo />
          </div>
          <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-cyan-400 bg-black/80 p-2 border border-cyan-500/20 backdrop-blur-sm">
             [VIDEO_FEED]: LOCAL_ENV_ALPHA <br />
             TARGET: GITHUB_ISSUE_#442 <br />
             THREAT_LEVEL: OMEGA
          </div>
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-ping" />
            <div className="font-orbitron text-[10px] text-cyan-500">LIVE_TELEMETRY</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full"
        >
          <CommandTerminal />
          <div className="mt-8 flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <img key={i} src={`https://picsum.photos/seed/${i + 10}/40/40`} className="w-10 h-10 rounded-full border-2 border-black" alt="User" />
               ))}
               <div className="w-10 h-10 rounded-full bg-cyan-900 border-2 border-black flex items-center justify-center text-[10px] font-bold text-cyan-200">+8k</div>
            </div>
            <div className="text-left">
              <div className="font-orbitron text-[10px] text-slate-500 tracking-widest">JOINED THE FRONT</div>
              <div className="text-slate-300 text-xs">8,421 Commanders deployed this week</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
