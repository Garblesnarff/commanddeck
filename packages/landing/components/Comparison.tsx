
import React from 'react';
import { motion } from 'framer-motion';

const Comparison: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-red-500 font-orbitron text-[10px] tracking-[0.4em] mb-4">THE_OLD_WAY</div>
        <h2 className="text-3xl font-orbitron mb-6">THE FOG OF TEXT</h2>
        <p className="text-slate-400 mb-8 leading-relaxed font-rajdhani text-lg">
          Your agents are running in the dark. You don't know if they are stuck, looping, 
          or hallucinating until the bill arrives. Analyzing nested JSON logs in a standard 
          CLI is like fighting a war with a spreadsheet.
        </p>
        <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-lg opacity-60 filter grayscale group hover:grayscale-0 transition-all">
          <pre className="text-[10px] md:text-[11px] font-mono text-red-300 overflow-x-auto">
{`{
  "trace_id": "8f3a-22d1",
  "agent_status": "searching",
  "error": "recursion_limit_exceeded",
  "tool_calls": [
    {"name": "search", "params": {"query": "how to fix bug"}},
    {"name": "search", "params": {"query": "how to fix bug"}},
    {"name": "search", "params": {"query": "how to fix bug"}}
  ],
  "latency": "14520ms"
}`}
          </pre>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-cyan-500 font-orbitron text-[10px] tracking-[0.4em] mb-4">THE_COMMAND_DECK_WAY</div>
        <h2 className="text-3xl font-orbitron mb-6">BATTLEFIELD AWARENESS</h2>
        <p className="text-slate-400 mb-8 leading-relaxed font-rajdhani text-lg">
          See the truth. Watch agents traverse your codebase, attack issues, 
          and gather resources (context) in 60FPS. CommandDeck procedurally 
          maps your repo into a tactical terrain.
        </p>
        <div className="relative border border-cyan-500/50 bg-black aspect-video flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.2)]">
           <img src="https://picsum.photos/seed/deck-ui/800/450" alt="UI" className="object-cover opacity-80" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
             {/* Tactical Overlays */}
             <div className="absolute top-4 right-4 w-24 h-24 border border-cyan-500/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
               <div className="w-1 h-12 bg-cyan-500/40" />
             </div>
           </div>
           <div className="absolute bottom-4 left-4 font-mono text-[9px] text-cyan-400">
             // AGENT_FLEET_CONNECTED: 4 <br />
             // RESOURCE_EXTRACTION: 82%
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Comparison;
