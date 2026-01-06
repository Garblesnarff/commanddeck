
import React from 'react';
import { motion } from 'framer-motion';

const Integration: React.FC = () => {
  return (
    <div className="relative">
      <div className="text-center mb-20">
        <div className="inline-block px-3 py-1 border border-cyan-500/30 text-cyan-400 text-[10px] tracking-[0.3em] font-orbitron mb-4">
          INITIALIZING_UPLINK...
        </div>
        <h2 className="text-4xl font-orbitron mb-4">THREE STEPS TO COMMAND</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative pl-12 border-l border-slate-800"
        >
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#050505] border-2 border-cyan-500 flex items-center justify-center font-orbitron text-cyan-400 text-xs shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            01
          </div>
          <h3 className="font-orbitron text-xl mb-4 text-cyan-400">DEPLOY PACKAGE</h3>
          <p className="text-slate-400 text-sm mb-6 font-rajdhani">Install the core commander suite via pip into your environment.</p>
          <div className="bg-slate-900 border border-slate-700 p-4 font-mono text-xs rounded">
            <span className="text-cyan-400">$</span> pip install commanddeck
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative pl-12 border-l border-slate-800"
        >
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#050505] border-2 border-cyan-500 flex items-center justify-center font-orbitron text-cyan-400 text-xs shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            02
          </div>
          <h3 className="font-orbitron text-xl mb-4 text-cyan-400">ACTIVATE TRACKING</h3>
          <p className="text-slate-400 text-sm mb-6 font-rajdhani">Import the sidecar and wrap your agent instance with the telemetry tracker.</p>
          <div className="bg-slate-900 border border-slate-700 p-4 font-mono text-xs rounded">
            <span className="text-purple-400">from</span> commanddeck <span className="text-purple-400">import</span> track <br />
            track(my_agent)
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative pl-12 border-l border-slate-800"
        >
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#050505] border-2 border-cyan-500 flex items-center justify-center font-orbitron text-cyan-400 text-xs shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            03
          </div>
          <h3 className="font-orbitron text-xl mb-4 text-cyan-400">EXECUTE MISSION</h3>
          <p className="text-slate-400 text-sm mb-6 font-rajdhani">Open the local war room and witness your agent fleet in action.</p>
          <div className="bg-slate-900 border border-slate-700 p-4 font-mono text-xs rounded">
            <span className="text-cyan-400">$</span> commanddeck start
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Integration;
