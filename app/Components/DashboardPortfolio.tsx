"use client";

import React, { useState, useEffect, useRef } from "react";

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
  const frameId = useRef<number | null>(null);
  const mouseX = useRef<number>(80);

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

  // Canvas preview rendering loop (only requests next frame if hovered)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX.current = ((e.clientX - rect.left) / rect.width) * canvas.width;
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    // Frame rendering function
    const loop = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render mini grid backdrop
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw game specific previews
      switch (game.id) {
        case "star_catcher": {
          const sX = isHovered ? mouseX.current : 80 + Math.sin(timestamp * 0.003) * 40;
          ctx.fillStyle = "#3b82f6";
          ctx.beginPath();
          ctx.moveTo(sX, 82);
          ctx.lineTo(sX - 6, 92);
          ctx.lineTo(sX + 6, 92);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#eab308";
          const starsPos = [
            { x: 30, y: (35 + timestamp * 0.015) % 100 },
            { x: 80, y: (15 + timestamp * 0.015) % 100 },
            { x: 130, y: (75 + timestamp * 0.015) % 100 }
          ];
          starsPos.forEach((s) => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
            ctx.fill();
          });
          break;
        }
        case "astro_blaster": {
          const sX = isHovered ? mouseX.current : 80 + Math.cos(timestamp * 0.002) * 40;
          ctx.fillStyle = "#10b981";
          ctx.beginPath();
          ctx.moveTo(sX, 82);
          ctx.lineTo(sX - 5, 92);
          ctx.lineTo(sX + 5, 92);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#f43f5e";
          ctx.fillRect(sX - 0.5, (timestamp * 0.15) % 75, 1, 8);

          ctx.strokeStyle = "#94a3b8";
          ctx.beginPath();
          ctx.arc(40, (10 + timestamp * 0.03) % 100, 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(120, (50 + timestamp * 0.02) % 100, 6, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }
        case "neon_breaker": {
          const ballX = 80 + Math.sin(timestamp * 0.004) * 50;
          const ballY = 50 + Math.sin(timestamp * 0.008) * 20;
          const padX = isHovered ? mouseX.current : ballX;
          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(padX - 15, 88, 30, 4);

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(ballX, ballY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];
          for (let c = 0; c < 5; c++) {
            ctx.fillStyle = colors[c % 4];
            ctx.fillRect(20 + c * 25, 20, 20, 4);
            ctx.fillRect(20 + c * 25, 28, 20, 4);
          }
          break;
        }
        case "snake_lua": {
          const speedFactor = 0.005;
          const t = Math.floor(timestamp * speedFactor) % 24;
          let sx = 5, sy = 5;
          if (t < 6) sx += t;
          else if (t < 12) { sx += 6; sy += (t - 6); }
          else if (t < 18) { sx += (18 - t); sy += 6; }
          else { sy += (24 - t); }
          
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(60, 40, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#10b981";
          ctx.fillRect(sx * 8, sy * 6, 6, 5);
          ctx.fillStyle = "#047857";
          ctx.fillRect((sx - 1) * 8, sy * 6, 6, 5);
          ctx.fillRect((sx - 2) * 8, sy * 6, 6, 5);
          break;
        }
        case "tap_hopper": {
          const jumpVal = Math.sin(timestamp * 0.005) * 20 + 50;
          ctx.fillStyle = "#8b5cf6";
          ctx.beginPath();
          ctx.arc(40, jumpVal, 4, 0, Math.PI * 2);
          ctx.fill();

          const pipeX = (canvas.width - (timestamp * 0.05) % (canvas.width + 30));
          ctx.fillStyle = "#1e293b";
          ctx.strokeStyle = "#8b5cf6";
          ctx.fillRect(pipeX, 0, 12, 35);
          ctx.strokeRect(pipeX, -1, 12, 36);
          ctx.fillRect(pipeX, 70, 12, 30);
          ctx.strokeRect(pipeX, 70, 12, 31);
          break;
        }
        case "pixel_sprint": {
          const scroll = (timestamp * 0.05) % canvas.width;
          ctx.fillStyle = "#1e293b";
          ctx.beginPath();
          ctx.arc(canvas.width - scroll, 100, 50, 0, Math.PI * 2);
          ctx.arc(2 * canvas.width - scroll, 100, 50, 0, Math.PI * 2);
          ctx.fill();

          const runY = 72 + Math.abs(Math.sin(timestamp * 0.01)) * 4;
          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(40, runY, 6, 10);
          break;
        }
        case "gem_cascade": {
          const colors = ["#ef4444", "#10b981", "#3b82f6", "#eab308", "#a855f7"];
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 6; c++) {
              const pulse = Math.sin(timestamp * 0.002 + r + c) * 1.0;
              ctx.fillStyle = colors[(r + c) % 5];
              ctx.beginPath();
              ctx.arc(20 + c * 24, 20 + r * 20, 5 + pulse, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;
        }
        case "bubble_burst": {
          const colors = ["#f43f5e", "#0ea5e9", "#eab308", "#10b981"];
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 8; c++) {
              ctx.fillStyle = colors[(r + c) % 4];
              ctx.beginPath();
              ctx.arc(17 + c * 18, 15 + r * 14, 5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          const angle = isHovered ? (mouseX.current - 80) * 0.01 : Math.sin(timestamp * 0.002) * 0.5;
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(80, 95);
          ctx.lineTo(80 + Math.sin(angle) * 18, 95 - Math.cos(angle) * 18);
          ctx.stroke();
          
          ctx.fillStyle = "#f43f5e";
          ctx.beginPath();
          ctx.arc(80, 95, 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
        case "tower_siege": {
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(10, 50);
          ctx.lineTo(60, 50);
          ctx.lineTo(60, 80);
          ctx.lineTo(110, 80);
          ctx.lineTo(110, 20);
          ctx.lineTo(150, 20);
          ctx.stroke();

          const progress = (timestamp * 0.015) % 150;
          let cx = 10, cy = 50;
          if (progress < 50) cx = 10 + progress;
          else if (progress < 80) { cx = 60; cy = 50 + (progress - 50); }
          else if (progress < 130) { cx = 60 + (progress - 80); cy = 80; }
          else { cx = 110; cy = 80 - (progress - 130) * 1.2; }

          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(75, 45, 10, 16);
          if (cx > 40 && cx < 120 && cy > 20 && cy < 90) {
            ctx.strokeStyle = "#60a5fa";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(80, 45);
            ctx.lineTo(cx, cy);
            ctx.stroke();
          }
          break;
        }
        case "maze_muncher": {
          ctx.strokeStyle = "#1e3a8a";
          ctx.lineWidth = 2;
          ctx.strokeRect(15, 15, 130, 70);
          ctx.beginPath();
          ctx.moveTo(50, 15); ctx.lineTo(50, 50); ctx.lineTo(80, 50);
          ctx.moveTo(110, 85); ctx.lineTo(110, 50);
          ctx.stroke();

          const mx = 25 + (timestamp * 0.02) % 110;
          ctx.fillStyle = "#eab308";
          ctx.beginPath();
          ctx.arc(mx, 32, 4.5, 0.2 * Math.PI, 1.8 * Math.PI);
          ctx.lineTo(mx, 32);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          for (let d = 0; d < 5; d++) {
            const dx = 35 + d * 25;
            if (dx > mx) {
              ctx.beginPath();
              ctx.arc(dx, 32, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          ctx.fillStyle = "#ef4444";
          const gx = mx - 25;
          ctx.beginPath();
          ctx.arc(gx, 32, 4.5, Math.PI, 0);
          ctx.lineTo(gx + 4.5, 36);
          ctx.lineTo(gx - 4.5, 36);
          ctx.closePath();
          ctx.fill();
          break;
        }
        case "sky_racer": {
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(53, 0); ctx.lineTo(53, canvas.height);
          ctx.moveTo(106, 0); ctx.lineTo(106, canvas.height);
          ctx.stroke();

          const pLane = isHovered ? Math.floor((mouseX.current / canvas.width) * 3) : 1;
          const px = 26.5 + pLane * 53;
          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(px - 5, 70, 10, 18);

          const ty = (timestamp * 0.05) % 140 - 20;
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(26.5 + 53 - 5, ty, 10, 18);
          break;
        }
        case "lua_lander": {
          ctx.strokeStyle = "#64748b";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 85);
          ctx.lineTo(50, 95);
          ctx.lineTo(100, 75);
          ctx.lineTo(120, 75);
          ctx.lineTo(160, 90);
          ctx.stroke();

          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(100, 75); ctx.lineTo(120, 75);
          ctx.stroke();

          const ly = 20 + Math.sin(timestamp * 0.001) * 30;
          const lx = 110 + Math.cos(timestamp * 0.0005) * 10;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(lx - 4, ly - 3, 8, 6);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(lx - 4, ly + 3); ctx.lineTo(lx - 6, ly + 8);
          ctx.moveTo(lx + 4, ly + 3); ctx.lineTo(lx + 6, ly + 8);
          ctx.stroke();
          if (Math.random() < 0.5) {
            ctx.fillStyle = "#eab308";
            ctx.fillRect(lx - 1, ly + 4, 2, 3);
          }
          break;
        }
        case "card_clash": {
          const hoverOffset = isHovered ? Math.sin(timestamp * 0.01) * 2 : 0;
          ctx.strokeStyle = isHovered ? "#8b5cf6" : "#475569";
          ctx.lineWidth = 1.5;
          
          ctx.strokeRect(35, 20 - hoverOffset, 32, 50);
          ctx.fillStyle = "rgba(139, 92, 246, 0.1)";
          ctx.fillRect(35, 20 - hoverOffset, 32, 50);

          ctx.strokeRect(93, 20 + hoverOffset, 32, 50);
          ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
          ctx.fillRect(93, 20 + hoverOffset, 32, 50);
          break;
        }
        case "whack_critter": {
          const holes = [35, 80, 125];
          holes.forEach((hx, idx) => {
            ctx.strokeStyle = "#475569";
            ctx.beginPath();
            ctx.ellipse(hx, 75, 12, 4, 0, 0, 2 * Math.PI);
            ctx.stroke();

            const popHeight = Math.max(0, Math.sin(timestamp * 0.002 + idx * 2) * 10);
            if (popHeight > 0) {
              ctx.fillStyle = "#b45309";
              ctx.beginPath();
              ctx.arc(hx, 75 - popHeight, 6, Math.PI, 0);
              ctx.lineTo(hx + 6, 75);
              ctx.lineTo(hx - 6, 75);
              ctx.closePath();
              ctx.fill();
            }
          });
          break;
        }
        case "star_forge": {
          const nodes = [
            { x: 30, y: 30 },
            { x: 60, y: 70 },
            { x: 90, y: 40 },
            { x: 130, y: 65 }
          ];
          ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[0].x, nodes[0].y);
          for (let i = 1; i < nodes.length; i++) {
            ctx.lineTo(nodes[i].x, nodes[i].y);
          }
          ctx.stroke();

          ctx.fillStyle = "#c084fc";
          nodes.forEach((n) => {
            const glow = Math.sin(timestamp * 0.003 + n.x) * 1.5;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 2.5 + glow, 0, Math.PI * 2);
            ctx.fill();
          });

          if (isHovered) {
            ctx.strokeStyle = "rgba(96, 165, 250, 0.5)";
            ctx.beginPath();
            ctx.moveTo(nodes[1].x, nodes[1].y);
            ctx.lineTo(mouseX.current, 50);
            ctx.stroke();
          }
          break;
        }
        case "block_drop": {
          ctx.strokeStyle = "#b45309";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(20, 80);
          ctx.lineTo(40, 80);
          ctx.stroke();

          const dragX = isHovered ? Math.max(10, Math.min(35, mouseX.current)) : 30;
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(dragX, 80, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(110, 60, 10, 30);
          ctx.fillRect(125, 50, 10, 40);
          ctx.fillRect(115, 30, 15, 10);
          break;
        }
        default: {
          ctx.strokeStyle = "rgba(64, 110, 142, 0.4)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < canvas.width; i++) {
            const y = 50 + Math.sin((i + timestamp * 0.05) * 0.05) * 15;
            if (i === 0) ctx.moveTo(i, y);
            else ctx.lineTo(i, y);
          }
          ctx.stroke();
        }
      }

      // Schedule next frame ONLY if currently hovered to save huge browser rendering load
      if (isHovered) {
        frameId.current = requestAnimationFrame(loop);
      }
    };

    if (isHovered) {
      frameId.current = requestAnimationFrame(loop);
    } else {
      loop(0); // Render one static frame
    }

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [isVisible, isHovered, game, globalSpeed]);

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
          width={160} 
          height={100}
          className="w-full h-full bg-slate-950/90 object-cover"
        />
        {/* CRT Scanline glow overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.03] to-transparent opacity-60"></div>
        
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
  
  // Main Playable modal state refs
  const gameStateRef = useRef({
    x: 190,
    y: 180,
    vx: 0,
    vy: 0,
    width: 24,
    height: 24,
    bullets: [] as Array<{ x: number; y: number; vx: number; vy: number }>,
    asteroids: [] as Array<{ x: number; y: number; size: number; speed: number }>,
    stars: [] as Array<{ x: number; y: number; size: number; speed: number }>,
    bombs: [] as Array<{ x: number; y: number; size: number; speed: number }>,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>,
    bricks: [] as Array<{ x: number; y: number; w: number; h: number; color: string; active: boolean }>,
    ball: { x: 190, y: 150, vx: 3, vy: -4, radius: 8 },
    score: 0,
    snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }],
    snakeDir: "right",
    food: { x: 10, y: 8 },
    lastSnakeUpdate: 0,
    hopper: { y: 150, vy: 0, radius: 12 },
    pipes: [] as Array<{ x: number; top: number; bottom: number; passed: boolean }>,
    lastPipeSpawn: 0,
    skyRacerPlayerX: 190,
    skyRacerTraffic: [] as Array<{ x: number; y: number; speed: number; color: string }>,
    
    // Pixel Sprint
    pixelRunner: { y: 220, vy: 0, state: "running", distance: 0 },
    pixelCoins: [] as Array<{ x: number; y: number }>,
    pixelObstacles: [] as Array<{ x: number; y: number }>,

    // Gem Cascade
    gemGrid: [] as Array<Array<{ color: string; x: number; y: number; targetY: number; state: string }>>,
    gemTimer: 0,

    // Bubble Burst
    bubbleGrid: [] as Array<{ x: number; y: number; color: string; active: boolean }>,
    bubbleProj: { x: 190, y: 270, vx: 0, vy: 0, color: "#f43f5e", active: false },

    // Tower Siege
    towerCreeps: [] as Array<{ x: number; y: number; hp: number; maxHp: number; speed: number; targetIndex: number }>,
    towerTowers: [] as Array<{ x: number; y: number; range: number; cooldown: number }>,

    // Maze Muncher
    mazeMuncherPlayer: { x: 1, y: 1, vx: 0, vy: 0 },
    mazeMuncherGhost: { x: 8, y: 8, color: "#ef4444" },
    mazeMuncherDots: [] as Array<{ x: number; y: number }>,

    // Lua Lander
    landerSpacecraft: { x: 190, y: 50, vx: 1.0, vy: 0, fuel: 100, rotation: 0, state: "flying" },

    // Card Clash
    cardClash: {
      card1: { val: 0, flip: 0, state: "back" },
      card2: { val: 0, flip: 0, state: "back" },
      state: "idle",
      timer: 0
    },

    // Whack Critter
    whackMoles: [] as Array<{ x: number; y: number; pop: number; state: string; timer: number }>,

    // Star Forge
    starForgeNodes: [] as Array<{ x: number; y: number; connected: boolean }>,

    // Block Drop
    blockDropProj: { x: 60, y: 220, vx: 0, vy: 0, state: "idle" },
    blockDropBlocks: [] as Array<{ x: number; y: number; w: number; h: number; vx: number; vy: number; r: number; vr: number }>
  });

  const mouseX = useRef<number>(190);
  const isMouseDown = useRef<boolean>(false);

  // Restart active game variables
  const resetGameData = () => {
    const state = gameStateRef.current;
    state.score = 0;
    state.bullets = [];
    state.asteroids = [];
    state.stars = [];
    state.bombs = [];
    state.particles = [];
    
    // Star Catcher, Astro Blaster, Neon Breaker
    state.x = 190;
    state.y = 180;
    state.vx = 0;
    state.vy = 0;
    state.ball = { x: 190, y: 160, vx: 3.5, vy: -4.5, radius: 8 };
    
    state.bricks = [];
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        state.bricks.push({
          x: 15 + c * 44,
          y: 40 + r * 18,
          w: 38,
          h: 12,
          color: colors[r],
          active: true
        });
      }
    }

    state.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
    state.snakeDir = "right";
    state.food = { x: 10, y: 8 };
    state.lastSnakeUpdate = 0;

    state.hopper = { y: 150, vy: 0, radius: 12 };
    state.pipes = [];
    state.lastPipeSpawn = 0;

    state.skyRacerPlayerX = 190;
    state.skyRacerTraffic = [];

    // Pixel Sprint
    state.pixelRunner = { y: 220, vy: 0, state: "running", distance: 0 };
    state.pixelCoins = [
      { x: 300, y: 200 },
      { x: 380, y: 170 },
      { x: 460, y: 200 }
    ];
    state.pixelObstacles = [
      { x: 250, y: 235 },
      { x: 450, y: 235 }
    ];

    // Gem Cascade
    state.gemGrid = [];
    const gemColors = ["#ef4444", "#10b981", "#3b82f6", "#eab308", "#a855f7"];
    for (let r = 0; r < 6; r++) {
      const row = [];
      for (let c = 0; c < 8; c++) {
        row.push({
          color: gemColors[Math.floor(Math.random() * gemColors.length)],
          x: 35 + c * 40,
          y: 40 + r * 35,
          targetY: 40 + r * 35,
          state: "stable"
        });
      }
      state.gemGrid.push(row);
    }
    state.gemTimer = 0;

    // Bubble Burst
    state.bubbleGrid = [];
    const bubbleColors = ["#f43f5e", "#0ea5e9", "#eab308", "#10b981"];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 10; c++) {
        state.bubbleGrid.push({
          x: 25 + c * 36,
          y: 30 + r * 28,
          color: bubbleColors[(r + c) % bubbleColors.length],
          active: true
        });
      }
    }
    state.bubbleProj = { x: 190, y: 270, vx: 0, vy: 0, color: bubbleColors[0], active: false };

    // Tower Siege
    state.towerCreeps = [];
    for (let i = 0; i < 3; i++) {
      state.towerCreeps.push({
        x: -40 - i * 80,
        y: 150,
        hp: 100,
        maxHp: 100,
        speed: 1.2,
        targetIndex: 0
      });
    }
    state.towerTowers = [
      { x: 80, y: 100, range: 70, cooldown: 0 },
      { x: 190, y: 180, range: 75, cooldown: 0 },
      { x: 280, y: 130, range: 80, cooldown: 0 }
    ];

    // Maze Muncher
    state.mazeMuncherPlayer = { x: 1, y: 1, vx: 0, vy: 0 };
    state.mazeMuncherGhost = { x: 8, y: 8, color: "#ef4444" };
    state.mazeMuncherDots = [];
    for (let r = 1; r < 9; r++) {
      for (let c = 1; c < 9; c++) {
        if (r !== 5 || c !== 5) {
          state.mazeMuncherDots.push({ x: c, y: r });
        }
      }
    }

    // Lua Lander
    state.landerSpacecraft = { x: 190, y: 50, vx: 1.0, vy: 0, fuel: 100, rotation: 0, state: "flying" };

    // Card Clash
    state.cardClash = {
      card1: { val: 0, flip: 0, state: "back" },
      card2: { val: 0, flip: 0, state: "back" },
      state: "idle",
      timer: 0
    };

    // Whack Critter
    state.whackMoles = [
      { x: 90, y: 160, pop: 0, state: "down", timer: Math.random() * 2000 },
      { x: 190, y: 160, pop: 0, state: "down", timer: Math.random() * 2000 },
      { x: 290, y: 160, pop: 0, state: "down", timer: Math.random() * 2000 }
    ];

    // Star Forge
    state.starForgeNodes = [];
    for (let i = 0; i < 8; i++) {
      state.starForgeNodes.push({
        x: 40 + Math.random() * 300,
        y: 40 + Math.random() * 180,
        connected: false
      });
    }

    // Block Drop
    state.blockDropProj = { x: 60, y: 220, vx: 0, vy: 0, state: "idle" };
    state.blockDropBlocks = [
      { x: 290, y: 210, w: 20, h: 40, vx: 0, vy: 0, r: 0, vr: 0 },
      { x: 315, y: 190, w: 20, h: 60, vx: 0, vy: 0, r: 0, vr: 0 },
      { x: 300, y: 140, w: 40, h: 15, vx: 0, vy: 0, r: 0, vr: 0 }
    ];
  };

  useEffect(() => {
    if (activeGame) {
      resetGameData();
    }
  }, [activeGame]);

  // Main gameplay canvas loop for active MODAL
  useEffect(() => {
    if (!activeGame) return;
    const canvas = modalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
      mouseX.current = x;
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
      const state = gameStateRef.current;
      
      // Tap Hopper Jump Action
      if (activeGame.id === "tap_hopper") {
        state.hopper.vy = -speedSetting * 0.9;
      }
      // Bubble Shooter shooting action
      if (activeGame.id === "bubble_burst" && !state.bubbleProj.active) {
        const angle = (mouseX.current - 190) * 0.005;
        state.bubbleProj.vx = Math.sin(angle) * speedSetting * 1.5;
        state.bubbleProj.vy = -Math.cos(angle) * speedSetting * 1.5;
        state.bubbleProj.active = true;
      }
      // Slingshot Projectile pulling/aiming action
      if (activeGame.id === "block_drop" && state.blockDropProj.state === "idle") {
        state.blockDropProj.state = "dragging";
      }
      // Card Flip Duel Action
      if (activeGame.id === "card_clash" && state.cardClash.state === "idle") {
        state.cardClash.state = "flipping";
        state.cardClash.card1.val = Math.floor(Math.random() * 13) + 1;
        state.cardClash.card2.val = Math.floor(Math.random() * 13) + 1;
        state.cardClash.timer = Date.now();
      }
      // Whack Critter Whacking action
      if (activeGame.id === "whack_critter") {
        state.whackMoles.forEach((m) => {
          if (m.state === "up" && Math.abs(mouseX.current - m.x) < 30) {
            m.state = "down";
            state.score += 50;
            for (let i = 0; i < 8; i++) {
              state.particles.push({
                x: m.x,
                y: m.y - 20,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: "#eab308",
                life: 15
              });
            }
          }
        });
      }
      // Star Forge constellation connection trigger
      if (activeGame.id === "star_forge") {
        let nearestNode = null;
        let minDist = 999;
        state.starForgeNodes.forEach((n) => {
          const d = Math.hypot(n.x - mouseX.current, n.y - 150);
          if (d < minDist) {
            minDist = d;
            nearestNode = n;
          }
        });
        if (nearestNode && minDist < 45) {
          (nearestNode as any).connected = true;
          state.score += 20;
          if (state.starForgeNodes.every((n) => n.connected)) {
            state.score += 150;
            setTimeout(() => {
              resetGameData();
            }, 800);
          }
        }
      }
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      const state = gameStateRef.current;
      
      // Slingshot release launch action
      if (activeGame.id === "block_drop" && state.blockDropProj.state === "dragging") {
        const pullX = Math.max(20, Math.min(100, mouseX.current));
        const pullY = 220;
        state.blockDropProj.vx = (60 - pullX) * 0.15 * speedSetting;
        state.blockDropProj.vy = (220 - pullY) * 0.15 * speedSetting;
        state.blockDropProj.state = "flying";
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const frame = (timestamp: number) => {
      const state = gameStateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid Background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw active particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 20;
        ctx.fillRect(p.x, p.y, 4, 4);
      });
      state.particles = state.particles.filter((p) => p.life > 0);
      ctx.globalAlpha = 1.0;

      // 1. STAR CATCHER
      if (activeGame.id === "star_catcher") {
        state.x += (mouseX.current - state.x) * 0.2;
        state.y = 260;

        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.moveTo(state.x, state.y - 15);
        ctx.lineTo(state.x - 15, state.y + 12);
        ctx.lineTo(state.x + 15, state.y + 12);
        ctx.closePath();
        ctx.fill();

        if (Math.random() < 0.06) {
          state.stars.push({
            x: Math.random() * canvas.width,
            y: 0,
            size: 6,
            speed: (1.5 + Math.random() * 2) * speedSetting * 0.4
          });
        }
        if (Math.random() < 0.015) {
          state.bombs.push({
            x: Math.random() * canvas.width,
            y: 0,
            size: 8,
            speed: (2 + Math.random() * 1.5) * speedSetting * 0.4
          });
        }

        state.stars.forEach((s) => {
          s.y += s.speed;
          ctx.fillStyle = "#eab308";
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();

          if (Math.hypot(s.x - state.x, s.y - state.y) < 24) {
            state.score += 10;
            s.y = canvas.height + 100;
            for (let i = 0; i < 10; i++) {
              state.particles.push({
                x: s.x,
                y: s.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: "#eab308",
                life: 15
              });
            }
          }
        });
        state.stars = state.stars.filter((s) => s.y < canvas.height);

        state.bombs.forEach((b) => {
          b.y += b.speed;
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
          ctx.fill();

          if (Math.hypot(b.x - state.x, b.y - state.y) < 24) {
            state.score = Math.max(0, state.score - 30);
            b.y = canvas.height + 100;
            for (let i = 0; i < 15; i++) {
              state.particles.push({
                x: b.x,
                y: b.y,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.5) * 7,
                color: "#ef4444",
                life: 20
              });
            }
          }
        });
        state.bombs = state.bombs.filter((b) => b.y < canvas.height);
      }
      
      // 2. ASTRO BLASTER
      else if (activeGame.id === "astro_blaster") {
        state.x += (mouseX.current - state.x) * 0.2;
        state.y = 260;

        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.moveTo(state.x, state.y - 15);
        ctx.lineTo(state.x - 12, state.y + 12);
        ctx.lineTo(state.x + 12, state.y + 12);
        ctx.closePath();
        ctx.fill();

        if (timestamp % 160 < 20 && state.bullets.length < 10) {
          state.bullets.push({ x: state.x, y: state.y - 18, vx: 0, vy: -7 });
        }
        state.bullets.forEach((b) => {
          b.y += b.vy;
          ctx.fillStyle = "#f43f5e";
          ctx.fillRect(b.x - 2, b.y, 4, 12);
        });
        state.bullets = state.bullets.filter((b) => b.y > 0);

        if (Math.random() < 0.05) {
          state.asteroids.push({
            x: Math.random() * canvas.width,
            y: 0,
            size: 12 + Math.random() * 18,
            speed: (1.2 + Math.random() * 2) * speedSetting * 0.4
          });
        }
        state.asteroids.forEach((ast) => {
          ast.y += ast.speed;
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(ast.x, ast.y, ast.size, 0, Math.PI * 2);
          ctx.stroke();

          state.bullets.forEach((b) => {
            if (Math.hypot(b.x - ast.x, b.y - ast.y) < ast.size + 6) {
              ast.y = canvas.height + 100;
              b.y = -100;
              state.score += 10;
              for (let i = 0; i < 12; i++) {
                state.particles.push({
                  x: ast.x,
                  y: ast.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: "#94a3b8",
                  life: 15
                });
              }
            }
          });
        });
        state.asteroids = state.asteroids.filter((a) => a.y < canvas.height);
      }
      
      // 3. NEON BREAKER
      else if (activeGame.id === "neon_breaker") {
        state.x += (mouseX.current - state.x) * 0.25;
        state.y = 270;

        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(state.x - 40, state.y, 80, 10);

        const ball = state.ball;
        ball.x += ball.vx * speedSetting * 0.4;
        ball.y += ball.vy * speedSetting * 0.4;

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.vx = -ball.vx;
        if (ball.y - ball.radius < 0) ball.vy = -ball.vy;
        if (ball.y + ball.radius >= state.y && ball.x >= state.x - 44 && ball.x <= state.x + 44) {
          ball.vy = -Math.abs(ball.vy);
          ball.vx = (ball.x - state.x) * 0.15;
        }
        if (ball.y > canvas.height + 20) {
          ball.x = 190;
          ball.y = 150;
          ball.vx = 2.5;
          ball.vy = -3.5;
        }

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        state.bricks.forEach((br) => {
          if (!br.active) return;
          ctx.fillStyle = br.color;
          ctx.fillRect(br.x, br.y, br.w, br.h);

          if (
            ball.x + ball.radius > br.x &&
            ball.x - ball.radius < br.x + br.w &&
            ball.y + ball.radius > br.y &&
            ball.y - ball.radius < br.y + br.h
          ) {
            br.active = false;
            ball.vy = -ball.vy;
            state.score += 20;
            for (let i = 0; i < 8; i++) {
              state.particles.push({
                x: br.x + br.w / 2,
                y: br.y + br.h / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: br.color,
                life: 15
              });
            }
          }
        });
        if (state.bricks.every((b) => !b.active)) state.bricks.forEach((b) => b.active = true);
      }
      
      // 4. SNAKE.LUA
      else if (activeGame.id === "snake_lua") {
        const now = Date.now();
        const cellSize = 16;
        if (now - state.lastSnakeUpdate > 120 - speedSetting * 8) {
          state.lastSnakeUpdate = now;
          const head = state.snake[0];
          const food = state.food;

          const dx = food.x - head.x;
          const dy = food.y - head.y;

          let nextDir = state.snakeDir;
          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && state.snakeDir !== "left") nextDir = "right";
            else if (dx < 0 && state.snakeDir !== "right") nextDir = "left";
            else if (dy > 0 && state.snakeDir !== "up") nextDir = "down";
            else if (dy < 0 && state.snakeDir !== "down") nextDir = "up";
          } else {
            if (dy > 0 && state.snakeDir !== "up") nextDir = "down";
            else if (dy < 0 && state.snakeDir !== "down") nextDir = "up";
            else if (dx > 0 && state.snakeDir !== "left") nextDir = "right";
            else if (dx < 0 && state.snakeDir !== "right") nextDir = "left";
          }
          state.snakeDir = nextDir;

          let nextHead = { ...head };
          if (state.snakeDir === "right") nextHead.x += 1;
          if (state.snakeDir === "left") nextHead.x -= 1;
          if (state.snakeDir === "down") nextHead.y += 1;
          if (state.snakeDir === "up") nextHead.y -= 1;

          const cols = Math.floor(canvas.width / cellSize);
          const rows = Math.floor(canvas.height / cellSize);

          if (nextHead.x < 0) nextHead.x = cols - 1;
          if (nextHead.x >= cols) nextHead.x = 0;
          if (nextHead.y < 0) nextHead.y = rows - 1;
          if (nextHead.y >= rows) nextHead.y = 0;

          state.snake.unshift(nextHead);
          if (nextHead.x === food.x && nextHead.y === food.y) {
            state.score += 10;
            state.food = {
              x: Math.floor(Math.random() * (cols - 2)) + 1,
              y: Math.floor(Math.random() * (rows - 2)) + 1
            };
            for (let i = 0; i < 10; i++) {
              state.particles.push({
                x: nextHead.x * cellSize + 8,
                y: nextHead.y * cellSize + 8,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: "#10b981",
                life: 15
              });
            }
          } else {
            state.snake.pop();
          }

          for (let i = 1; i < state.snake.length; i++) {
            if (nextHead.x === state.snake[i].x && nextHead.y === state.snake[i].y) {
              state.score = 0;
              state.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
              break;
            }
          }
        }

        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(state.food.x * cellSize + 8, state.food.y * cellSize + 8, 5, 0, Math.PI * 2);
        ctx.fill();

        state.snake.forEach((seg, idx) => {
          ctx.fillStyle = idx === 0 ? "#10b981" : "#047857";
          ctx.fillRect(seg.x * cellSize + 1, seg.y * cellSize + 1, cellSize - 2, cellSize - 2);
        });
      }
      
      // 5. TAP HOPPER
      else if (activeGame.id === "tap_hopper") {
        const hopper = state.hopper;
        hopper.vy += gravitySetting * 0.35;
        hopper.y += hopper.vy;

        if (hopper.y < hopper.radius) {
          hopper.y = hopper.radius;
          hopper.vy = 0;
        }
        if (hopper.y > canvas.height - hopper.radius) {
          hopper.y = canvas.height - hopper.radius;
          hopper.vy = 0;
          state.score = 0;
        }

        ctx.fillStyle = "#8b5cf6";
        ctx.beginPath();
        ctx.arc(100, hopper.y, hopper.radius, 0, Math.PI * 2);
        ctx.fill();

        const now = Date.now();
        if (now - state.lastPipeSpawn > 1600) {
          state.lastPipeSpawn = now;
          const gap = 85;
          const top = 40 + Math.random() * 120;
          state.pipes.push({ x: canvas.width, top, bottom: top + gap, passed: false });
        }

        state.pipes.forEach((p) => {
          p.x -= 2.5 * speedSetting * 0.25;
          ctx.fillStyle = "#1e293b";
          ctx.strokeStyle = "#8b5cf6";
          ctx.lineWidth = 2;
          ctx.fillRect(p.x, 0, 40, p.top);
          ctx.strokeRect(p.x, -2, 40, p.top + 2);
          ctx.fillRect(p.x, p.bottom, 40, canvas.height - p.bottom);
          ctx.strokeRect(p.x, p.bottom, 40, canvas.height - p.bottom + 2);

          if (p.x < 100 && !p.passed) {
            p.passed = true;
            state.score += 10;
          }

          if (
            100 + hopper.radius > p.x &&
            100 - hopper.radius < p.x + 40 &&
            (hopper.y - hopper.radius < p.top || hopper.y + hopper.radius > p.bottom)
          ) {
            state.score = 0;
            p.x = -100;
            for (let i = 0; i < 15; i++) {
              state.particles.push({
                x: 100,
                y: hopper.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: "#f43f5e",
                life: 15
              });
            }
          }
        });
        state.pipes = state.pipes.filter((p) => p.x > -60);
      }
      
      // 6. PIXEL SPRINT
      else if (activeGame.id === "pixel_sprint") {
        state.pixelRunner.distance += speedSetting * 0.15;
        const scrollOffset = (state.pixelRunner.distance) % canvas.width;

        // Draw parallax hills
        ctx.fillStyle = "#162032";
        ctx.beginPath();
        ctx.arc(canvas.width - scrollOffset, 240, 100, 0, Math.PI * 2);
        ctx.arc(2 * canvas.width - scrollOffset, 240, 120, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#22314d";
        ctx.fillRect(0, 230, canvas.width, canvas.height - 230);

        // Update physics
        const runner = state.pixelRunner;
        runner.vy += gravitySetting * 0.3;
        runner.y += runner.vy;
        if (runner.y >= 220) {
          runner.y = 220;
          runner.vy = 0;
        }

        // Coins & Obstacles spawn
        if (state.pixelCoins.length < 3) {
          state.pixelCoins.push({ x: canvas.width + Math.random() * 200, y: 160 + Math.random() * 50 });
        }
        if (state.pixelObstacles.length < 2) {
          state.pixelObstacles.push({ x: canvas.width + 100 + Math.random() * 300, y: 220 });
        }

        // Draw Coins
        ctx.fillStyle = "#eab308";
        state.pixelCoins.forEach((c) => {
          c.x -= speedSetting * 0.55;
          ctx.beginPath();
          ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
          ctx.fill();

          // Auto-jump logic
          if (c.x - 70 < 0 && runner.y >= 220 && c.y < 200) {
            runner.vy = -5.5;
          }

          // Collection
          if (Math.hypot(c.x - 70, c.y - runner.y) < 20) {
            state.score += 10;
            c.x = -100;
            for (let i = 0; i < 6; i++) {
              state.particles.push({
                x: c.x, y: c.y,
                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                color: "#eab308", life: 12
              });
            }
          }
        });
        state.pixelCoins = state.pixelCoins.filter((c) => c.x > -20);

        // Draw Spikes
        ctx.fillStyle = "#ef4444";
        state.pixelObstacles.forEach((obs) => {
          obs.x -= speedSetting * 0.55;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + 10);
          ctx.lineTo(obs.x + 10, obs.y - 10);
          ctx.lineTo(obs.x + 20, obs.y + 10);
          ctx.closePath();
          ctx.fill();

          // Auto-jump for spikes
          if (obs.x - 70 < 60 && obs.x - 70 > 0 && runner.y >= 220) {
            runner.vy = -6.0;
          }

          // Collision
          if (Math.hypot(obs.x + 10 - 70, obs.y - runner.y) < 18) {
            state.score = 0;
            obs.x = -100;
            for (let i = 0; i < 15; i++) {
              state.particles.push({
                x: 70, y: runner.y,
                vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                color: "#ef4444", life: 18
              });
            }
          }
        });
        state.pixelObstacles = state.pixelObstacles.filter((o) => o.x > -20);

        // Draw runner
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(65, runner.y - 10, 12, 20);
      }
      
      // 7. GEM CASCADE
      else if (activeGame.id === "gem_cascade") {
        const gemColors = ["#ef4444", "#10b981", "#3b82f6", "#eab308", "#a855f7"];
        
        // Auto match-making grid check
        if (timestamp - state.gemTimer > 1000) {
          state.gemTimer = timestamp;
          for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
              const g1 = state.gemGrid[r]?.[c];
              const g2 = state.gemGrid[r]?.[c+1];
              const g3 = state.gemGrid[r]?.[c+2];
              if (g1 && g2 && g3 && g1.color === g2.color && g2.color === g3.color && g1.state === "stable") {
                g1.color = gemColors[Math.floor(Math.random() * gemColors.length)];
                g2.color = gemColors[Math.floor(Math.random() * gemColors.length)];
                g3.color = gemColors[Math.floor(Math.random() * gemColors.length)];
                state.score += 30;
                [g1, g2, g3].forEach((g) => {
                  for (let i = 0; i < 5; i++) {
                    state.particles.push({
                      x: g.x, y: g.y,
                      vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                      color: g.color, life: 12
                    });
                  }
                });
              }
            }
          }
        }

        // Draw Gem layout
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 8; c++) {
            const gem = state.gemGrid[r][c];
            if (gem.y < gem.targetY) {
              gem.y += speedSetting * 0.6;
            } else {
              gem.y = gem.targetY;
            }
            ctx.fillStyle = gem.color;
            ctx.beginPath();
            ctx.arc(gem.x, gem.y, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.stroke();
          }
        }
      }
      
      // 8. BUBBLE BURST
      else if (activeGame.id === "bubble_burst") {
        const bubbleProj = state.bubbleProj;
        
        if (bubbleProj.active) {
          bubbleProj.x += bubbleProj.vx;
          bubbleProj.y += bubbleProj.vy;

          if (bubbleProj.x < 15 || bubbleProj.x > canvas.width - 15) {
            bubbleProj.vx = -bubbleProj.vx;
          }

          state.bubbleGrid.forEach((b) => {
            if (b.active && Math.hypot(b.x - bubbleProj.x, b.y - bubbleProj.y) < 22) {
              b.active = false;
              bubbleProj.active = false;
              state.score += 40;
              for (let i = 0; i < 10; i++) {
                state.particles.push({
                  x: b.x, y: b.y,
                  vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                  color: b.color, life: 15
                });
              }
              bubbleProj.x = 190;
              bubbleProj.y = 270;
              const colors = ["#f43f5e", "#0ea5e9", "#eab308", "#10b981"];
              bubbleProj.color = colors[Math.floor(Math.random() * colors.length)];
            }
          });

          if (bubbleProj.y < 0) {
            bubbleProj.active = false;
            bubbleProj.x = 190;
            bubbleProj.y = 270;
          }
        }

        // Draw top grid
        state.bubbleGrid.forEach((b) => {
          if (!b.active) return;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, 12, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw launcher arrow line
        const angle = (mouseX.current - 190) * 0.005;
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(190, 280);
        ctx.lineTo(190 + Math.sin(angle) * 35, 280 - Math.cos(angle) * 35);
        ctx.stroke();

        // Draw projectile bubble
        ctx.fillStyle = bubbleProj.color;
        ctx.beginPath();
        ctx.arc(bubbleProj.x, bubbleProj.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 9. TOWER SIEGE
      else if (activeGame.id === "tower_siege") {
        const path = [
          { x: 20, y: 150 },
          { x: 120, y: 150 },
          { x: 120, y: 80 },
          { x: 260, y: 80 },
          { x: 260, y: 220 },
          { x: 360, y: 220 }
        ];

        // Draw path
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();

        // Update Creeps
        state.towerCreeps.forEach((c) => {
          const target = path[c.targetIndex];
          if (!target) return;

          const dx = target.x - c.x;
          const dy = target.y - c.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 5) {
            c.targetIndex = (c.targetIndex + 1) % path.length;
            if (c.targetIndex === 0) {
              c.x = -40;
              c.y = 150;
              c.hp = 100;
            }
          } else {
            c.x += (dx / dist) * c.speed * speedSetting * 0.25;
            c.y += (dy / dist) * c.speed * speedSetting * 0.25;
          }

          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#10b981";
          ctx.fillRect(c.x - 10, c.y - 14, (c.hp / c.maxHp) * 20, 3);
        });

        // Update & shoot Towers
        state.towerTowers.forEach((tow) => {
          let target = null;
          for (let c of state.towerCreeps) {
            if (c.x > 0 && Math.hypot(c.x - tow.x, c.y - tow.y) < tow.range) {
              target = c;
              break;
            }
          }

          if (target && tow.cooldown <= 0) {
            tow.cooldown = 18;
            target.hp -= 25;
            ctx.strokeStyle = "#60a5fa";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(tow.x, tow.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();

            for (let i = 0; i < 4; i++) {
              state.particles.push({
                x: target.x, y: target.y,
                vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
                color: "#60a5fa", life: 10
              });
            }

            if (target.hp <= 0) {
              state.score += 50;
              target.x = -60;
              target.y = 150;
              target.hp = 100;
              target.targetIndex = 0;
            }
          }

          if (tow.cooldown > 0) tow.cooldown -= 1;

          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(tow.x - 10, tow.y - 10, 20, 20);
          ctx.fillStyle = "#1d4ed8";
          ctx.fillRect(tow.x - 4, tow.y - 15, 8, 5);

          if (Math.hypot(tow.x - mouseX.current, tow.y - 150) < 25) {
            ctx.strokeStyle = "rgba(59, 130, 246, 0.25)";
            ctx.beginPath();
            ctx.arc(tow.x, tow.y, tow.range, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
      }
      
      // 10. MAZE MUNCHER
      else if (activeGame.id === "maze_muncher") {
        const scale = 25;
        const offset = 60;
        const p = state.mazeMuncherPlayer;
        const ghost = state.mazeMuncherGhost;
        
        if (timestamp % 200 < 20) {
          let nearest = null;
          let minDist = 999;
          state.mazeMuncherDots.forEach((d) => {
            const dist = Math.hypot(d.x - p.x, d.y - p.y);
            if (dist < minDist) {
              minDist = dist;
              nearest = d;
            }
          });

          if (nearest) {
            const nd = nearest as any;
            if (nd.x > p.x) { p.x += 1; }
            else if (nd.x < p.x) { p.x -= 1; }
            else if (nd.y > p.y) { p.y += 1; }
            else if (nd.y < p.y) { p.y -= 1; }
          }

          const gDist = Math.hypot(p.x - ghost.x, p.y - ghost.y);
          if (gDist > 0) {
            if (p.x > ghost.x) ghost.x += 1;
            else if (p.x < ghost.x) ghost.x -= 1;
            else if (p.y > ghost.y) ghost.y += 1;
            else if (p.y < ghost.y) ghost.y -= 1;
          }
        }

        // Draw Pacman Dots
        ctx.fillStyle = "#ffffff";
        state.mazeMuncherDots.forEach((d) => {
          ctx.beginPath();
          ctx.arc(offset + d.x * scale, offset + d.y * scale, 3, 0, Math.PI * 2);
          ctx.fill();

          if (d.x === p.x && d.y === p.y) {
            state.score += 10;
            state.mazeMuncherDots = state.mazeMuncherDots.filter((dt) => dt !== d);
          }
        });

        if (state.mazeMuncherDots.length === 0) {
          resetGameData();
        }

        if (p.x === ghost.x && p.y === ghost.y) {
          state.score = 0;
          p.x = 1; p.y = 1;
          ghost.x = 8; ghost.y = 8;
        }

        ctx.fillStyle = "#eab308";
        ctx.beginPath();
        ctx.arc(offset + p.x * scale, offset + p.y * scale, 9, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(offset + p.x * scale, offset + p.y * scale);
        ctx.fill();

        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(offset + ghost.x * scale, offset + ghost.y * scale, 9, Math.PI, 0);
        ctx.lineTo(offset + ghost.x * scale + 9, offset + ghost.y * scale + 10);
        ctx.lineTo(offset + ghost.x * scale - 9, offset + ghost.y * scale + 10);
        ctx.fill();
      }
      
      // 11. SKY RACER
      else if (activeGame.id === "sky_racer") {
        state.skyRacerPlayerX += (mouseX.current - state.skyRacerPlayerX) * 0.25;
        state.skyRacerPlayerX = Math.max(50, Math.min(330, state.skyRacerPlayerX));
        state.y = 240;

        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 4;
        ctx.setLineDash([15, 15]);
        ctx.beginPath();
        ctx.moveTo(125, 0); ctx.lineTo(125, canvas.height);
        ctx.moveTo(250, 0); ctx.lineTo(250, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        if (Math.random() < 0.045 && state.skyRacerTraffic.length < 3) {
          const lanes = [60, 185, 310];
          state.skyRacerTraffic.push({
            x: lanes[Math.floor(Math.random() * lanes.length)],
            y: -80,
            speed: (2.5 + Math.random() * 2.5) * speedSetting * 0.4,
            color: ["#ef4444", "#f59e0b", "#8b5cf6"][Math.floor(Math.random() * 3)]
          });
        }

        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(state.skyRacerPlayerX - 16, state.y - 25, 32, 50);

        state.skyRacerTraffic.forEach((c) => {
          c.y += c.speed;
          ctx.fillStyle = c.color;
          ctx.fillRect(c.x - 16, c.y - 25, 32, 50);

          if (c.y > canvas.height + 50) {
            state.score += 10;
          }

          if (
            Math.abs(state.skyRacerPlayerX - c.x) < 30 &&
            Math.abs(state.y - c.y) < 40
          ) {
            state.score = 0;
            c.y = canvas.height + 200;
            for (let i = 0; i < 20; i++) {
              state.particles.push({
                x: c.x, y: c.y,
                vx: (Math.random() - 0.5) * 7, vy: (Math.random() - 0.5) * 7,
                color: "#f59e0b", life: 18
              });
            }
          }
        });
        state.skyRacerTraffic = state.skyRacerTraffic.filter((c) => c.y < canvas.height + 80);
      }
      
      // 12. LUA LANDER
      else if (activeGame.id === "lua_lander") {
        const lander = state.landerSpacecraft;

        lander.vy += gravitySetting * 0.14;
        lander.y += lander.vy;
        lander.x += lander.vx;

        if (isMouseDown.current && lander.fuel > 0) {
          lander.vy -= 0.35;
          lander.fuel = Math.max(0, lander.fuel - 1.2);
          lander.vx += (mouseX.current - lander.x) * 0.006;

          for (let i = 0; i < 3; i++) {
            state.particles.push({
              x: lander.x, y: lander.y + 12,
              vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 2,
              color: "#f97316", life: 10
            });
          }
        }

        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 260);
        ctx.lineTo(120, 280);
        ctx.lineTo(160, 240);
        ctx.lineTo(240, 240);
        ctx.lineTo(290, 290);
        ctx.lineTo(380, 270);
        ctx.stroke();

        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(160, 240); ctx.lineTo(240, 240);
        ctx.stroke();

        if (lander.y > 230 && lander.x >= 155 && lander.x <= 245) {
          if (lander.y >= 234) {
            lander.y = 234;
            if (Math.abs(lander.vy) < speedSetting * 0.45 && Math.abs(lander.vx) < 1.5) {
              state.score += 100;
              for (let i = 0; i < 20; i++) {
                state.particles.push({
                  x: lander.x, y: lander.y,
                  vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
                  color: "#10b981", life: 18
                });
              }
            } else {
              state.score = 0;
              for (let i = 0; i < 25; i++) {
                state.particles.push({
                  x: lander.x, y: lander.y,
                  vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
                  color: "#ef4444", life: 25
                });
              }
            }
            lander.x = 190; lander.y = 50; lander.vx = 1; lander.vy = 0; lander.fuel = 100;
          }
        } else if (lander.y > 270 || lander.x < 0 || lander.x > canvas.width) {
          state.score = 0;
          for (let i = 0; i < 20; i++) {
            state.particles.push({
              x: lander.x, y: Math.min(270, lander.y),
              vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
              color: "#ef4444", life: 20
            });
          }
          lander.x = 190; lander.y = 50; lander.vx = 1; lander.vy = 0; lander.fuel = 100;
        }

        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(lander.x - 8, lander.y - 6, 16, 12);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lander.x - 8, lander.y + 6); ctx.lineTo(lander.x - 12, lander.y + 12);
        ctx.moveTo(lander.x + 8, lander.y + 6); ctx.lineTo(lander.x + 12, lander.y + 12);
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`Fuel: ${Math.floor(lander.fuel)}%`, 15, 30);
        ctx.fillText(`Descent Speed: ${lander.vy.toFixed(2)}`, 15, 42);
      }
      
      // 13. CARD CLASH
      else if (activeGame.id === "card_clash") {
        const cc = state.cardClash;
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 3;

        const x1 = 110, x2 = 270, y = 140;

        if (cc.state === "flipping") {
          const elapsed = Date.now() - cc.timer;
          if (elapsed > 1000) {
            cc.state = "revealed";
            if (cc.card1.val > cc.card2.val) {
              state.score += 50;
            }
          }
        }

        ctx.strokeRect(x1 - 35, y - 55, 70, 110);
        if (cc.state === "revealed") {
          ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
          ctx.fillRect(x1 - 35, y - 55, 70, 110);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 20px Outfit";
          ctx.textAlign = "center";
          ctx.fillText(cc.card1.val.toString(), x1, y + 8);
        } else {
          ctx.fillStyle = "rgba(139, 92, 246, 0.15)";
          ctx.fillRect(x1 - 35, y - 55, 70, 110);
          ctx.fillStyle = "#8b5cf6";
          ctx.font = "14px Outfit";
          ctx.textAlign = "center";
          ctx.fillText("?", x1, y + 5);
        }

        ctx.strokeRect(x2 - 35, y - 55, 70, 110);
        if (cc.state === "revealed") {
          ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
          ctx.fillRect(x2 - 35, y - 55, 70, 110);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 20px Outfit";
          ctx.textAlign = "center";
          ctx.fillText(cc.card2.val.toString(), x2, y + 8);
        } else {
          ctx.fillStyle = "rgba(139, 92, 246, 0.15)";
          ctx.fillRect(x2 - 35, y - 55, 70, 110);
          ctx.fillStyle = "#8b5cf6";
          ctx.font = "14px Outfit";
          ctx.textAlign = "center";
          ctx.fillText("?", x2, y + 5);
        }

        if (cc.state === "revealed") {
          ctx.font = "bold 18px Outfit";
          ctx.textAlign = "center";
          if (cc.card1.val > cc.card2.val) {
            ctx.fillStyle = "#10b981";
            ctx.fillText("🏆 YOU WIN! Click to Duel again.", 190, 240);
          } else if (cc.card1.val < cc.card2.val) {
            ctx.fillStyle = "#ef4444";
            ctx.fillText("⚡ YOU LOSE. Click to Duel again.", 190, 240);
          } else {
            ctx.fillStyle = "#94a3b8";
            ctx.fillText("TIE GAME! Click to Duel again.", 190, 240);
          }

          if (isMouseDown.current) {
            cc.state = "idle";
          }
        } else if (cc.state === "idle") {
          ctx.fillStyle = "#94a3b8";
          ctx.font = "12px Outfit";
          ctx.textAlign = "center";
          ctx.fillText("Tap anywhere on screen to FLIP & DUEL!", 190, 240);
        }
      }
      
      // 14. WHACK CRITTER
      else if (activeGame.id === "whack_critter") {
        state.whackMoles.forEach((m) => {
          m.timer -= 16 * speedSetting * 0.25;
          if (m.timer <= 0) {
            m.state = m.state === "down" ? "up" : "down";
            m.timer = 1500 + Math.random() * 2000;
          }

          ctx.strokeStyle = "#334155";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(m.x, m.y + 10, 28, 10, 0, 0, 2 * Math.PI);
          ctx.stroke();

          if (m.state === "up") {
            ctx.fillStyle = "#b45309";
            ctx.beginPath();
            ctx.arc(m.x, m.y, 16, Math.PI, 0);
            ctx.lineTo(m.x + 16, m.y + 10);
            ctx.lineTo(m.x - 16, m.y + 10);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(m.x - 5, m.y - 4, 3, 3);
            ctx.fillRect(m.x + 2, m.y - 4, 3, 3);
            ctx.fillStyle = "#000000";
            ctx.fillRect(m.x - 4, m.y - 3, 1.5, 1.5);
            ctx.fillRect(m.x + 3, m.y - 3, 1.5, 1.5);
          }
        });
      }
      
      // 15. STAR FORGE
      else if (activeGame.id === "star_forge") {
        ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        let first = true;
        state.starForgeNodes.forEach((n) => {
          if (n.connected) {
            if (first) {
              ctx.moveTo(n.x, n.y);
              first = false;
            } else {
              ctx.lineTo(n.x, n.y);
            }
          }
        });
        ctx.stroke();

        state.starForgeNodes.forEach((n) => {
          ctx.fillStyle = n.connected ? "#c084fc" : "#4b5563";
          ctx.beginPath();
          ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();

          if (Math.hypot(n.x - mouseX.current, n.y - 150) < 45) {
            ctx.strokeStyle = "rgba(96, 165, 250, 0.4)";
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouseX.current, 150);
            ctx.stroke();
          }
        });

        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px Outfit";
        ctx.textAlign = "center";
        ctx.fillText("Move mouse near grey stars & click to connect constellation!", 190, 275);
      }
      
      // 16. BLOCK DROP
      else if (activeGame.id === "block_drop") {
        const proj = state.blockDropProj;

        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(60, 220); ctx.lineTo(60, 270);
        ctx.stroke();

        if (proj.state === "idle") {
          proj.x = 60; proj.y = 220;
        } else if (proj.state === "dragging") {
          proj.x = Math.max(15, Math.min(110, mouseX.current));
          proj.y = 220;
          ctx.strokeStyle = "#b45309";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(60, 220);
          ctx.lineTo(proj.x, proj.y);
          ctx.stroke();
        } else if (proj.state === "flying") {
          proj.vy += gravitySetting * 0.15;
          proj.x += proj.vx;
          proj.y += proj.vy;

          state.blockDropBlocks.forEach((b) => {
            if (
              proj.x > b.x - b.w/2 && proj.x < b.x + b.w/2 &&
              proj.y > b.y - b.h/2 && proj.y < b.y + b.h/2
            ) {
              b.vx += proj.vx * 0.35;
              b.vy -= 2.0;
              b.vr = 0.08;
              proj.vx *= 0.4;
              state.score += 30;

              for (let i = 0; i < 8; i++) {
                state.particles.push({
                  x: proj.x, y: proj.y,
                  vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                  color: "#cbd5e1", life: 12
                });
              }
            }
          });

          if (proj.y > 280 || proj.x > canvas.width) {
            proj.state = "idle";
          }
        }

        state.blockDropBlocks.forEach((b) => {
          b.vy += gravitySetting * 0.15;
          b.y += b.vy;
          b.x += b.vx;
          b.r += b.vr;

          if (b.y > 230) {
            b.y = 230;
            b.vy = 0;
            b.vx *= 0.82;
            b.vr *= 0.8;
          }

          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.r);
          ctx.fillStyle = "#64748b";
          ctx.fillRect(-b.w/2, -b.h/2, b.w, b.h);
          ctx.strokeStyle = "#cbd5e1";
          ctx.strokeRect(-b.w/2, -b.h/2, b.w, b.h);
          ctx.restore();
        });

        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px Outfit";
        ctx.textAlign = "center";
        ctx.fillText(
          proj.state === "idle" ? "Pull back on red ball & release to shoot!" : "Flying!",
          190,
          30
        );
      }

      // Render score
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 16px Outfit, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`SCORE: ${state.score.toString().padStart(6, "0")}`, canvas.width - 20, 30);

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animId);
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
                    <span>Score multiplier: {speedSetting.toFixed(1)}x</span>
                  </div>

                  <div className="flex justify-center p-4 bg-slate-950/90 relative">
                    <canvas
                      ref={modalCanvasRef}
                      width={380}
                      height={300}
                      className="bg-slate-950 border border-white/5 rounded-xl w-full max-w-[420px] aspect-[1.26/1] cursor-pointer"
                    />
                    {activeGame.playable && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/10 px-4 py-1.5 rounded-full text-[10px] text-slate-400 font-bold uppercase tracking-wider pointer-events-none backdrop-blur shadow-lg">
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
