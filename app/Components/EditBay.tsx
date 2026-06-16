"use client";

import React, { useEffect, useRef, useState } from "react";

// Color constants matching the Solar2D theme
const C = {
  bg0: '#060608',
  bg1: '#0d0d10',
  bg2: '#15151b',
  line: '#222227',
  sun: '#E5A93B',
  coral: '#FF6B57',
  moon: '#A47E3C',
  starc: '#FFB23E',
  green: '#5BE2A0',
  pink: '#FF8FD0',
  text: '#EDEBFF',
  mut: '#A29DC9',
  dim: '#6E699A'
};

interface ClipItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  tag: string;
  skills: string;
}

const CLIPS: ClipItem[] = [
  {
    id: "grading",
    title: "Colour Grade Reel",
    description: "Flat log footage taken to a finished teal-and-orange look, balanced on the waveform and vectorscope rather than by eye.",
    duration: "00:14",
    tag: "Grading",
    skills: "Scopes · LUTs"
  },
  {
    id: "commercial",
    title: "Brand Promo · 60s Spot",
    description: "Punchy kinetic-type spot cut to a music bed, with animated titles and hard beat-matched cuts.",
    duration: "01:00",
    tag: "Commercial",
    skills: "Motion titles"
  },
  {
    id: "music",
    title: "Music Video",
    description: "Performance edit cut to 120bpm: beat-synced cuts, zoom punches and rhythm-matched transitions.",
    duration: "03:12",
    tag: "Music",
    skills: "Beat-sync"
  },
  {
    id: "multicam",
    title: "Live Event · Multicam",
    description: "Four angles synced by audio waveform, cut live-style on the timeline into one clean program feed.",
    duration: "08:40",
    tag: "Multicam",
    skills: "4-cam sync"
  },
  {
    id: "documentary",
    title: "Documentary Cutdown",
    description: "Interview-led edit with animated lower-thirds, B-roll cutaways and music ducked under the voice.",
    duration: "05:28",
    tag: "Documentary",
    skills: "Lower-thirds"
  },
  {
    id: "trailer",
    title: "Short-Form Trailer",
    description: "Letterboxed teaser with staged text reveals building to a title card. Tension carried by pacing.",
    duration: "00:45",
    tag: "Trailer",
    skills: "Title design"
  }
];

