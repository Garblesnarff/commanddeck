
import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['COMMAND_DECK UPLINK READY. TYPE "HELP" FOR COMMANDS.']);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    let response = `COMMAND NOT RECOGNIZED: ${cmd}`;

    if (cmd === 'help') response = 'AVAILABLE: HELP, STATUS, DISCORD, GITHUB, DOCS';
    else if (cmd === 'status') response = 'SYSTEMS: OPERATIONAL // AGENTS: 42,000 ACTIVE';
    else if (cmd === 'discord') response = 'REDIRECTING TO WAR ROOM... (NOT REALLY, BUT JOIN US!)';
    else if (cmd === 'github') response = 'OPENING ARMORY... (STAR US!)';

    setHistory([...history, `> ${input}`, response]);
    setInput('');
  };

  return (
    <footer className="pt-24 pb-12 px-8 border-t border-slate-800 bg-[#020202] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 border border-cyan-400 flex items-center justify-center font-orbitron font-black text-cyan-400 text-sm italic">CD</div>
              <div className="font-orbitron font-bold text-lg">COMMAND<span className="text-cyan-400">DECK</span></div>
            </div>
            <p className="text-slate-500 max-w-sm font-rajdhani text-lg leading-relaxed mb-8">
              Empowering the next generation of AI developers with tactical observability and battlefield awareness.
            </p>
            <div className="flex gap-6 text-slate-400 font-orbitron text-[10px] tracking-widest">
              <a href="#" className="hover:text-cyan-400 transition-colors">GITHUB</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">DISCORD</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">DOCS</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">X / TWITTER</a>
            </div>
          </div>

          <div className="bg-black/50 border border-slate-800 rounded p-6 font-mono text-xs flex flex-col h-[200px] shadow-inner">
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-hide">
              {history.map((line, i) => (
                <div key={i} className={line.startsWith('>') ? 'text-cyan-400' : 'text-slate-500'}>
                  {line}
                </div>
              ))}
            </div>
            <form onSubmit={handleCommand} className="flex gap-2">
              <span className="text-cyan-400">$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-slate-200"
                placeholder="type 'help'..."
              />
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-slate-700 border-t border-slate-800/50 pt-8">
          <div>© 2150 COMMANDDECK_DEV // ALL_RIGHTS_RESERVED</div>
          <div className="flex gap-8 mt-4 md:mt-0">
             <span>PRIVACY_UPLINK</span>
             <span>TERMS_OF_ENGAGEMENT</span>
             <span className="text-cyan-900">U.E.F. CERTIFIED</span>
          </div>
        </div>
      </div>
      
      {/* Footer background decorative elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
    </footer>
  );
};

export default Footer;
