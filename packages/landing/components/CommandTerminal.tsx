
import React, { useState } from 'react';

const CommandTerminal: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const command = "pip install commanddeck";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#0d1117] rounded-lg border border-slate-700 overflow-hidden shadow-2xl relative">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-slate-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="mx-auto text-[10px] text-slate-500 font-orbitron tracking-widest">TERMINAL: BASH</div>
      </div>
      <div className="p-6 font-mono text-sm md:text-base text-left">
        <div className="flex items-start gap-3">
          <span className="text-cyan-400">$</span>
          <span className="text-slate-200">{command}</span>
        </div>
        <div className="flex items-start gap-3 mt-2">
          <span className="text-cyan-400">$</span>
          <span className="text-slate-200">commanddeck start</span>
          <span className="w-2 h-5 bg-cyan-400 animate-pulse inline-block align-middle ml-1" />
        </div>
      </div>
      
      <button 
        onClick={handleCopy}
        className={`absolute right-4 top-[56px] px-3 py-1.5 rounded font-orbitron text-[10px] transition-all border ${
          copied ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400'
        }`}
      >
        {copied ? 'ACKNOWLEDGED' : 'COPY_UPLINK'}
      </button>

      <div className="px-6 pb-6 text-[10px] font-mono text-slate-600">
        # Deployment target: localhost:3000
      </div>
    </div>
  );
};

export default CommandTerminal;
