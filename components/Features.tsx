
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  copy: string;
  icon: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, copy, icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group relative border border-slate-700 bg-slate-900/50 p-8 hover:border-cyan-500/50 transition-all duration-300"
  >
    <div className="absolute top-0 left-0 w-8 h-px bg-cyan-500/50 group-hover:w-full transition-all" />
    <div className="absolute top-0 left-0 w-px h-8 bg-cyan-500/50 group-hover:h-full transition-all" />
    
    <div className="mb-6 text-cyan-400">
      <div className="w-12 h-12 border border-cyan-500/30 flex items-center justify-center">
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
    
    <h3 className="text-xl font-orbitron mb-4 group-hover:text-cyan-400 transition-colors">{title}</h3>
    <p className="text-slate-400 text-sm font-rajdhani leading-relaxed tracking-wide">
      {copy}
    </p>
    
    <div className="mt-8 flex items-center justify-between text-[10px] font-mono text-slate-600">
      <span>REF: MK-{(index + 1) * 100}</span>
      <span className="group-hover:text-cyan-600">ENCRYPTED_DATA</span>
    </div>
  </motion.div>
);

const Features: React.FC = () => {
  const features = [
    {
      title: "THE TERRAIN MAP",
      icon: "🗺️",
      copy: "Your file system is the battlefield. CommandDeck procedurally generates a map from your src/ folder. Watch agents physically travel to the files they read."
    },
    {
      title: "NATIVE MCP SUPPORT",
      icon: "🔌",
      copy: "Built for the Model Context Protocol. Works instantly with your existing MCP servers. No code rewrites required. Just plug and deploy."
    },
    {
      title: "REAL-TIME TELEMETRY",
      icon: "📊",
      copy: "Live feedback. See token usage, tool calls, and error rates visualized as health bars and ammo counters. Total status transparency."
    },
    {
      title: "LOCAL FIRST",
      icon: "🛡️",
      copy: "Your code stays on your machine. The visualization server runs on localhost. Zero data exfiltration. Absolute privacy, absolute control."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 relative z-10">
      <div className="text-center mb-20">
        <div className="inline-block px-3 py-1 border border-cyan-500/30 text-cyan-400 text-[10px] tracking-[0.3em] font-orbitron mb-4">
          SYSTEM_SPECIFICATIONS
        </div>
        <h2 className="text-4xl font-orbitron mb-4">TACTICAL ADVANTAGES</h2>
        <div className="w-24 h-1 bg-cyan-500/30 mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} index={i} />
        ))}
      </div>
    </div>
  );
};

export default Features;
