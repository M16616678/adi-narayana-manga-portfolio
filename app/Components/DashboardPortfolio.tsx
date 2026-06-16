"use client";

import React, { useState, useEffect, useRef } from "react";
import { getGameEngine, mount } from "@/app/utils/gameEngines";

interface GameBuild {
  id: string;
  name: string;
  category: string;
  year: number;
  score: number;
  directive: string;
  tag: string;
  playable: boolean;
  luaCode: string;
  timeline: string[];
}

const C = {
  bg0: '#060608',
  bg1: '#0d0d10',
  bg2: '#15151b',
  sun: '#E5A93B',
  coral: '#FF6B57',
  moon: '#A47E3C',
  star: '#FFB23E',
  green: '#5BE2A0',
  pink: '#FF8FD0',
  text: '#EDEBFF',
  mut: '#A29DC9',
  dim: '#6E699A'
};

const GAME_BUILDS: GameBuild[] = [
  {
    id: "star_catcher",
    name: "Star Catcher",
    category: "Arcade",
    year: 2024,
    score: 5.0,
    directive: "Pointer-steered ship snags falling stars, dodges bombs. My very first Solar2D build.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Star Catcher · main.lua
local physics = require("physics")
physics.start()
physics.setGravity(0, 0)

local ship = display.newImageRect("ship.png", 54, 54)
ship.x, ship.y = display.contentCenterX, 400
physics.addBody(ship, "kinematic", { radius = 22 })

local function onTouch(event)
  if event.phase == "moved" then
    transition.to(ship, { x = event.x, time = 80 })
  end
end
Runtime:addEventListener("touch", onTouch)`,
    timeline: [
      "Asset sheets loaded: ship.png, star.png, bomb.png",
      "Physics kinematic collider mapped onto ship geometry.",
      "Added score handler and local highscore caching."
    ]
  },
  {
    id: "astro_blaster",
    name: "Astro Blaster",
    category: "Shooter",
    year: 2024,
    score: 5.0,
    directive: "Auto-firing space shooter with asteroid waves and particle kills.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Astro Blaster · main.lua
local physics = require("physics")
physics.start()

local ship = display.newImageRect("ship.png", 48, 48)
ship.x, ship.y = display.contentCenterX, 420

local function fireLaser()
  local laser = display.newRect(ship.x, ship.y - 30, 4, 18)
  physics.addBody(laser, "dynamic", { isSensor = true })
  laser:setLinearVelocity(0, -600)
end
timer.performWithDelay(250, fireLaser, 0)`,
    timeline: [
      "Created auto-firing timer and linear velocity laser impulse.",
      "Mapped spawning asteroid spawner on random X intervals.",
      "Applied particle bursts and screenshake upon collision."
    ]
  },
  {
    id: "neon_breaker",
    name: "Neon Breaker",
    category: "Arcade",
    year: 2024,
    score: 4.9,
    directive: "Classic brick-breaker with paddle physics and juicy block bursts.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Neon Breaker · main.lua
local paddle = display.newRect(display.contentCenterX, 460, 100, 18)
physics.addBody(paddle, "static")

local ball = display.newCircle(display.contentCenterX, 300, 10)
physics.addBody(ball, "dynamic", { bounce = 1.0, friction = 0 })
ball:setLinearVelocity(150, -250)`,
    timeline: [
      "Setup Box2D static border bodies to bounce the ball.",
      "Tuned reflection angles based on strike offset.",
      "Integrated neon bricks templates."
    ]
  },
  {
    id: "snake_lua",
    name: "Snake.lua",
    category: "Classic",
    year: 2024,
    score: 5.0,
    directive: "Self-playing snake AI on a grid. Greedy pathfinding written in plain Lua.",
    tag: "Solar2D &middot; Lua",
    playable: false,
    luaCode: `-- Snake.lua · AI Pathfinder
local function getNextMove()
  local head = snake[1]
  local dx = food.x - head.x
  local dy = food.y - head.y
  if math.abs(dx) > math.abs(dy) then
    return dx > 0 and "right" or "left"
  else
    return dy > 0 and "down" or "up"
  end
end`,
    timeline: [
      "Built grid coordinate lookup matrix inside memory.",
      "Programmed boundary check arrays.",
      "Optimized greedy pathfinder timers."
    ]
  },
  {
    id: "tap_hopper",
    name: "Tap Hopper",
    category: "Tapper",
    year: 2025,
    score: 4.8,
    directive: "Flappy-style one-tap hopper with gravity, pipes and an auto-pilot demo.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Tap Hopper · main.lua
local hopper = display.newCircle(100, 200, 14)
physics.addBody(hopper, "dynamic", { radius = 14 })

local function onTap()
  hopper:setLinearVelocity(0, -320)
end
Runtime:addEventListener("tap", onTap)`,
    timeline: [
      "Added gravity physics multiplier parameters.",
      "Programmed pipe spawning gate intervals.",
      "Structured simple autopilot scripts."
    ]
  },
  {
    id: "pixel_sprint",
    name: "Pixel Sprint",
    category: "Platformer",
    year: 2025,
    score: 4.7,
    directive: "Auto-runner with parallax hills, jump logic and collectible coins.",
    tag: "Solar2D &middot; Lua",
    playable: false,
    luaCode: `-- Pixel Sprint · Parallax Loop
local background1 = display.newImageRect("hill.png", 640, 320)
local background2 = display.newImageRect("hill.png", 640, 320)
background2.x = 640

local function scroll()
  background1.x = background1.x - 2
  background2.x = background2.x - 2
  if background1.x <= -320 then background1.x = 960 end
end`,
    timeline: [
      "Layered multi-layer parallax backdrop offsets.",
      "Created ground contact sensor logic.",
      "Mapped animated sprite frame states."
    ]
  },
  {
    id: "gem_cascade",
    name: "Gem Cascade",
    category: "Puzzle",
    year: 2025,
    score: 4.9,
    directive: "Match-3 grid that finds lines, pops gems and refills with gravity.",
    tag: "Solar2D &middot; Lua",
    playable: false,
    luaCode: `-- Gem Cascade · Match-3
local function resolveMatches()
  local matches = scanGridForTriples()
  if #matches > 0 then
    popGems(matches)
    applyGridGravity()
  end
end`,
    timeline: [
      "Defined grid positioning indices.",
      "Designed matching detection filters.",
      "Added cascade falling tweens."
    ]
  },
  {
    id: "bubble_burst",
    name: "Bubble Burst",
    category: "Shooter",
    year: 2025,
    score: 4.6,
    directive: "Aiming bubble shooter that clusters and pops same-color groups.",
    tag: "Solar2D &middot; Lua",
    playable: false,
    luaCode: `-- Bubble Burst · Launcher
local function shootBubble(angle)
  local rad = math.rad(angle)
  bubble:setLinearVelocity(math.cos(rad) * 500, math.sin(rad) * -500)
end`,
    timeline: [
      "Mapped angle calculation vectors.",
      "Implemented color group connection scanner.",
      "Created particle pops."
    ]
  },
  {
    id: "tower_siege",
    name: "Tower Siege",
    category: "Action",
    year: 2025,
    score: 4.8,
    directive: "Tower defense with path-following enemies, targeting towers and HP bars.",
    tag: "Solar2D &middot; Lua",
    playable: false,
    luaCode: `-- Tower Siege · Targeting
local function findTarget(tower)
  for i, enemy in ipairs(enemies) do
    if getDistance(tower, enemy) < tower.range then
      return enemy
    end
  end
end`,
    timeline: [
      "Created path coordinates for creeps.",
      "Designed targeting radius checkers.",
      "Mapped lasers and HP bars."
    ]
  },
  {
    id: "maze_muncher",
    name: "Maze Muncher",
    category: "Puzzle",
    year: 2025,
    score: 4.7,
    directive: "Top-down pellet muncher with a chasing ghost and procedural mazes.",
    tag: "Solar2D &middot; Lua",
    playable: false,
    luaCode: `-- Maze Muncher · AI Ghost
local function chasePlayer()
  local path = findShortestPath(ghost.grid, player.grid)
  ghost:moveAlongPath(path)
end`,
    timeline: [
      "Coded procedural maze generator.",
      "Wrote path chasing loops for ghost.",
      "Tuned grid movement speed."
    ]
  },
  {
    id: "sky_racer",
    name: "Sky Racer",
    category: "Action",
    year: 2025,
    score: 4.8,
    directive: "Lane-dodging endless racer with scrolling road and traffic AI.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Sky Racer · Traffic Car
local function spawnTraffic()
  local lane = math.random(1, 3)
  local car = display.newRect(laneWidth * (lane - 0.5), -50, 30, 60)
  physics.addBody(car, "dynamic")
  car:setLinearVelocity(0, 320)
end`,
    timeline: [
      "Designed 3-lane road loop layout.",
      "Programmed relative speed random traffic blocks.",
      "Added camera screenshake on crash."
    ]
  },
  {
    id: "lua_lander",
    name: "Lua Lander",
    category: "Physics",
    year: 2026,
    score: 5.0,
    directive: "Lunar lander descent over procedural terrain with thruster particles.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Lua Lander · Engine Thrust
local function fireThrusters()
  local rad = math.rad(lander.rotation)
  lander:applyForce(math.sin(rad) * 15, -math.cos(rad) * 15)
end`,
    timeline: [
      "Generated vector point landscape contours.",
      "Programmed landing physics thresholds.",
      "Added thruster particle emit variables."
    ]
  },
  {
    id: "card_clash",
    name: "Card Clash",
    category: "Puzzle",
    year: 2026,
    score: 4.6,
    directive: "Card-flip duel with reveal animations and a winning glow.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Card Clash · Card Flip
local function flipCard(card)
  transition.to(card, { xScale = 0.01, time = 150, onComplete = function()
    card.xScale = 1.0
  end })
end`,
    timeline: [
      "Coded dual scale tweens for cards.",
      "Added hover glow triggers.",
      "Created win/loss matches validation."
    ]
  },
  {
    id: "whack_critter",
    name: "Whack Critter",
    category: "Action",
    year: 2026,
    score: 4.7,
    directive: "Whack-a-mole reflex toy with pop-up timing and a swinging hammer.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Whack Critter · Pop Up
local function popUp(mole)
  transition.to(mole, { y = targetY, time = 300, onComplete = function()
    timer.performWithDelay(800, retract)
  end })
end`,
    timeline: [
      "Mapped hole matrix vectors.",
      "Programmed mole delay timers.",
      "Integrated hammer swing hit checks."
    ]
  },
  {
    id: "star_forge",
    name: "Star Forge",
    category: "Physics",
    year: 2026,
    score: 4.9,
    directive: "Constellation traveler routing a ship through nearest-node space maps.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Star Forge · Constellation
local function connect(starA, starB)
  local line = display.newLine(starA.x, starA.y, starB.x, starB.y)
  line.strokeWidth = 2
end`,
    timeline: [
      "Coded nearest-node travel lines calculation.",
      "Added energy score checkers.",
      "Created constellation glowing paths."
    ]
  },
  {
    id: "block_drop",
    name: "Block Drop",
    category: "Physics",
    year: 2026,
    score: 5.0,
    directive: "Slingshot projectile that topples stacked blocks with Box2D-style physics.",
    tag: "Solar2D &middot; Lua",
    playable: true,
    luaCode: `-- Block Drop · Slingshot
local function onRelease(e)
  local dx, dy = anchor.x - projectile.x, anchor.y - projectile.y
  projectile:applyLinearImpulse(dx * 0.2, dy * 0.2)
end`,
    timeline: [
      "Coded drag spring coordinates.",
      "Added Box2D physical collision vectors.",
      "Structured weight variables for drop stack."
    ]
  }
];

// Single Game Card component with completely throttled (off when not hovered) Canvas
function GameCard({ 
  game, 
  onCardClick, 
  globalSpeed 
}: { 
  game: GameBuild; 
  onCardClick: () => void; 
  globalSpeed: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer to run loop ONLY when card is visible on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Canvas preview rendering loop using the unified game engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const factory = getGameEngine(game.id);
    if (!factory) return;

    const envOverride = {
      pointer: {
        x: 0,
        y: 0,
        down: false,
        active: isHovered,
        lastT: isHovered ? 0 : -99
      },
      speedSetting: globalSpeed
    };

    const instance = mount(canvas, factory, envOverride);
    if (!instance) return;

    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      instance.render(dt);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      instance.destroy();
    };
  }, [isVisible, isHovered, game.id, globalSpeed]);

  return (
    <div 
      ref={containerRef}
      onClick={onCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card bg-[#161c2d]/40 backdrop-blur-xl border border-white/[0.08] hover:border-indigo-500/40 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-pointer group"
    >
      {/* Visual Game Canvas viewport */}
      <div className="relative aspect-[16/10] bg-slate-950/80 border-b border-white/[0.06] overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={320} 
          height={200}
          className="w-full h-full bg-slate-950/90 object-cover pixelated"
        />
        {/* CRT Scanline glow overlays */}
        <div className="crt-scanlines"></div>
        <div className="crt-vignette"></div>
        
        {/* Game play status HUD badge */}
        <div className="absolute top-3 left-3 bg-[#0f172a]/95 border border-white/10 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-slate-300 backdrop-blur-sm">
          {game.category}
        </div>
        <div className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-500 bg-[#0f172a]/90 px-1.5 py-0.5 rounded border border-white/5">
          {game.year}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex flex-col gap-2">
        <h4 className="text-base font-black text-white leading-snug group-hover:text-[#60a5fa] transition-colors">
          {game.name}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {game.directive}
        </p>
        
        <div className="flex justify-between items-center border-t border-white/5 pt-3.5 mt-2">
          <span 
            className="text-[9px] font-black uppercase tracking-wider text-[#406E8E]"
            dangerouslySetInnerHTML={{ __html: game.tag }}
          ></span>
          
          <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30">
            PLAYABLE
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPortfolio() {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [activeGame, setActiveGame] = useState<GameBuild | null>(null);
  
  // Custom script variables tuned by sliders
  const [gravitySetting, setGravitySetting] = useState<number>(0.6);
  const [speedSetting, setSpeedSetting] = useState<number>(4.0);

  const modalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [score, setScore] = useState<number>(0);

  // Playable modal game loop using unified game engine
  useEffect(() => {
    if (!activeGame) return;
    const canvas = modalCanvasRef.current;
    if (!canvas) return;

    setScore(0); // Reset score state for new game

    const factory = getGameEngine(activeGame.id);
    if (!factory) return;

    // Pointer state and dynamic settings mapped into the environment object
    const envOverride = {
      pointer: {
        x: 0,
        y: 0,
        down: false,
        active: false,
        lastT: -99
      },
      speedSetting,
      gravitySetting,
      onScoreChange: (newScore: number) => {
        setScore(newScore);
      }
    };

    const instance = mount(canvas, factory, envOverride);
    if (!instance) return;

    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      instance.render(dt);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      instance.destroy();
    };
  }, [activeGame, speedSetting, gravitySetting]);

  // Filter game list matching pill selections
  const filteredGames = GAME_BUILDS.filter((g) => {
    if (filterCategory === "All") return true;
    if (filterCategory === "Playable") return g.playable;
    return g.category === filterCategory;
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Top HUD Overview Cards */}
      <div className="overview-grid">
        <div className="card">
          <div className="card-label">Total Game Builds</div>
          <div className="card-value text-emerald-500">
            16 <span>/ 16 Live</span>
          </div>
          <div className="card-subtext">
            <span className="badge-status online">Passed</span>
            60 FPS verified
          </div>
        </div>
        
        <div className="card">
          <div className="card-label">Engine Status</div>
          <div className="card-value text-emerald-500" style={{ fontSize: "1.45rem", padding: "0.45rem 0" }}>
            🟢 SOLAR2D ONLINE
          </div>
          <div className="card-subtext">
            Target: <span className="font-mono font-bold text-slate-400">Lua 5.1 & Box2D</span>
          </div>
        </div>
        
        <div className="card">
          <div className="card-label">Engine Presets</div>
          <div className="card-value text-[#3b82f6]" style={{ fontSize: "1.45rem", padding: "0.45rem 0" }}>
            Lua Landers & Run
          </div>
          <div className="card-subtext">
            Average Game Feel rating: <span className="text-white font-bold">5.0 / 5.0</span>
          </div>
        </div>
      </div>

      {/* Grid Library Headers & Filters */}
      <div className="flex flex-col gap-4 border-t border-white/5 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-[#406E8E] uppercase tracking-wider">▚ THE LIBRARY</span>
            <h3 className="text-2xl font-black text-white mt-0.5">16 Solar2D builds, live in your browser</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Each card is an actual running preview. Hover over any card to run the physics animation loop, and click to play inside the active console.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {["All", "Arcade", "Puzzle", "Action", "Physics", "Playable"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  (cat === "All" && filterCategory === "All") || filterCategory === cat
                    ? "bg-[#3b82f6] text-white border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "bg-slate-900/60 text-slate-400 border-white/10 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat === "All" ? "All 16" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onCardClick={() => setActiveGame(game)}
              globalSpeed={speedSetting}
            />
          ))}
        </div>
      </div>

      {/* Full-Screen Arcade Play Cabinet Modal */}
      {activeGame && (
        <div className="modal modal-open flex items-center justify-center bg-black/80 backdrop-blur-md fixed inset-0 z-50 p-4 overflow-y-auto">
          <div className="card bg-[#0b0f19] border border-white/10 w-full max-w-[1000px] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] my-8">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-slate-900/80 border-b border-white/[0.08] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="h-3.5 w-3.5 rounded-full bg-[#3b82f6] animate-pulse"></span>
                <span className="text-sm font-black tracking-widest text-slate-300 font-mono">
                  ARCADE CABINET: {activeGame.name.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={() => setActiveGame(null)}
                className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Main Grid Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 items-start">
              
              {/* Gameplay Viewport Screen: 7 Columns */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* 2D Canvas Play Container */}
                <div className="relative border border-white/[0.08] bg-slate-950/80 rounded-2xl overflow-hidden shadow-inner">
                  
                  {/* Top CRT overlay screen HUD */}
                  <div className="flex justify-between items-center bg-[#090d16] border-b border-white/5 px-4 py-2 text-[10px] font-mono font-bold text-slate-400">
                    <span>{activeGame.playable ? "🎮 PLAY MODE ACTIVE" : "📺 DEMO SIMULATOR"}</span>
                    <span className="text-[#FF6B57]">SCORE: {score.toString().padStart(6, "0")}</span>
                    <span>Score multiplier: {speedSetting.toFixed(1)}x</span>
                  </div>

                  <div className="flex justify-center p-4 bg-slate-950/90 relative">
                    <canvas
                      ref={modalCanvasRef}
                      width={760}
                      height={600}
                      className="bg-slate-950 border border-white/5 rounded-xl w-full max-w-[420px] aspect-[1.26/1] cursor-pointer pixelated"
                    />
                    <div className="crt-scanlines"></div>
                    <div className="crt-vignette"></div>
                    {activeGame.playable && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/10 px-4 py-1.5 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-wider pointer-events-none backdrop-blur shadow-lg z-20">
                        🎮 Drag Mouse / Click inside Viewport to Play
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline Development log */}
                <div className="flex flex-col gap-2 bg-[#161c2d]/40 border border-white/[0.08] p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-[#406E8E] uppercase tracking-wider">Audit Development Timeline</span>
                  <div className="timeline-container mt-2">
                    {activeGame.timeline.map((log, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-dot success"></div>
                        <div className="timeline-content text-xs">{log}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Code Inspector & Sliders: 5 Columns */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Sliders Panel */}
                <div className="card bg-[#161c2d]/40 border border-white/[0.08] p-5 rounded-2xl flex flex-col gap-4">
                  <span className="text-[10px] font-bold text-[#406E8E] uppercase tracking-wider">⚙️ Lua Physics Tuning variables</span>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-[10px] font-bold font-mono">
                      <span className="text-slate-400">Impulse Vector (speed)</span>
                      <span className="text-indigo-400">{speedSetting.toFixed(1)}f</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="10.0"
                      step="0.5"
                      value={speedSetting}
                      onChange={(e) => setSpeedSetting(parseFloat(e.target.value))}
                      className="range range-xs range-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-[10px] font-bold font-mono">
                      <span className="text-slate-400">Box2D gravity.y</span>
                      <span className="text-indigo-400">{gravitySetting.toFixed(2)}g</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.5"
                      step="0.05"
                      value={gravitySetting}
                      onChange={(e) => setGravitySetting(parseFloat(e.target.value))}
                      className="range range-xs range-primary"
                    />
                  </div>
                </div>

                {/* Lua code viewer */}
                <div className="card bg-slate-950 border border-white/5 p-4 rounded-2xl flex-1 flex flex-col gap-2 font-mono text-[10px] text-slate-300 leading-relaxed overflow-hidden">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-1">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">main.lua code block</span>
                    <span className="text-[9px] font-bold text-slate-600 bg-slate-900 px-2 py-0.5 rounded border border-white/5">Solar2D</span>
                  </div>
                  <pre className="overflow-auto flex-1 max-h-[200px] select-all whitespace-pre-wrap">{activeGame.luaCode}</pre>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