// Math helpers for high-fidelity animations
const TAU = Math.PI * 2;
const rnd = (a = 1, b?: number) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => v < a ? a : v > b ? b : v;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Reusable clip card preview canvas
function ClipPreview({ clip }: { clip: ClipItem }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameId = useRef<number | null>(null);
  const t = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width || 240;
      height = rect.height || 135;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const loop = (timestamp: number) => {
      if (!isVisible) {
        animationFrameId.current = requestAnimationFrame(loop);
        return;
      }

      t.current = timestamp * 0.001;
      ctx.clearRect(0, 0, width, height);

      // Render loops matching the original index.html simulations
      switch (clip.id) {
        case "grading": {
          // LWColorGrade: wipe comparison of raw and color-graded scene
          const wipeTime = (t.current % 6) / 6;
          const wipeX = (Math.sin(wipeTime * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5) * width;
          
          const drawScene = (isGraded: boolean) => {
            const g = ctx.createLinearGradient(0, 0, 0, height);
            if (isGraded) {
              g.addColorStop(0, '#173a44');
              g.addColorStop(0.5, '#b6663a');
              g.addColorStop(1, '#0d1b2a');
            } else {
              g.addColorStop(0, '#5e6668');
              g.addColorStop(0.5, '#7c7468');
              g.addColorStop(1, '#4a5052');
            }
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, width, height);

            // Sun/Moon
            ctx.fillStyle = isGraded ? '#ffcaa0' : '#cfcabf';
            ctx.beginPath();
            ctx.arc(width * 0.66, height * 0.4, height * 0.12, 0, Math.PI * 2);
            ctx.fill();

            // Mountain
            ctx.fillStyle = isGraded ? '#0c1622' : '#565a5b';
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.quadraticCurveTo(width * 0.5, height * 0.52, width, height);
            ctx.closePath();
            ctx.fill();
          };

          // Draw graded base layer
          drawScene(true);

          // Draw raw layer clipped to wipe slider position
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, wipeX, height);
          ctx.clip();
          drawScene(false);
          ctx.restore();

          // Wipe line
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(wipeX, 0);
          ctx.lineTo(wipeX, height);
          ctx.stroke();

          // Wipe slider head marker
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(wipeX, height / 2, 4, 0, Math.PI * 2);
          ctx.fill();

          // Text overlay
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'left';
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.fillText('RAW', 8, 14);
          
          ctx.textAlign = 'right';
          ctx.fillStyle = C.sun;
          ctx.fillText('GRADED', width - 8, 14);

          // Vectorscope widget (circular graph in bottom right)
          const cx = width - 22, cy = height - 22, r = 12;
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
          
          // Draw scopes animated waveform lines
          ctx.strokeStyle = C.green;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + t.current * 2;
            const noise = r * (0.4 + Math.sin(t.current * 4 + i) * 0.3);
            const px = cx + Math.cos(angle) * noise;
            const py = cy + Math.sin(angle) * noise;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
          break;
        }

        case "commercial": {
          // LWKinetic: kinetic typography word flashes on beat
          const beat = 0.55;
          const idx = Math.floor(t.current / beat);
          const local = (t.current % beat) / beat;
          const words = ['BRAND', 'LAUNCH', 'BOLD', 'NEW', 'NOW', 'MOVE'];
          const bgs = ['#ff6b57', '#7C6CFF', '#15132B', '#FFB23E', '#5BE2A0'];
          
          ctx.fillStyle = bgs[idx % bgs.length];
          ctx.fillRect(0, 0, width, height);

          ctx.save();
          ctx.translate(width / 2, height / 2);
          const s = lerp(1.25, 1, easeOut(clamp(local * 2, 0, 1)));
          ctx.scale(s, s);

          ctx.globalAlpha = clamp(local * 4, 0, 1) * clamp((1 - local) * 4, 0, 1);
          ctx.fillStyle = (idx % bgs.length === 2) ? '#ffffff' : '#13102a';
          ctx.font = `800 ${Math.floor(height * 0.3)}px "Bricolage Grotesque", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(words[idx % words.length], 0, 0);
          ctx.restore();
          
          ctx.globalAlpha = 1;
          ctx.textBaseline = 'alphabetic';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(0, height * 0.82, width * easeOut(clamp(local * 1.5, 0, 1)), 2.5);
          break;
        }

        case "music": {
          // LWMusic: visualizer bars with speaker silhouette
          const beat = 0.5;
          const idx = Math.floor(t.current / beat);
          const local = (t.current % beat) / beat;
          const pulse = Math.pow(1 - local, 2);
          const pal = [
            ['#ff6b57', '#7C6CFF'],
            ['#FFB23E', '#FF8FD0'],
            ['#5BE2A0', '#9FE8FF'],
            ['#7C6CFF', '#15132B']
          ];
          const pair = pal[idx % pal.length];
          const g = ctx.createLinearGradient(0, 0, width, height);
          g.addColorStop(0, pair[0]);
          g.addColorStop(1, pair[1]);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, width, height);

          ctx.save();
          ctx.translate(width / 2, height / 2);
          const z = 1 + pulse * 0.06;
          ctx.scale(z, z);
          ctx.translate(-width / 2, -height / 2);

          // Speaker/Singer silhouette
          ctx.fillStyle = 'rgba(10, 8, 20, 0.5)';
          ctx.beginPath();
          ctx.arc(width / 2, height * 0.4, height * 0.16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(width / 2 - height * 0.18, height * 0.54, height * 0.36, height * 0.5);
          ctx.restore();

          // Audio VU visualizer bars
          const bars = 12;
          const bw = width / bars;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
          for (let i = 0; i < bars; i++) {
            const amp = clamp((0.15 + 0.3 * Math.abs(Math.sin(t.current * 3 + i * 0.7))) + pulse * 0.5 * Math.abs(Math.sin(t.current * 6 + i)), 0, 1);
            const bh = amp * height * 0.4;
            ctx.fillRect(i * bw + 2, height - bh, bw - 4, bh);
          }

          // Pulse flash overlay
          ctx.fillStyle = `rgba(255, 255, 255, ${pulse * 0.22})`;
          ctx.fillRect(0, 0, width, height);
          break;
        }

        case "multicam": {
          // LWMulticam: 2x2 camera monitor angles grid switcher
          ctx.fillStyle = '#08070f';
          ctx.fillRect(0, 0, width, height);

          const cols = ['#ff6b57', '#7C6CFF', '#5BE2A0', '#FFB23E'];
          const gap = 2;
          const cw = (width - gap) / 2;
          const ch = (height - gap) / 2;
          const live = Math.floor(t.current / 0.7) % 4;
          const pos = [
            [0, 0],
            [cw + gap, 0],
            [0, ch + gap],
            [cw + gap, ch + gap]
          ];

          const drawAngle = (ax: number, ay: number, acw: number, ach: number, idx: number) => {
            ctx.save();
            ctx.beginPath();
            ctx.rect(ax, ay, acw, ach);
            ctx.clip();

            const g = ctx.createLinearGradient(ax, ay, ax + acw, ay + ach);
            g.addColorStop(0, cols[idx]);
            g.addColorStop(1, '#0c0a18');
            ctx.fillStyle = g;
            ctx.fillRect(ax, ay, acw, ach);

            // Silhouette shape
            ctx.fillStyle = 'rgba(10, 8, 20, 0.5)';
            const sx = ax + acw / 2 + Math.sin(t.current * 1.5 + idx) * acw * 0.2;
            ctx.beginPath();
            ctx.arc(sx, ay + ach * 0.56, ach * 0.18, 0, Math.PI * 2);
            ctx.fill();

            // Label tag text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.font = '7px "JetBrains Mono", monospace';
            ctx.textAlign = 'left';
            ctx.fillText(`CAM ${idx + 1}`, ax + 5, ay + 10);
            ctx.restore();
          };

          for (let i = 0; i < 4; i++) {
            drawAngle(pos[i][0], pos[i][1], cw, ch, i);
            if (i === live) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.8;
              ctx.strokeRect(pos[i][0] + 0.9, pos[i][1] + 0.9, cw - 1.8, ch - 1.8);
              
              // PGM (Program) label badge
              ctx.fillStyle = C.coral;
              ctx.fillRect(pos[i][0] + cw - 24, pos[i][1] + 3, 21, 9);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 6px "JetBrains Mono", monospace';
              ctx.textAlign = 'center';
              ctx.fillText('PGM', pos[i][0] + cw - 13, pos[i][1] + 10);
            }
          }
          break;
        }

        case "documentary": {
          // LWDoc: documentary interview alternating with B-roll footage cuts
          const cyc = t.current % 6;
          const isB = cyc > 4.2 && cyc < 5.4;
          
          if (isB) {
            // B-ROLL footage overlay scene
            const g = ctx.createLinearGradient(0, 0, width, 0);
            g.addColorStop(0, '#15303a');
            g.addColorStop(1, '#0d1b2a');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = 'rgba(159, 232, 255, 0.4)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 6; i++) {
              const bx = ((t.current * 30 + i * 40) % (width + 40)) - 20;
              ctx.beginPath();
              ctx.moveTo(bx, 0);
              ctx.lineTo(bx + 20, height);
              ctx.stroke();
            }
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '7px "JetBrains Mono", monospace';
            ctx.textAlign = 'left';
            ctx.fillText('B-ROLL', 6, 11);
          } else {
            // Interview backdrop scene
            const g = ctx.createLinearGradient(0, 0, 0, height);
            g.addColorStop(0, '#241f3e');
            g.addColorStop(1, '#12101f');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, width, height);

            // Studio background bokeh lights
            for (let k = 0; k < 5; k++) {
              ctx.globalAlpha = 0.12;
              ctx.fillStyle = C.sun;
              ctx.beginPath();
              ctx.arc((k * 83) % width, height * 0.3 + Math.sin(t.current + k) * 6, 8, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Speaker silhouette
            ctx.fillStyle = '#0c0a16';
            ctx.beginPath();
            ctx.arc(width * 0.4, height * 0.46, height * 0.15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(width * 0.18, height);
            ctx.quadraticCurveTo(width * 0.4, height * 0.6, width * 0.62, height);
            ctx.closePath();
            ctx.fill();

            // Animated lower third title tag popup
            const names = [
              ['DR. R. PATEL', 'Researcher'],
              ['MAYA LIN', 'Producer'],
              ['J. OKAFOR', 'Engineer']
            ];
            const nm = names[Math.floor(t.current / 6) % names.length];
            const vis = clamp((cyc - 0.4) / 0.4, 0, 1) * clamp((4 - cyc) / 0.4, 0, 1);
            
            if (vis > 0) {
              const bw = width * 0.5;
              const bx = lerp(-bw, width * 0.06, easeOut(clamp(vis * 2, 0, 1)));
              const by = height * 0.74;
              const bh = height * 0.17;

              ctx.fillStyle = C.coral;
              rr(ctx, bx, by, 3, bh, 1.5);
              ctx.fill();

              ctx.fillStyle = 'rgba(12, 10, 22, 0.82)';
              rr(ctx, bx + 3, by, bw, bh, 1.5);
              ctx.fill();

              ctx.globalAlpha = clamp(vis * 2, 0, 1);
              ctx.fillStyle = '#ffffff';
              ctx.textAlign = 'left';
              ctx.font = `bold ${Math.floor(height * 0.08)}px Inter, sans-serif`;
              ctx.fillText(nm[0], bx + 8, by + height * 0.075);
              
              ctx.fillStyle = C.sun;
              ctx.font = `${Math.floor(height * 0.05)}px "JetBrains Mono", monospace`;
              ctx.fillText(nm[1], bx + 8, by + height * 0.135);
              ctx.globalAlpha = 1;
            }
          }
          break;
        }

        case "trailer": {
          // LWTrailer: cinematic letterboxed teaser titles sequence
          const tLoop = 7.5;
          const prog = (t.current % tLoop) / tLoop;
          const barH = height * 0.13;
          
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);

          ctx.save();
          ctx.beginPath();
          ctx.rect(0, barH, width, height - 2 * barH);
          ctx.clip();

          // Central background radial glow
          const gx = width * 0.5 + Math.sin(t.current * 0.6) * width * 0.2;
          const rg = ctx.createRadialGradient(gx, height * 0.5, 0, gx, height * 0.5, height * 0.7);
          rg.addColorStop(0, 'rgba(124, 108, 255, 0.22)');
          rg.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = rg;
          ctx.fillRect(0, 0, width, height);

          const lines = ['THIS SUMMER', 'EVERY FRAME', 'BUILT BY HAND'];

          if (prog < 0.75) {
            // Teaser texts
            const li = Math.floor(prog / 0.25);
            const lp = (prog % 0.25) / 0.25;
            const alpha = clamp(lp * 5, 0, 1) * clamp((1 - lp) * 4, 0, 1);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `600 ${Math.floor(height * 0.12)}px "Bricolage Grotesque", sans-serif`;
            ctx.fillText(lines[li % lines.length], width / 2, height / 2);
            ctx.textBaseline = 'alphabetic';
          } else {
            // Final title reveal
            const tp = (prog - 0.75) / 0.25;
            const alpha = clamp(tp * 4, 0, 1);
            ctx.globalAlpha = alpha;

            ctx.save();
            ctx.translate(width / 2, height * 0.46);
            const s = lerp(0.82, 1, easeOut(alpha));
            ctx.scale(s, s);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `800 ${Math.floor(height * 0.17)}px "Bricolage Grotesque", sans-serif`;
            ctx.fillText('ADI MANGA', 0, 0);
            ctx.restore();

            ctx.textBaseline = 'alphabetic';
            ctx.globalAlpha = clamp((tp - 0.4) / 0.3, 0, 1);
            ctx.fillStyle = C.sun;
            ctx.textAlign = 'center';
            ctx.font = `${Math.floor(height * 0.06)}px "JetBrains Mono", monospace`;
            ctx.fillText('COMING SOON', width / 2, height * 0.64);
          }
          ctx.restore();
          ctx.globalAlpha = 1.0;

          // Letterbox overlay bars
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, barH);
          ctx.fillRect(0, height - barH, width, barH);
          break;
        }
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isVisible, isHovered]);

  return (
    <div
      ref={containerRef}
      className="clip flex flex-col bg-[#0d0d10]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-[#E5A93B] hover:shadow-[0_24px_46px_-30px_rgba(229,169,59,0.15)] transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="cscreen relative aspect-video bg-[#08070f] overflow-hidden border-b border-white/5">
        <canvas ref={canvasRef} className="block w-full h-full pixelated" />
        
        {/* CRT Scanline & vignette overlays */}
        <div className="crt-scanlines" />
        <div className="crt-vignette" />

        {/* Play HUD Overlay */}
        <div className="play absolute left-3 bottom-3 z-10 flex items-center gap-1.5 font-mono text-[9px] text-[#EDEBFF] bg-black/60 px-2 py-1 rounded">
          <b className="text-[#FF6B57]">{isHovered ? "▶ PLAYING" : "■ CUE"}</b>
        </div>
        <div className="dur absolute right-3 bottom-3 z-10 font-mono text-[9px] text-white bg-black/70 px-2 py-1 rounded">
          {clip.duration}
        </div>
      </div>

      <div className="cinfo p-4 flex flex-col flex-1">
        <div className="ctags flex items-center gap-2 mb-2">
          <span className="ctag font-mono text-[9px] uppercase tracking-wider text-[#E5A93B] bg-[#E5A93B]/5 border border-[#E5A93B]/15 px-2 py-0.5 rounded">
            {clip.tag}
          </span>
          <span className="font-mono text-[9px] text-[#A29DC9] ml-auto">
            Lightworks Cut
          </span>
        </div>

        <h3 className="text-white font-bold text-sm tracking-tight mb-1">{clip.title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed flex-1">{clip.description}</p>

        <div className="cfoot flex items-center gap-2 pt-3 mt-3 border-t border-white/5 text-[10px] font-mono text-slate-500">
          <span>Software:</span>
          <b className="text-slate-300">Lightworks Pro</b>
          <span className="skillpill ml-auto text-[#E5A93B]">{clip.skills}</span>
        </div>
      </div>
    </div>
  );
}

export default function EditBay() {
  const monitorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Timecode parameters (24fps project duration: 9.5 seconds = 228 frames total)
  const TOTAL_FRAMES = 228;
  const FPS = 24;
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const currentFrameRef = useRef(0);
  const isPlayingRef = useRef(true);
  const isDraggingPlayhead = useRef(false);

  // Sync references
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

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

  // Format frame count to standard SMPTE timecode (01:00:SS:FF)
  const getFormattedTimecode = (frame: number) => {
    const totalSec = Math.floor(frame / FPS);
    const frames = frame % FPS;
    const seconds = totalSec % 60;
    const minutes = Math.floor(totalSec / 60) % 60;
    const hours = 1; // standard program hour start
    
    const pad = (v: number) => String(v).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  };

  // Rendering loops for Program Monitor and Timeline Canvases
  useEffect(() => {
    const monitorCanvas = monitorCanvasRef.current;
    const timelineCanvas = timelineCanvasRef.current;
    if (!monitorCanvas || !timelineCanvas) return;

    const mCtx = monitorCanvas.getContext("2d");
    const tCtx = timelineCanvas.getContext("2d");
    if (!mCtx || !tCtx) return;

    let mWidth = 0, mHeight = 0, tWidth = 0, tHeight = 0;
    let dpr = 1;
    let animFrameId: number;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      const mRect = monitorCanvas.getBoundingClientRect();
      mWidth = mRect.width || 640;
      mHeight = mRect.height || 300;
      monitorCanvas.width = Math.round(mWidth * dpr);
      monitorCanvas.height = Math.round(mHeight * dpr);
      mCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const tRect = timelineCanvas.getBoundingClientRect();
      tWidth = tRect.width || 640;
      tHeight = tRect.height || 148;
      timelineCanvas.width = Math.round(tWidth * dpr);
      timelineCanvas.height = Math.round(tHeight * dpr);
      tCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();

    const loop = (now: number) => {
      if (!isVisible) {
        lastTime = now;
        animFrameId = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Update active frame when playing
      if (isPlayingRef.current && !isDraggingPlayhead.current) {
        currentFrameRef.current = (currentFrameRef.current + dt * FPS) % TOTAL_FRAMES;
        setCurrentFrame(Math.floor(currentFrameRef.current));
      }

      const activeFrame = Math.floor(currentFrameRef.current);
      const timeVal = activeFrame / FPS;

      // ----------------------------------------
      // 1. RENDERING PROGRAM MONITOR (lwMonitor)
      // ----------------------------------------
      const LW_LOOP = 9.5;
      const prog = (timeVal % LW_LOOP) / LW_LOOP;

      let shot = 0;
      let local = 0;
      if (prog < 0.40) {
        shot = 0;
        local = prog / 0.40;
      } else if (prog < 0.72) {
        shot = 1;
        local = (prog - 0.40) / 0.32;
      } else {
        shot = 2;
        local = (prog - 0.72) / 0.28;
      }

      const barH = mHeight * 0.085;
      mCtx.clearRect(0, 0, mWidth, mHeight);
      mCtx.fillStyle = '#000000';
      mCtx.fillRect(0, 0, mWidth, mHeight);

      // Save before clipping shot content area
      mCtx.save();
      mCtx.beginPath();
      mCtx.rect(0, barH, mWidth, mHeight - 2 * barH);
      mCtx.clip();

      // Apply zoom ease
      mCtx.save();
      const zoom = 1 + local * 0.07;
      mCtx.translate(mWidth / 2, mHeight / 2);
      mCtx.scale(zoom, zoom);
      mCtx.translate(-mWidth / 2, -mHeight / 2);

      // Draw active cinematic shot
      if (shot === 0) {
        // Draw City Silhouette Sunrise
        const g = mCtx.createLinearGradient(0, 0, 0, mHeight);
        g.addColorStop(0, '#e08a3a');
        g.addColorStop(0.45, '#a14a6e');
        g.addColorStop(1, '#2a1b46');
        mCtx.fillStyle = g;
        mCtx.fillRect(0, 0, mWidth, mHeight);

        const sx = mWidth * 0.7;
        const sy = mHeight * 0.52;
        const rg = mCtx.createRadialGradient(sx, sy, 2, sx, sy, mHeight * 0.45);
        rg.addColorStop(0, 'rgba(255, 225, 170, 0.95)');
        rg.addColorStop(0.3, 'rgba(255, 170, 90, 0.45)');
        rg.addColorStop(1, 'rgba(255, 170, 90, 0)');
        mCtx.fillStyle = rg;
        mCtx.fillRect(0, 0, mWidth, mHeight);

        mCtx.fillStyle = '#ffe6b0';
        mCtx.beginPath();
        mCtx.arc(sx, sy, mHeight * 0.07, 0, Math.PI * 2);
        mCtx.fill();

        const baseY = mHeight * 0.86;
        let bx = 0;
        let bi = 0;
        while (bx < mWidth) {
          const bw = 14 + ((bi * 53) % 26);
          const bh = 18 + ((bi * 97) % Math.max(20, Math.floor(mHeight * 0.5)));
          const top = baseY - bh;
          
          mCtx.fillStyle = '#1c1330';
          mCtx.fillRect(bx, top, bw, mHeight - top);
          
          // Glowing windows
          mCtx.fillStyle = `rgba(255, 200, 120, ${0.22 + 0.18 * Math.sin(timeVal * 2 + bi)})`;
          for (let wy = top + 6; wy < mHeight - 4; wy += 9) {
            for (let wx = bx + 3; wx < bx + bw - 3; wx += 6) {
              if (((wx + wy + bi) % 3) === 0) {
                mCtx.fillRect(wx, wy, 2, 3);
              }
            }
          }
          bx += bw + 5;
          bi++;
        }

        // Bokeh particles rising up
        for (let k = 0; k < 7; k++) {
          const px = (k * 131) % Math.max(1, Math.floor(mWidth));
          const py = mHeight - (((timeVal * 16) + k * 70) % (mHeight * 0.9));
          mCtx.globalAlpha = 0.10;
          mCtx.fillStyle = '#ffd9a0';
          mCtx.beginPath();
          mCtx.arc(px, py, 6 + (k % 3) * 4, 0, Math.PI * 2);
          mCtx.fill();
        }
        mCtx.globalAlpha = 1.0;
      } else if (shot === 1) {
        // Draw Streaks
        mCtx.fillStyle = '#0a0a16';
        mCtx.fillRect(0, 0, mWidth, mHeight);

        const cols = ['#ff7a4d', '#7C6CFF', '#5BE2A0', '#9FE8FF'];
        for (let i = 0; i < 6; i++) {
          mCtx.save();
          mCtx.translate(mWidth / 2, mHeight / 2);
          mCtx.rotate(-0.5);
          const off = ((timeVal * 60 + i * 120) % (mWidth * 1.8)) - mWidth * 0.9;
          const c = cols[i % cols.length];
          const g = mCtx.createLinearGradient(off - 40, 0, off + 40, 0);
          g.addColorStop(0, 'rgba(0,0,0,0)');
          g.addColorStop(0.5, c);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          
          mCtx.globalAlpha = 0.32;
          mCtx.fillStyle = g;
          mCtx.fillRect(off - 40, -mHeight, 80, mHeight * 2);
          mCtx.restore();
        }
        mCtx.globalAlpha = 1.0;

        const fx = mWidth * 0.5 + Math.sin(timeVal) * mWidth * 0.2;
        const fy = mHeight * 0.4;
        const rg = mCtx.createRadialGradient(fx, fy, 0, fx, fy, mHeight * 0.5);
        rg.addColorStop(0, 'rgba(255, 220, 180, 0.45)');
        rg.addColorStop(1, 'rgba(255, 220, 180, 0)');
        mCtx.fillStyle = rg;
        mCtx.fillRect(0, 0, mWidth, mHeight);
      } else {
        // Draw Title Cards
        mCtx.fillStyle = '#0c0a18';
        mCtx.fillRect(0, 0, mWidth, mHeight);

        const rg = mCtx.createRadialGradient(mWidth / 2, mHeight / 2, 0, mWidth / 2, mHeight / 2, mHeight * 0.7);
        rg.addColorStop(0, 'rgba(124, 108, 255, 0.18)');
        rg.addColorStop(1, 'rgba(0, 0, 0, 0)');
        mCtx.fillStyle = rg;
        mCtx.fillRect(0, 0, mWidth, mHeight);

        const a = clamp(local / 0.3, 0, 1);
        const sc = lerp(0.86, 1, easeOut(a));
        
        mCtx.save();
        mCtx.translate(mWidth / 2, mHeight / 2);
        mCtx.scale(sc, sc);
        mCtx.globalAlpha = a;
        mCtx.fillStyle = '#ffffff';
        mCtx.textAlign = 'center';
        mCtx.textBaseline = 'middle';
        mCtx.font = `800 ${Math.floor(mHeight * 0.17)}px "Bricolage Grotesque", sans-serif`;
        mCtx.fillText('ADI MANGA', 0, -mHeight * 0.02);
        mCtx.restore();
        
        mCtx.globalAlpha = 1.0;
        mCtx.textBaseline = 'alphabetic';

        const rw = lerp(0, mWidth * 0.34, clamp((local - 0.2) / 0.3, 0, 1));
        mCtx.fillStyle = C.coral;
        mCtx.fillRect(mWidth / 2 - rw / 2, mHeight * 0.58, rw, 2);

        const a2 = clamp((local - 0.3) / 0.3, 0, 1);
        mCtx.globalAlpha = a2;
        mCtx.fillStyle = C.sun;
        mCtx.textAlign = 'center';
        mCtx.font = `${Math.floor(mHeight * 0.06)}px "JetBrains Mono", monospace`;
        mCtx.fillText('EDITOR · COLOURIST · LIGHTWORKS', mWidth / 2, mHeight * 0.68);
        mCtx.globalAlpha = 1.0;
      }
      mCtx.restore();

      // Film Grain/Noise overlay
      mCtx.globalAlpha = 0.05;
      for (let i = 0; i < 36; i++) {
        mCtx.fillStyle = Math.random() < 0.5 ? '#ffffff' : '#000000';
        mCtx.fillRect(rnd(mWidth), rnd(barH, mHeight - barH), 1.4, 1.4);
      }
      mCtx.globalAlpha = 1.0;

      // Lower Third Popup overlay during Shot 0 (City)
      if (shot === 0 && local > 0.16 && local < 0.92) {
        const vis = clamp((local - 0.16) / 0.10, 0, 1) * clamp((0.92 - local) / 0.08, 0, 1);
        // Custom draw lower third inside monitor
        const bw = mWidth * 0.44;
        const bh = mHeight * 0.14;
        const x = lerp(-bw, mWidth * 0.06, easeOut(clamp(vis * 2, 0, 1)));
        const y = mHeight * 0.64;

        mCtx.fillStyle = C.coral;
        rr(mCtx, x, y, 5, bh, 2);
        mCtx.fill();

        mCtx.fillStyle = 'rgba(12, 10, 24, 0.82)';
        rr(mCtx, x + 5, y, bw, bh, 3);
        mCtx.fill();

        mCtx.globalAlpha = vis;
        mCtx.fillStyle = '#ffffff';
        mCtx.textAlign = 'left';
        mCtx.font = `bold ${Math.floor(bh * 0.4)}px Inter, sans-serif`;
        mCtx.fillText('ADI MANGA', x + 16, y + bh * 0.46);

        mCtx.fillStyle = C.sun;
        mCtx.font = `${Math.floor(bh * 0.28)}px "JetBrains Mono", monospace`;
        mCtx.fillText('Editor · Colourist', x + 16, y + bh * 0.8);
        mCtx.globalAlpha = 1.0;
      }

      // Shot transition fade-in wipe
      if (local < 0.06) {
        mCtx.fillStyle = `rgba(0, 0, 0, ${1 - local / 0.06})`;
        mCtx.fillRect(0, barH, mWidth, mHeight - 2 * barH);
      }
      mCtx.restore();

      // Top/bottom widescreen letterbox bars
      mCtx.fillStyle = '#000000';
      mCtx.fillRect(0, 0, mWidth, barH);
      mCtx.fillRect(0, mHeight - barH, mWidth, barH);

      // Safe margins guide frame
      mCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      mCtx.lineWidth = 0.8;
      mCtx.strokeRect(18, 18, mWidth - 36, mHeight - 36);

      // Audio volume VU meters on the sides
      const vuW = 5;
      const vuH = mHeight - 60;
      const vuY = 30;
      
      const leftVol = 0.3 + Math.abs(Math.sin(timeVal * 12)) * 0.65;
      const rightVol = 0.3 + Math.abs(Math.cos(timeVal * 10)) * 0.65;

      // Draw meter tracks background
      mCtx.fillStyle = "rgba(255, 255, 255, 0.05)";
      mCtx.fillRect(10, vuY, vuW, vuH);
      mCtx.fillRect(mWidth - 10 - vuW, vuY, vuW, vuH);

      // Draw volume fills
      mCtx.fillStyle = leftVol > 0.85 ? C.coral : leftVol > 0.7 ? C.sun : C.green;
      mCtx.fillRect(10, vuY + vuH * (1 - leftVol), vuW, vuH * leftVol);
      
      mCtx.fillStyle = rightVol > 0.85 ? C.coral : rightVol > 0.7 ? C.sun : C.green;
      mCtx.fillRect(mWidth - 10 - vuW, vuY + vuH * (1 - rightVol), vuW, vuH * rightVol);

      tCtx.clearRect(0, 0, tWidth, tHeight);
      tCtx.fillStyle = "#100e1a";
      tCtx.fillRect(0, 0, tWidth, tHeight);

      const startX = 64;
      const timelineW = tWidth - startX - 24;

      // Ruler headers
      const rulerH = 20;
      tCtx.fillStyle = "#16131f";
      tCtx.fillRect(startX, 0, tWidth - startX, rulerH);

      tCtx.strokeStyle = "#2a2640";
      tCtx.lineWidth = 1;
      tCtx.beginPath();
      tCtx.moveTo(0, rulerH);
      tCtx.lineTo(tWidth, rulerH);
      tCtx.stroke();

      // Draw ruler time tick marks
      tCtx.fillStyle = C.dim;
      tCtx.font = '8px "JetBrains Mono", monospace';
      tCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      for (let i = 0; i <= 10; i++) {
        const tx = startX + (i / 10) * timelineW;
        tCtx.beginPath();
        tCtx.moveTo(tx, rulerH - 5);
        tCtx.lineTo(tx, rulerH);
        tCtx.stroke();
        if (i % 2 === 0) {
          tCtx.fillText(`00:0${i}`, tx + 2, 10);
        }
      }

      // Draw tracks row lanes
      const trackLabels = ["V2", "V1", "A1", "A2"];
      const th = (tHeight - rulerH) / 4;
      
      for (let i = 0; i < 4; i++) {
        const y = rulerH + i * th;
        tCtx.fillStyle = i % 2 ? '#13111d' : '#15131f';
        tCtx.fillRect(0, y, tWidth, th);

        tCtx.fillStyle = '#0d0b16';
        tCtx.fillRect(0, y, startX, th);
        tCtx.strokeStyle = '#221f33';
        tCtx.strokeRect(0.5, y + 0.5, startX - 1, th - 1);

        tCtx.fillStyle = C.mut;
        tCtx.font = '9px "JetBrains Mono", monospace';
        tCtx.fillText(trackLabels[i], 8, y + th / 2 + 3);
      }

      // Draw V1 (Video Footage blocks with shot transition color changes)
      const v1Clips = [
        [0.0, 0.40, '#3a2752', '#e08a3a', 'Sync A - Cam 1'],
        [0.40, 0.72, '#15303a', '#5BE2A0', 'Zoom Punch - Cam 2'],
        [0.72, 1.0, '#241b40', '#7C6CFF', 'Credits/Teaser Title']
      ];

      v1Clips.forEach((c) => {
        const fromVal = parseFloat(c[0] as string);
        const toVal = parseFloat(c[1] as string);
        const x0 = startX + fromVal * timelineW + 1;
        const x1 = startX + toVal * timelineW - 1;
        const y = rulerH + th + 3;
        const clipW = x1 - x0;
        const clipH = th - 6;

        const grd = tCtx.createLinearGradient(x0, 0, x1, 0);
        grd.addColorStop(0, c[2] as string);
        grd.addColorStop(1, c[3] as string);
        tCtx.fillStyle = grd;
        rr(tCtx, x0, y, clipW, clipH, 3);
        tCtx.fill();

        // Highlight active block matching playhead
        if (prog >= fromVal && prog < toVal) {
          tCtx.strokeStyle = '#ffffff';
          tCtx.lineWidth = 1.5;
          rr(tCtx, x0, y, clipW, clipH, 3);
          tCtx.stroke();
        }

        // Draw clip title text
        tCtx.fillStyle = '#ffffff';
        tCtx.font = 'bold 7px sans-serif';
        tCtx.save();
        tCtx.beginPath();
        tCtx.rect(x0 + 2, y, clipW - 4, clipH);
        tCtx.clip();
        tCtx.fillText(c[4] as string, x0 + 6, y + clipH / 2 + 3);
        tCtx.restore();
      });

      // Draw V2 (Titles overlay blocks)
      const v2Clips = [
        [0.10, 0.36, C.coral, 'TITLE: Intro'],
        [0.72, 1.0, C.sun, 'TITLE: Outro']
      ];

      v2Clips.forEach((c) => {
        const fromVal = parseFloat(c[0] as string);
        const toVal = parseFloat(c[1] as string);
        const x0 = startX + fromVal * timelineW + 1;
        const x1 = startX + toVal * timelineW - 1;
        const y = rulerH + 3;
        const clipW = x1 - x0;
        const clipH = th - 6;

        tCtx.globalAlpha = 0.85;
        tCtx.fillStyle = c[2] as string;
        rr(tCtx, x0, y, clipW, clipH, 3);
        tCtx.fill();
        tCtx.globalAlpha = 1.0;

        tCtx.fillStyle = '#1a1330';
        tCtx.font = '8px "JetBrains Mono", monospace';
        tCtx.textAlign = 'left';
        if (clipW > 34) {
          tCtx.save();
          tCtx.beginPath();
          tCtx.rect(x0 + 2, y, clipW - 4, clipH);
          tCtx.clip();
          tCtx.fillText(c[3] as string, x0 + 6, y + clipH / 2 + 3);
          tCtx.restore();
        }
      });

      // Draw A1 / A2 Waveform clips
      const drawWaveformClip = (lane: number, seed: number, fromVal: number, toVal: number, fill: string, stroke: string, label: string) => {
        const y = rulerH + lane * th + th / 2;
        const x0 = startX + fromVal * timelineW + 1;
        const x1 = startX + toVal * timelineW - 1;
        const clipW = x1 - x0;
        const clipH = th - 6;

        tCtx.fillStyle = fill;
        rr(tCtx, x0, rulerH + lane * th + 3, clipW, clipH, 3);
        tCtx.fill();

        tCtx.strokeStyle = stroke;
        tCtx.lineWidth = 1;
        tCtx.beginPath();
        for (let x = x0 + 3; x < x1 - 2; x += 2.5) {
          const n = Math.abs(Math.sin(x * seed) * Math.sin(x * 0.13 + seed));
          const amp = (th * 0.36) * n;
          tCtx.moveTo(x, y - amp);
          tCtx.lineTo(x, y + amp);
        }
        tCtx.stroke();

        // Write filename label
        tCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        tCtx.font = '7px sans-serif';
        tCtx.fillText(label, x0 + 6, rulerH + lane * th + 11);
      };

      drawWaveformClip(2, 0.07, 0.0, 1.0, 'rgba(91, 226, 160, 0.08)', 'rgba(91, 226, 160, 0.6)', 'VOX_Mono_Dialogue.wav');
      drawWaveformClip(3, 0.11, 0.08, 0.92, 'rgba(159, 232, 255, 0.08)', 'rgba(159, 232, 255, 0.5)', 'BGM_Stereo_Backbed.mp3');

      // ----------------------------------------
      // 3. RENDER PLAYHEAD
      // ----------------------------------------
      const playheadX = startX + prog * timelineW;

      // Draw vertical red line on timeline
      tCtx.strokeStyle = C.coral;
      tCtx.lineWidth = 1.5;
      tCtx.beginPath();
      tCtx.moveTo(playheadX, rulerH);
      tCtx.lineTo(playheadX, tHeight);
      tCtx.stroke();

      // Playhead head marker
      tCtx.fillStyle = C.coral;
      tCtx.beginPath();
      tCtx.moveTo(playheadX - 5, 5);
      tCtx.lineTo(playheadX + 5, 5);
      tCtx.lineTo(playheadX + 5, 14);
      tCtx.lineTo(playheadX, 19);
      tCtx.lineTo(playheadX - 5, 14);
      tCtx.closePath();
      tCtx.fill();

      // White dot in playhead handle
      tCtx.fillStyle = "#ffffff";
      tCtx.beginPath();
      tCtx.arc(playheadX, 10, 1.6, 0, Math.PI * 2);
      tCtx.fill();

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [isVisible, isPlaying]);

  // Scrubbing drag behavior
  const handleTimelineScrub = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = timelineCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Bounds of timeline track content
    const startX = 64;
    const timelineW = rect.width - startX - 24;

    let clickPercentage = (x - startX) / timelineW;
    clickPercentage = Math.max(0, Math.min(1, clickPercentage));

    const targetFrame = Math.floor(clickPercentage * TOTAL_FRAMES);
    currentFrameRef.current = targetFrame;
    setCurrentFrame(targetFrame);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingPlayhead.current = true;
    handleTimelineScrub(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingPlayhead.current) {
      handleTimelineScrub(e);
    }
  };

  const handleMouseUpOrLeave = () => {
    isDraggingPlayhead.current = false;
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    currentFrameRef.current = 0;
    setCurrentFrame(0);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[9px] sm:text-[10px] text-[#E5A93B] font-black uppercase tracking-widest">
          ▶ NLE STAGE
        </span>
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-none">
          Lightworks NLE Video Editor Simulator
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm">
          Interactive simulation demonstrating post-production video editing techniques. Scrub tracks, inspect scopes, and test multi-channel audio mixing.
        </p>
      </div>

      {/* Editor Frame Layout */}
      <div className="nle flex flex-col bg-[#070709] border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/70">
        
        {/* Program monitor */}
        <div className="monitor relative aspect-[16/7.4] bg-black select-none border-b border-white/5">
          <canvas ref={monitorCanvasRef} className="block w-full h-full pixelated" />
          
          {/* CRT scanline and vignette overlays */}
          <div className="crt-scanlines" />
          <div className="crt-vignette" />
        </div>

        {/* Transport controls bar */}
        <div className="barstrip flex items-center justify-between px-4 py-2.5 bg-[#0d0d10] border-t border-b border-white/5 font-mono text-[10px] sm:text-xs text-slate-400 select-none">
          <div className="flex items-center gap-3">
            <span className="text-slate-200 font-bold uppercase tracking-wider">PROGRAM MONITOR</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 hidden sm:inline">Brand_Promo_v7.mov</span>
          </div>
          
          {/* Active graded display */}
          <div className="flex items-center gap-1.5 font-bold">
            <span className="h-2 w-2 rounded-full bg-[#FF6B57] shadow-[0_0_8px_#FF6B57]"></span>
            <span className="text-[#FF6B57]">PLAYBACK LIVE</span>
          </div>

          {/* Timecode */}
          <span className="text-[#E5A93B] font-mono font-bold tracking-wider text-xs sm:text-sm bg-black/40 px-3 py-1 rounded border border-[#E5A93B]/15 shadow-inner">
            {getFormattedTimecode(currentFrame)}
          </span>
        </div>

        {/* Playback Transport Buttons Bar */}
        <div className="flex items-center justify-center gap-4 py-2 bg-[#070709] border-b border-white/5">
          <button
            onClick={stopPlayback}
            className="p-2 bg-slate-900 border border-white/5 hover:border-slate-600 rounded-lg text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5 uppercase font-mono"
            aria-label="Stop playback"
          >
            ■ Stop
          </button>
          <button
            onClick={togglePlayback}
            className={`px-5 py-2 rounded-lg font-bold transition-all text-xs flex items-center gap-1.5 uppercase font-mono ${
              isPlaying
                ? "bg-[#FF6B57] text-[#050507] shadow-[0_0_15px_rgba(255,107,87,0.2)]"
                : "bg-[#E5A93B] text-[#050507] shadow-[0_0_15px_rgba(229,169,59,0.2)]"
            }`}
            aria-label={isPlaying ? "Pause playback" : "Play video"}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>

        {/* Timeline Canvas */}
        <div className="timeline relative height-[148px] bg-[#0d0d10]">
          <canvas
            ref={timelineCanvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="block w-full h-full cursor-ew-resize select-none pixelated"
            aria-label="Interactive track timeline grid editor"
          />
          {/* CRT scanline and vignette overlays */}
          <div className="crt-scanlines animate-pulse" style={{ opacity: 0.15 }} />
          <div className="crt-vignette" />
        </div>

      </div>

      {/* Reel grid clips container */}
      <div className="flex flex-col gap-2 mt-4">
        <h4 className="text-white font-bold text-sm tracking-tight uppercase flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E5A93B]"></span>
          Looping Clip Previews
        </h4>
        
        <div className="reelgrid grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLIPS.map((clip) => (
            <ClipPreview key={clip.id} clip={clip} />
          ))}
        </div>
      </div>
    </div>
  );
}
