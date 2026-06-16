"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardPortfolio from "../Components/DashboardPortfolio";
import SoftwareResume from "../Components/SoftwareResume";

export default function DashboardPage() {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] Initiating Solar2D workspace boot sequence...",
    "[SYSTEM] Loading Box2D physics solver library...",
    "[SYSTEM] Loaded 16 game configuration profiles successfully.",
    "[SYSTEM] Ready. Type 'help' or select a shortcut button below."
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    let response: string[] = [];
    switch (trimmed) {
      case "help":
        response = [
          `> ${cmd}`,
          "Available Commands:",
          "  diagnostics - Run full telemetry check on all 16 builds",
          "  specs       - List game engine compiler and environment specs",
          "  skills      - Query developer core language and framework stacks",
          "  secret      - Access the hidden debug registers",
          "  clear       - Wipe the screen logs buffer"
        ];
        break;
      case "diagnostics":
        response = [
          `> ${cmd}`,
          "[DIAG] Star Catcher preview loop... OK (60 FPS)",
          "[DIAG] Astro Blaster auto-laser spawner... OK (60 FPS)",
          "[DIAG] Neon Breaker brick-reflection matrix... OK (60 FPS)",
          "[DIAG] Snake.lua autopilot pathfinder... OK (60 FPS)",
          "[DIAG] Tap Hopper Box2D gravity scalar... OK (60 FPS)",
          "[DIAG] Sky Racer multi-lane collider... OK (60 FPS)",
          "[SYSTEM] All 16 canvas buffers loaded into GPU RAM. 0ms lag profile verified."
        ];
        break;
      case "specs":
        response = [
          `> ${cmd}`,
          "SOLAR2D CORE PORTFOLIO SPECS:",
          "  Engine Version : Solar2D 2026.3702",
          "  Language Specs : Lua 5.1 / Luau JIT",
          "  Physics Engine : Box2D Integrator (C++)",
          "  Browser Bridge : HTML5 WebGL / Canvas2D Context",
          "  Active Buffers : 16 Canvas viewports"
        ];
        break;
      case "skills":
        response = [
          `> ${cmd}`,
          "LANGUAGES  : Lua, Java, JavaScript, TypeScript, Python, HTML5/CSS3, SQL",
          "FRAMEWORKS : Solar2D, React, Next.js, FastAPI, Spring Boot, Spring MVC",
          "SYSTEMS    : Box2D, PostgreSQL, SQLite, Git, Docker, REST APIs, Playwright"
        ];
        break;
      case "secret":
        response = [
          `> ${cmd}`,
          "  👾 SECRET SCANNER UNLOCKED 👾",
          "    .     .       .     .",
          "      \\  /   👾    \\  /",
          "       \\/           \\/",
          "     [====  SPACE INVADER  ====]",
          "       /\\           /\\",
          "      /  \\         /  \\",
          "[SUCCESS] Debug matrix unlocked. Drag sliders inside active play modal!"
        ];
        break;
      case "clear":
        setTerminalLogs([]);
        setTerminalInput("");
        return;
      default:
        response = [
          `> ${cmd}`,
          `[ERROR] Command '${cmd}' not recognized. Type 'help' for options.`
        ];
    }
    setTerminalLogs((prev) => [...prev, ...response]);
    setTerminalInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-[#e2e8f0]">
      {/* Sticky navigation header */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#15132b]/80 border-b border-white/10 select-none mb-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="brand flex items-center gap-2.5 font-sans font-black text-white text-base sm:text-lg tracking-wide">
            <svg className="h-7 w-7 flex-none" viewBox="0 0 40 40" aria-hidden="true">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#FFB23E" />
                  <stop offset="1" stopColor="#FF6B57" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="11" fill="url(#g1)" />
              <path d="M27 11a11 11 0 1 0 0 18 13 13 0 0 1 0-18z" fill="#7C6CFF" />
            </svg>
            <a href="../" className="hover:text-[#FFB23E] transition-colors">2D Game Dev</a>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <a href="../" className="px-4 py-2 rounded-full bg-[#FF6B57] hover:bg-[#ff8f80] text-[#1a1330] font-black uppercase tracking-wider transition-all">
              ◀ BACK TO PORTFOLIO
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-10">
        
        {/* Premium Cyber Terminal Header Split */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-b border-white/10 pb-8">
          
          {/* Left Profile dossier details: 7 Columns */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="logo-container flex items-center gap-3">
                <div className="logo-badge flex items-center justify-center h-10 w-10 bg-blue-600 rounded-xl text-white font-black shadow-[0_0_15px_rgba(59,130,246,0.5)]">AM</div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
                    Adi Narayana Manga
                  </h1>
                  <p className="text-[10px] sm:text-xs text-blue-400 font-black tracking-wider uppercase mt-1">
                    2D Game Developer &middot; Solar2D Specialist &middot; Systems Engineer
                  </p>
                </div>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed max-w-xl">
                I build high-performance 2D mobile games and playable worlds. Specialist in 
                <strong className="text-white"> Solar2D (Corona SDK)</strong>, 
                <strong className="text-white"> Lua scripting</strong>, and custom 
                <strong className="text-white"> Box2D physics systems</strong>. I prioritize creating tactile game feel, 
                responsive controls, and smooth 60fps animations.
              </div>
            </div>
            
            {/* Quick Contact & Status panel */}
            <div className="flex flex-wrap items-center gap-4 text-xs mt-auto">
              <div className="flex bg-slate-950/80 border border-white/5 p-1 rounded-xl shadow-inner font-mono text-[10px] sm:text-xs">
                <a 
                  href="mailto:mangaaa@mail.uc.edu" 
                  className="px-3.5 py-2 font-bold uppercase rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  ✉ Email Direct
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 font-bold uppercase rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  🐙 GitHub
                </a>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 font-bold uppercase rounded-xl text-[10px] sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                STATUS: READY FOR OPPORTUNITIES
              </div>
            </div>
          </div>

          {/* Right Interactive Console Terminal: 5 Columns */}
          <div className="lg:col-span-5 flex flex-col bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] min-h-[260px] relative group">
            {/* CRT scanline simulation overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.015] to-transparent opacity-60"></div>
            
            {/* Terminal Titlebar */}
            <div className="flex justify-between items-center bg-slate-900 border-b border-white/5 px-4 py-2 text-[10px] font-mono text-slate-400">
              <span>💻 SOLAR2D SHELL - ADI_MANGA_DOSSIER</span>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500/80"></span>
                <span className="h-2 w-2 rounded-full bg-yellow-500/80"></span>
                <span className="h-2 w-2 rounded-full bg-green-500/80"></span>
              </div>
            </div>

            {/* Terminal Logs Output Scrollbar */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] text-emerald-400 flex flex-col gap-1.5 max-h-[160px] selection:bg-emerald-800 selection:text-white">
              {terminalLogs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap leading-relaxed">
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Preset click shortcuts */}
            <div className="flex gap-1.5 px-3 py-2 bg-slate-900/50 border-t border-white/5 overflow-x-auto">
              <button 
                onClick={() => handleCommand("diagnostics")} 
                className="px-2 py-0.5 border border-emerald-500/20 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 text-[9px] font-mono font-bold uppercase rounded text-emerald-400 transition-colors"
              >
                [Diagnostics]
              </button>
              <button 
                onClick={() => handleCommand("specs")} 
                className="px-2 py-0.5 border border-blue-500/20 hover:border-blue-400 bg-blue-950/20 hover:bg-blue-950/40 text-[9px] font-mono font-bold uppercase rounded text-blue-400 transition-colors"
              >
                [Specs]
              </button>
              <button 
                onClick={() => handleCommand("secret")} 
                className="px-2 py-0.5 border border-purple-500/20 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-950/40 text-[9px] font-mono font-bold uppercase rounded text-purple-400 transition-colors"
              >
                [Secret Invader]
              </button>
              <button 
                onClick={() => handleCommand("clear")} 
                className="px-2 py-0.5 border border-slate-700 hover:border-slate-500 bg-slate-800/20 hover:bg-slate-800/40 text-[9px] font-mono font-bold uppercase rounded text-slate-400 transition-colors"
              >
                [Clear]
              </button>
            </div>

            {/* Interactive Shell Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCommand(terminalInput);
              }} 
              className="flex border-t border-white/10 bg-slate-950"
            >
              <span className="p-3 pr-1 text-emerald-400 font-mono text-[10px] select-none font-bold">&gt;</span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type command here (e.g. 'help')..."
                className="flex-1 bg-transparent p-3 pl-1 border-0 focus:outline-none text-[10px] font-mono text-emerald-300 placeholder-slate-600 focus:ring-0"
              />
            </form>
          </div>

        </header>

        {/* Main Dashboard Section */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">
              2D Worlds & Game Mechanics
            </h2>
            <p className="text-sm text-slate-400">
              Interactive showcase of 16 Solar2D builds, featuring real-time browser game runners, physics parameters tuning, and development logs.
            </p>
          </div>
          <DashboardPortfolio />
        </section>

        {/* Career Timeline Section */}
        <section className="mt-6">
          <SoftwareResume />
        </section>

        {/* Footer Info */}
        <footer className="border-t border-white/5 pt-6 pb-12 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            Hand-built with Next.js & HTML5 Canvas. Adi Narayana Manga, 2024 to 2026.
          </div>
          <div className="flex gap-4 font-semibold uppercase tracking-wider font-mono">
            <span>Engine: Solar2D (Lua)</span>
            <span>Deployments: iOS / Android / WebGL</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
