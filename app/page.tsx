"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardPortfolio from "./Components/DashboardPortfolio";
import SoftwareResume from "./Components/SoftwareResume";
import HeroCabinet from "./Components/HeroCabinet";
import EditBay from "./Components/EditBay";

export default function Home() {
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
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#050507]/90 border-b border-white/5 select-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="brand flex items-center gap-2.5 font-sans font-black text-white text-base sm:text-lg tracking-wide">
            <svg className="h-7 w-7 flex-none" viewBox="0 0 40 40" aria-hidden="true">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#E5A93B" />
                  <stop offset="1" stopColor="#A47E3C" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="11" fill="url(#g1)" />
              <path d="M27 11a11 11 0 1 0 0 18 13 13 0 0 1 0-18z" fill="#050507" />
            </svg>
            <span className="tracking-wider font-extrabold uppercase text-sm sm:text-base">
              <span className="hidden sm:inline">Adi Narayana Manga</span>
              <span className="inline sm:hidden">Adi Manga</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono">
            <a href="#library" className="px-2.5 py-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all uppercase font-bold">Games</a>
            <a href="#journey" className="px-2.5 py-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all uppercase font-bold">Journey</a>
            <a href="#engine" className="px-2.5 py-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all uppercase font-bold">Engine</a>
            <a href="#editbay" className="px-2.5 py-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all uppercase font-bold">Video</a>
            <a href="dashboard" className="px-3 py-1.5 rounded-full text-[#E5A93B] hover:text-white hover:bg-white/5 transition-all uppercase font-bold border border-[#E5A93B]/20 bg-[#E5A93B]/5">Dashboard</a>
            <a href="#contact" className="px-4 py-2 rounded-full bg-[#E5A93B] hover:bg-[#ffc266] text-[#050507] font-black uppercase tracking-wider transition-all ml-1.5 sm:ml-3">Hire me</a>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-16">
        
        {/* Premium Cyber Terminal Header Split */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b border-white/5 pb-10">
          
          {/* Left Profile dossier details: 7 Columns */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">
              {/* Category Prefix Line */}
              <div className="flex items-center gap-2 text-[#E5A93B] font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase select-none opacity-90">
                <span className="w-6 h-[1px] bg-[#E5A93B]/40"></span>
                <span>2D</span>
                <span>·</span>
                <span>3D</span>
                <span>·</span>
                <span>Physics</span>
                <span>·</span>
                <span>Games</span>
                <span>·</span>
                <span>Lua</span>
              </div>
              
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-serif tracking-tight text-white leading-none font-normal">
                  Adi Narayana <br />
                  <span className="font-serif italic text-[#E5A93B]">Manga</span>
                </h1>
                <p className="text-[10px] sm:text-xs text-[#E5A93B] font-mono tracking-[0.2em] uppercase mt-4">
                  2D Game Developer &middot; Systems Engineer
                </p>
              </div>

              <div className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-light">
                I make small mobile games with the <strong className="text-white font-medium">Solar2D</strong> engine and <strong className="text-white font-medium">Lua</strong>. Everything on this page is live and running in your browser, so go ahead and <strong className="text-white font-medium">tap a screen to play.</strong>
              </div>

              {/* Action Buttons styled like reference site */}
              <div className="flex flex-wrap gap-4 mt-2">
                <a 
                  href="#library" 
                  className="px-6 py-3 bg-[#E5A93B] hover:bg-[#ffc266] text-[#050507] font-black uppercase text-xs tracking-wider rounded transition-all font-mono shadow-[0_4px_15px_rgba(229,169,59,0.15)]"
                >
                  View My Work
                </a>
                <a 
                  href="#contact" 
                  className="px-6 py-3 border border-[#E5A93B]/30 hover:border-[#E5A93B] text-[#E5A93B] hover:bg-[#E5A93B]/5 font-bold uppercase text-xs tracking-wider rounded transition-all font-mono"
                >
                  Get In Touch
                </a>
              </div>
            </div>
            
            {/* Quick Contact & Status panel */}
            <div className="flex flex-wrap items-center gap-4 text-xs mt-auto pt-4">
              <div className="flex bg-[#0d0d10] border border-white/5 p-1 rounded-xl shadow-inner font-mono text-[10px]">
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
              
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-950/10 border border-[#E5A93B]/15 text-[#E5A93B] font-bold uppercase rounded-xl text-[10px] font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E5A93B] animate-ping"></span>
                STATUS: READY FOR OPPORTUNITIES
              </div>
            </div>
          </div>

          {/* Right Interactive Console Terminal: 5 Columns */}
          <div className="lg:col-span-5 flex flex-col bg-[#0d0d10] border border-white/5 rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)] min-h-[260px] relative group crt-screen">
            {/* CRT scanline simulation overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.01] to-transparent opacity-60"></div>
            
            {/* Terminal Titlebar */}
            <div className="flex justify-between items-center bg-[#070709] border-b border-white/5 px-4 py-2.5 text-[9px] font-mono text-slate-400">
              <span className="tracking-wide">💻 SOLAR2D SHELL - ADI_MANGA_DOSSIER</span>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500/80"></span>
                <span className="h-2 w-2 rounded-full bg-yellow-500/80"></span>
                <span className="h-2 w-2 rounded-full bg-green-500/80"></span>
              </div>
            </div>

            {/* Terminal Logs Output Scrollbar */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] text-[#FFB23E] crt-text flex flex-col gap-1.5 max-h-[160px] selection:bg-[#E5A93B]/30 selection:text-white">
              {terminalLogs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap leading-relaxed">
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Preset click shortcuts */}
            <div className="flex gap-1.5 px-3 py-2 bg-[#070709]/50 border-t border-white/5 overflow-x-auto">
              <button 
                onClick={() => handleCommand("diagnostics")} 
                className="px-2 py-0.5 border border-[#E5A93B]/10 hover:border-[#E5A93B] bg-[#E5A93B]/5 hover:bg-[#E5A93B]/10 text-[9px] font-mono font-bold uppercase rounded text-[#E5A93B] transition-colors"
              >
                [Diagnostics]
              </button>
              <button 
                onClick={() => handleCommand("specs")} 
                className="px-2 py-0.5 border border-[#E5A93B]/10 hover:border-[#E5A93B] bg-[#E5A93B]/5 hover:bg-[#E5A93B]/10 text-[9px] font-mono font-bold uppercase rounded text-[#E5A93B] transition-colors"
              >
                [Specs]
              </button>
              <button 
                onClick={() => handleCommand("secret")} 
                className="px-2 py-0.5 border border-[#E5A93B]/10 hover:border-[#E5A93B] bg-[#E5A93B]/5 hover:bg-[#E5A93B]/10 text-[9px] font-mono font-bold uppercase rounded text-[#E5A93B] transition-colors"
              >
                [Secret Invader]
              </button>
              <button 
                onClick={() => handleCommand("clear")} 
                className="px-2 py-0.5 border border-white/10 hover:border-slate-400 bg-white/5 hover:bg-white/10 text-[9px] font-mono font-bold uppercase rounded text-slate-400 transition-colors"
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
              className="flex border-t border-white/5 bg-[#070709]"
            >
              <span className="p-3 pr-1 text-[#E5A93B] font-mono text-[10px] select-none font-bold">&gt;</span>
              <input 
                type="text" 
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type command here (e.g. 'help')..."
                className="flex-1 bg-transparent p-3 pl-1 border-0 focus:outline-none text-[10px] font-mono text-[#E5A93B] placeholder-slate-600 focus:ring-0"
              />
            </form>
          </div>

        </header>

        {/* Playable Star Catcher Arcade Centerpiece */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 border-l-2 border-[#FFB23E] pl-3">
            <span className="font-mono text-[10px] text-[#FFB23E] tracking-widest font-black uppercase">
              🎮 STAR CATCHER CABINET
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Interactive Arcade Showcase
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Press start to collect falling stars and dodge incoming meteor payloads using mouse coordinates, or watch the autopilot AI run in attract mode.
            </p>
          </div>
          <HeroCabinet />
        </section>

        {/* ABOUT / PLAYER CARD SECTION */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/10 pt-12 items-stretch">
          
          {/* Left: Player Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-gradient-to-br from-[#241F4B]/60 to-[#1B1838]/60 border border-[#332C5E] rounded-3xl p-6 relative overflow-hidden backdrop-blur-md justify-between shadow-lg pro-card-glow hover:translate-y-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(255,178,62,0.12)_0%,transparent_70%)] pointer-events-none"></div>
            
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="avatar h-16 w-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#7C6CFF] to-[#FF6B57] text-[#13102a] text-2xl font-black font-sans shadow-md">
                  A
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Developer Profile</h3>
                  <p className="text-xs text-[#FFB23E] font-mono tracking-wider mt-1 uppercase">2D Game Developer · Solar2D Specialist</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-8">
                I started learning Solar2D back in <b>2024</b> and haven't really stopped since. Most of what I make is small stuff: arcade shooters, match puzzles, endless runners, a couple of physics toys. The thing I keep chasing is <b>good game feel</b>, controls that respond right away and still hit 60fps on a cheap phone. Lua makes prototyping quick, and Solar2D's physics, composer and widget libraries are what actually get things finished.
              </p>
            </div>

            {/* Skill Capability Bars */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Solar2D Engine</span>
                  <span className="text-[#FFB23E]">Expert (94%)</span>
                </div>
                <div className="h-2 bg-[#15122e] border border-[#332C5E] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FFB23E] to-[#FF6B57] rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Lua Scripting</span>
                  <span className="text-[#FFB23E]">Advanced (90%)</span>
                </div>
                <div className="h-2 bg-[#15122e] border border-[#332C5E] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FFB23E] to-[#FF6B57] rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Game Physics & Feel</span>
                  <span className="text-[#FFB23E]">Advanced (86%)</span>
                </div>
                <div className="h-2 bg-[#15122e] border border-[#332C5E] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FFB23E] to-[#FF6B57] rounded-full" style={{ width: "86%" }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Sprite & UI Design</span>
                  <span className="text-[#FFB23E]">Strong (80%)</span>
                </div>
                <div className="h-2 bg-[#15122e] border border-[#332C5E] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FFB23E] to-[#FF6B57] rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Code Block & Day Job Note (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Syntax Highlighted Lua Box */}
            <div className="code bg-[#0e0c22] border border-[#332C5E] rounded-3xl p-5 overflow-hidden shadow-inner pro-card-glow hover:translate-y-0">
              <div className="cbar flex gap-1.5 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B57]"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFB23E]"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#5BE2A0]"></span>
              </div>
              <pre className="text-[11px] font-mono leading-relaxed text-[#c9c4ef] overflow-x-auto select-none">
                <span className="text-slate-500">-- Solar2D · main.lua</span><br/>
                <span className="text-[#7C6CFF]">local</span> physics = <span className="text-[#FFB23E]">require</span>(<span className="text-[#5BE2A0]">"physics"</span>)<br/>
                physics.<span className="text-[#FFB23E]">start</span>()<br/><br/>
                <span className="text-[#7C6CFF]">local</span> hero = display.<span className="text-[#FFB23E]">newImageRect</span>(<span className="text-[#5BE2A0]">"ship.png"</span>, <span className="text-[#FF6B57]">64</span>, <span className="text-[#FF6B57]">64</span>)<br/>
                hero.x, hero.y = display.contentCenterX, <span className="text-[#FF6B57]">480</span><br/>
                physics.<span className="text-[#FFB23E]">addBody</span>(hero, <span className="text-[#5BE2A0]">"dynamic"</span>, &#123; radius = <span className="text-[#FF6B57]">28</span> &#125;)<br/><br/>
                <span className="text-[#7C6CFF]">local function</span> <span className="text-[#FFB23E]">onTap</span>(e)<br/>
                &nbsp;&nbsp;hero:<span className="text-[#FFB23E]">applyLinearImpulse</span>(<span className="text-[#FF6B57]">0</span>, <span className="text-[#FF6B57]">-0.6</span>, hero.x, hero.y)<br/>
                <span className="text-[#7C6CFF]">end</span><br/>
                Runtime:<span className="text-[#FFB23E]">addEventListener</span>(<span className="text-[#5BE2A0]">"tap"</span>, onTap)
              </pre>
            </div>

            {/* Day Job Note */}
            <div className="note bg-[#1B1838] border border-[#332C5E] rounded-3xl p-5 shadow-sm flex-1 flex flex-col justify-center pro-card-glow hover:translate-y-0">
              <h4 className="text-white font-bold text-sm tracking-tight mb-2 flex items-center gap-2">
                <span>🌗</span> Beyond games, the day job
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                I also come from a software background: an <b>MS in Information Technology from the University of Cincinnati (2024 to 2025, 3.97 GPA)</b>, plus time as a software engineer at TCS, a full-stack intern at Innovision LLC, and an AI evaluator. That work taught me how to keep code organized, which honestly helps a lot with the games. But games are where I'd rather be.
              </p>
            </div>
          </div>
        </section>

        {/* Main Dashboard Section (Game Library) */}
        <section id="library" className="flex flex-col gap-4 border-t border-white/10 pt-12">
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

        {/* JOURNEY TIMELINE SECTION */}
        <section id="journey" className="flex flex-col gap-6 border-t border-white/10 pt-12">
          <div className="flex flex-col gap-1 border-l-2 border-[#7C6CFF] pl-3">
            <span className="font-mono text-[10px] text-[#7C6CFF] tracking-widest font-black uppercase">
              ◷ 2024 → PRESENT
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              The Solar2D Journey
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              How a software engineer ended up making 2D games, one prototype at a time.
            </p>
          </div>

          <div className="relative border-l-2 border-dashed border-[#332C5E] ml-4 mt-6 pl-8 flex flex-col gap-8">
            {/* Timeline Node 1 */}
            <div className="relative">
              <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full bg-[#090d16] border-[3px] border-[#FFB23E] shadow-[0_0_0_4px_rgba(255,178,62,0.12)]"></span>
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#FFB23E]">2024 · EARLY</span>
              <h4 className="text-white font-bold text-sm tracking-tight mt-1">First builds in Solar2D</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-1.5 max-w-2xl">
                Picked up Lua and Solar2D mostly because I wanted to make a game. The first two that actually worked were Star Catcher and Astro Blaster. That's where I figured out sprite sheets, the display library and the runtime loop.
              </p>
            </div>

            {/* Timeline Node 2 */}
            <div className="relative">
              <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full bg-[#090d16] border-[3px] border-[#7C6CFF] shadow-[0_0_0_4px_rgba(124,108,255,0.14)]"></span>
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#7C6CFF]">2024 · LATE</span>
              <h4 className="text-white font-bold text-sm tracking-tight mt-1">Physics &amp; juice</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-1.5 max-w-2xl">
                Doved into Box2D via Solar2D's physics engine. Built Brick Breaker, Lunar Lander and a slingshot demo, obsessing over particles, screen shake and game feel.
              </p>
            </div>

            {/* Timeline Node 3 */}
            <div className="relative">
              <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full bg-[#090d16] border-[3px] border-[#FF6B57] shadow-[0_0_0_4px_rgba(255,107,87,0.12)]"></span>
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#FF6B57]">2025</span>
              <h4 className="text-white font-bold text-sm tracking-tight mt-1">Systems &amp; content</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-1.5 max-w-2xl">
                Started building bigger things: match-3 grids, tower defense waves, an endless runner with random obstacles, a little maze AI. Around this point I began splitting projects into composer scenes and keeping the Lua modular.
              </p>
            </div>

            {/* Timeline Node 4 */}
            <div className="relative">
              <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full bg-[#090d16] border-[3px] border-[#5BE2A0] shadow-[0_0_0_4px_rgba(91,226,160,0.12)]"></span>
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#5BE2A0]">2026 · PRESENT</span>
              <h4 className="text-white font-bold text-sm tracking-tight mt-1">Polish &amp; portability</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-1.5 max-w-2xl">
                Tuning for 60fps on low-end Android, cross-platform input, and a personal library of 16 reusable game templates. Open to game dev roles and freelance 2D projects.
              </p>
            </div>
          </div>
        </section>

        {/* ENGINE / SKILLS LOADOUT SECTION */}
        <section id="engine" className="flex flex-col gap-6 border-t border-white/10 pt-12">
          <div className="flex flex-col gap-1 border-l-2 border-[#5BE2A0] pl-3">
            <span className="font-mono text-[10px] text-[#5BE2A0] tracking-widest font-black uppercase">
              ⚙ THE LOADOUT
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Engine &amp; Toolkit
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              The frameworks, languages, and pipeline tools I reach for when building a 2D game.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {[
              { n: "Solar2D", d: "core engine" },
              { n: "Lua 5.x", d: "game logic" },
              { n: "Box2D Physics", d: "physics.* API" },
              { n: "Composer", d: "scene management" },
              { n: "Widget Library", d: "UI & HUD" },
              { n: "Sprite Sheets", d: "frame animation" },
              { n: "Transitions", d: "tweening & easing" },
              { n: "Tiled / Maps", d: "level design" },
              { n: "Texture Packer", d: "atlas pipeline" },
              { n: "Particle FX", d: "emitters & juice" },
              { n: "Audio (OpenAL)", d: "sfx & music" },
              { n: "iOS / Android", d: "build & deploy" }
            ].map((skill, idx) => (
              <div 
                key={idx} 
                className="skill bg-[#1B1838]/60 border border-[#332C5E] rounded-2xl p-4 shadow-sm pro-card-glow cursor-default"
              >
                <div className="sn text-white font-bold text-sm tracking-tight">{skill.n}</div>
                <div className="sd font-mono text-[10px] text-slate-400 uppercase tracking-wider mt-1">{skill.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Edit Bay NLE Video Editor Section */}
        <section id="editbay" className="flex flex-col gap-4 border-t border-white/10 pt-12">
          <EditBay />
        </section>

        {/* Career Timeline Section */}
        <section className="mt-6 border-t border-white/10 pt-12">
          <SoftwareResume />
        </section>

        {/* Contact section */}
        <section id="contact" className="w-full mt-6">
          <div className="bg-gradient-to-br from-[#0d0d10] to-[#08080a] border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden shadow-xl shadow-black/40">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(500px_300px_at_50%_0%,rgba(229,169,59,0.06),transparent_70%)]"></div>
            
            <span className="block font-mono text-[10px] text-[#E5A93B] tracking-[0.2em] font-black uppercase mb-4">
              ★ INSERT COIN ★
            </span>
            <h2 className="text-2xl sm:text-4xl font-sans font-black text-white uppercase mb-3 relative">
              Let's build a game.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mb-8 relative">
              Have a 2D game idea, a prototype that needs polishing, or a Solar2D role to fill? Drop me a line, I read everything.
            </p>

            <div className="flex flex-wrap gap-4 justify-center relative z-10 text-xs sm:text-sm font-mono">
              <a 
                href="mailto:mangaaa@mail.uc.edu" 
                className="px-5 py-3.5 bg-[#E5A93B] hover:bg-[#ffc266] text-[#050507] rounded-xl font-black uppercase transition-all shadow-md"
              >
                ✉ mangaaa@mail.uc.edu
              </a>
              <a 
                href="tel:+15135011280" 
                className="px-5 py-3.5 bg-[#050507] border border-white/10 text-slate-300 hover:text-white rounded-xl font-bold uppercase hover:border-[#E5A93B] transition-all"
              >
                ☎ +1 513-501-1280
              </a>
              <a 
                href="https://www.linkedin.com/in/adi-narayana-manga/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-[#050507] border border-white/10 text-slate-300 hover:text-white rounded-xl font-bold uppercase hover:border-[#E5A93B] transition-all"
              >
                in · LinkedIn
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-[#050507] border border-white/10 text-slate-300 hover:text-white rounded-xl font-bold uppercase hover:border-[#E5A93B] transition-all"
              >
                ⌥ GitHub
              </a>
            </div>
          </div>
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
