"use client";

import React, { useEffect, useRef, useState } from "react";

// Colors from Solar2D design system
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
  mut: '#8E89B8',
  dim: '#4a4570'
};

const TAU = Math.PI * 2;

// Utility functions
const rnd = (a = 1, b?: number) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => v < a ? a : v > b ? b : v;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Particle Engine
class Particles {
  ps: any[] = [];
  burst(x: number, y: number, color: string, n = 10, spd = 120) {
    for (let i = 0; i < n; i++) {
      const a = rnd(TAU);
      const s = rnd(spd * 0.3, spd);
      this.ps.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: rnd(0.3, 0.7),
        age: 0,
        color,
        size: rnd(1.4, 3.4),
        g: rnd(140, 240)
      });
    }
  }
  step(dt: number) {
    for (let i = this.ps.length - 1; i >= 0; i--) {
      const p = this.ps[i];
      p.age += dt;
      if (p.age >= p.life) {
        this.ps.splice(i, 1);
        continue;
      }
      p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.ps) {
      const k = 1 - p.age / p.life;
      ctx.globalAlpha = k;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

// Background starfield generator
const generateStarfield = (n: number, w: number, h: number) => {
  const stars = [];
  for (let i = 0; i < n; i++) {
    stars.push({
      x: rnd(w),
      y: rnd(h),
      z: rnd(0.3, 1),
      tw: rnd(TAU)
    });
  }
  return stars;
};

export default function HeroCabinet() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [score, setScore] = useState(0);
  const [isAttractMode, setIsAttractMode] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  // Game states
  const scoreRef = useRef(0);
  const shipX = useRef(150);
  const shipTargetX = useRef(150);
  const falls = useRef<any[]>([]);
  const spawnTimer = useRef(0);
  const shake = useRef(0);
  const aiTargetX = useRef(150);
  const t = useRef(0);
  const pointerActive = useRef(false);
  const pointerX = useRef(150);
  const particles = useRef(new Particles());
  const starfieldRef = useRef<any[]>([]);

  // Monitor visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Main canvas sizing and gameloop mounting
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId: number;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width || 480;
      height = rect.height || 270;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Starfield initialization
      if (starfieldRef.current.length === 0) {
        starfieldRef.current = generateStarfield(46, width, height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const spawnStar = (w: number) => {
      const bomb = Math.random() < 0.16;
      falls.current.push({
        x: rnd(16, w - 16),
        y: -14,
        v: rnd(60, 120),
        bomb,
        r: bomb ? 9 : 8,
        sp: rnd(TAU)
      });
    };

    const drawStarPath = (c: CanvasRenderingContext2D, x: number, y: number, r: number, n = 5, inner = 0.45) => {
      c.beginPath();
      for (let i = 0; i < n * 2; i++) {
        const angle = i / (n * 2) * TAU - Math.PI / 2;
        const rad = (i % 2) ? r * inner : r;
        const px = x + Math.cos(angle) * rad;
        const py = y + Math.sin(angle) * rad;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
    };

    const bgGradient = (c: CanvasRenderingContext2D, w: number, h: number, c0: string, c1: string) => {
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, c0);
      g.addColorStop(1, c1);
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    };

    const drawStarfieldLocal = (c: CanvasRenderingContext2D, stars: any[], w: number, h: number, time: number, scroll: number) => {
      for (const s of stars) {
        if (scroll) {
          s.y += s.z * scroll;
          if (s.y > h) {
            s.y = 0;
            s.x = rnd(w);
          }
        }
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(time * 2 + s.tw));
        c.globalAlpha = alpha * s.z;
        c.fillStyle = C.star;
        c.fillRect(s.x, s.y, s.z * 1.6, s.z * 1.6);
      }
      c.globalAlpha = 1;
    };

    let lastTime = performance.now();

    const loop = (now: number) => {
      if (!isVisible) {
        lastTime = now;
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t.current += dt;

      // Spawning stars
      spawnTimer.current -= dt;
      if (spawnTimer.current <= 0) {
        spawnStar(width);
        spawnTimer.current = rnd(0.4, 0.85);
      }

      // Movement controls (Attract mode AI or Player control)
      if (pointerActive.current && !isAttractMode) {
        shipTargetX.current = pointerX.current;
      } else {
        // AI: Track the lowest non-bomb falling star
        let best: any = null;
        let bestDist = 1e9;
        for (const f of falls.current) {
          if (f.bomb) continue;
          const d = height - f.y;
          if (d < bestDist) {
            bestDist = d;
            best = f;
          }
        }
        if (best) {
          aiTargetX.current = best.x;
        }
        shipTargetX.current = lerp(shipTargetX.current, aiTargetX.current, 0.04);
      }

      shipX.current = lerp(shipX.current, clamp(shipTargetX.current, 18, width - 18), 0.18);

      // Update falling entities
      for (let i = falls.current.length - 1; i >= 0; i--) {
        const f = falls.current[i];
        f.y += f.v * dt;
        f.sp += dt * 3;

        if (f.y > height + 16) {
          falls.current.splice(i, 1);
          continue;
        }

        // Collision logic
        if (f.y > height - 46 && Math.abs(f.x - shipX.current) < 24) {
          if (f.bomb) {
            shake.current = 10;
            scoreRef.current = Math.max(0, scoreRef.current - 25);
            particles.current.burst(f.x, f.y, C.coral, 16, 180);
          } else {
            scoreRef.current += 10;
            particles.current.burst(f.x, f.y, C.sun, 12, 150);
          }
          setScore(scoreRef.current);
          falls.current.splice(i, 1);
        }
      }

      particles.current.step(dt);

      // Clear & repaint background
      bgGradient(ctx, width, height, '#121218', '#070709');
      drawStarfieldLocal(ctx, starfieldRef.current, width, height, t.current, 18 * dt * 60);

      // Shake effect
      let sx = 0;
      let sy = 0;
      if (shake.current > 0) {
        sx = rnd(-shake.current, shake.current);
        sy = rnd(-shake.current, shake.current);
        shake.current *= 0.86;
        if (shake.current < 0.4) shake.current = 0;
      }

      ctx.save();
      ctx.translate(sx, sy);

      // Render falling items
      for (const f of falls.current) {
        if (f.bomb) {
          ctx.fillStyle = C.coral;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, TAU);
          ctx.fill();
          ctx.strokeStyle = '#2a0e0e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(f.x - 4, f.y - 4);
          ctx.lineTo(f.x + 4, f.y + 4);
          ctx.moveTo(f.x + 4, f.y - 4);
          ctx.lineTo(f.x - 4, f.y + 4);
          ctx.stroke();
        } else {
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.rotate(f.sp);
          ctx.fillStyle = C.sun;
          ctx.shadowColor = C.sun;
          ctx.shadowBlur = 10;
          drawStarPath(ctx, 0, 0, f.r, 5, 0.45);
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.shadowBlur = 0;

      // Render ship
      ctx.save();
      ctx.translate(shipX.current, height - 30);
      ctx.fillStyle = C.star;
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(15, 12);
      ctx.lineTo(0, 5);
      ctx.lineTo(-15, 12);
      ctx.closePath();
      ctx.fill();

      // Reactor core
      ctx.fillStyle = C.moon;
      ctx.beginPath();
      ctx.arc(0, -2, 4, 0, TAU);
      ctx.fill();

      // Engine Thruster flame
      ctx.fillStyle = C.coral;
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(t.current * 30);
      ctx.beginPath();
      ctx.moveTo(-5, 12);
      ctx.lineTo(0, 12 + rnd(6, 12));
      ctx.lineTo(5, 12);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();

      // Render particle bursts
      particles.current.draw(ctx);

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, isAttractMode]);

  // Pointer interactions
  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // Scale screen pointer to canvas coordinates
    const x = ((e.clientX - rect.left) / rect.width) * (canvas.width / dpr);
    pointerX.current = x;
    pointerActive.current = true;
  };

  const handlePointerLeave = () => {
    pointerActive.current = false;
  };

  const startManualPlay = () => {
    setIsAttractMode(false);
    scoreRef.current = 0;
    setScore(0);
    falls.current = [];
  };

  return (
    <div ref={containerRef} className="w-full">
      <div className="cabinet relative rounded-3xl p-3 sm:p-4 bg-gradient-to-br from-[#121216] to-[#0a0a0d] border border-white/5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.02)]">
        
        {/* Playable screen frame */}
        <div className="screen relative rounded-xl overflow-hidden aspect-video bg-[#070709] border border-white/5 shadow-inner select-none">
          
          <canvas
            ref={canvasRef}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={handlePointerLeave}
            className="block w-full h-full cursor-crosshair"
            aria-label="Playable retro space star-catcher game"
          />

          {/* CRT scanlines effect */}
          <div className="scan absolute inset-0 pointer-events-none z-10 mix-blend-overlay opacity-30 bg-repeat-y bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_0px_1px,transparent_1px_3px)]"></div>
          
          {/* Vignette retro shading */}
          <div className="vig absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_80px_rgba(8,6,18,0.7)]"></div>

          {/* HUD Score */}
          <div className="hud absolute top-3 left-4 z-20 font-mono text-[10px] sm:text-xs text-[#E5A93B] drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] tracking-wider font-bold">
            <span className="text-[#A47E3C] mr-1.5">SCORE</span>
            <span>{String(score).padStart(6, "0")}</span>
          </div>

          {/* Attract / Active play indicator */}
          <div className="absolute right-4 bottom-3 z-20 font-mono text-[9px] sm:text-[10px] text-[#8E89B8] bg-black/40 px-2 py-0.5 rounded border border-white/5 uppercase select-none">
            {isAttractMode ? "attract mode" : "manual play"}
          </div>

          {/* Play/Start Button */}
          {isAttractMode && (
            <button
              onClick={startManualPlay}
              className="startbtn absolute z-30 left-1/2 bottom-5 sm:bottom-6 -translate-x-1/2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-lg bg-[#E5A93B] hover:bg-[#ffc266] text-[#050507] font-black uppercase text-[10px] sm:text-xs tracking-wider cursor-pointer border-0 shadow-[0_6px_0_#A47E3C,0_14px_24px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_#A47E3C] transition-all animate-pulse"
            >
              ▶ PRESS START
            </button>
          )}

        </div>

      </div>

      {/* Hero Stats Row directly coupled */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="flex flex-col bg-[#0d0d10]/60 border border-white/5 rounded-2xl p-4 shadow-sm hover:border-[#E5A93B]/20 transition-colors">
          <span className="text-[#E5A93B] text-2xl font-black font-sans leading-none">16</span>
          <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider mt-1.5">game builds</span>
        </div>
        <div className="flex flex-col bg-[#0d0d10]/60 border border-white/5 rounded-2xl p-4 shadow-sm hover:border-[#E5A93B]/20 transition-colors">
          <span className="text-[#A47E3C] text-2xl font-black font-sans leading-none">2024→</span>
          <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider mt-1.5">now &amp; counting</span>
        </div>
        <div className="flex flex-col bg-[#0d0d10]/60 border border-white/5 rounded-2xl p-4 shadow-sm hover:border-[#E5A93B]/20 transition-colors">
          <span className="text-[#FF6B57] text-2xl font-black font-sans leading-none">Lua</span>
          <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider mt-1.5">core language</span>
        </div>
        <div className="flex flex-col bg-[#0d0d10]/60 border border-white/5 rounded-2xl p-4 shadow-sm hover:border-[#E5A93B]/20 transition-colors">
          <span className="text-[#5BE2A0] text-2xl font-black font-sans leading-none">iOS/Android</span>
          <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider mt-1.5">cross-platform</span>
        </div>
      </div>
    </div>
  );
}
