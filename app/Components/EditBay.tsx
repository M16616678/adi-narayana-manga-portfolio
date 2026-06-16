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

      // Dark preview backdrop
      ctx.fillStyle = "#08070f";
      ctx.fillRect(0, 0, width, height);

      // Render loops
      switch (clip.id) {
        case "grading": {
          // Color grade split screen comparison
          const midX = width / 2 + Math.sin(t.current * 1.5) * (width * 0.3);
          
          // Draw desaturated LOG footage on left
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, midX, height);
          ctx.clip();
          ctx.fillStyle = "#2c2e3b";
          ctx.fillRect(0, 0, width, height);
          
          // Draw grey wireframe landscape
          ctx.strokeStyle = "#4b4f63";
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let x = 0; x < width; x += 10) {
            ctx.moveTo(x, height);
            ctx.lineTo(x, height - 15 - Math.sin(x * 0.05 + t.current) * 10);
          }
          ctx.stroke();
          ctx.restore();

          // Draw graded orange/teal on right
          ctx.save();
          ctx.beginPath();
          ctx.rect(midX, 0, width - midX, height);
          ctx.clip();
          ctx.fillStyle = "#121029";
          ctx.fillRect(0, 0, width, height);

          // Draw colorful neon wireframe
          ctx.strokeStyle = C.coral;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x < width; x += 10) {
            ctx.moveTo(x, height);
            ctx.lineTo(x, height - 15 - Math.sin(x * 0.05 + t.current) * 10);
          }
          ctx.stroke();

          // Sun grading circle
          ctx.fillStyle = C.sun;
          ctx.shadowColor = C.sun;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(width * 0.7, height * 0.4, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();

          // Split indicator bar
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(midX, 0);
          ctx.lineTo(midX, height);
          ctx.stroke();
          break;
        }

        case "commercial": {
          // kinetic typing visualizer
          const scale = 1.0 + Math.abs(Math.sin(t.current * 4)) * 0.15;
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.scale(scale, scale);
          
          ctx.fillStyle = C.green;
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "center";
          ctx.fillText("SOLAR2D ENGINE", 0, -5);
          
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText("BEAT-MATCHED EDIT", 0, 10);
          ctx.restore();

          // Audio bar pulses at bottom
          ctx.fillStyle = "rgba(91, 226, 160, 0.4)";
          for (let i = 0; i < 15; i++) {
            const hVal = 10 + Math.abs(Math.sin(t.current * 8 + i)) * 25;
            ctx.fillRect(15 + i * 14, height - hVal, 8, hVal);
          }
          break;
        }

        case "music": {
          // Zoom punches and pulses
          const pulse = Math.abs(Math.sin(t.current * 3));
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate(t.current * 0.2);
          
          ctx.strokeStyle = C.moon;
          ctx.lineWidth = 2;
          ctx.strokeRect(-20 - pulse * 10, -20 - pulse * 10, 40 + pulse * 20, 40 + pulse * 20);

          ctx.strokeStyle = C.pink;
          ctx.strokeRect(-10 - pulse * 5, -10 - pulse * 5, 20 + pulse * 10, 20 + pulse * 10);
          ctx.restore();

          // Beat flashes overlay
          if (Math.floor(t.current * 3) % 2 === 0) {
            ctx.fillStyle = "rgba(124, 108, 255, 0.05)";
            ctx.fillRect(0, 0, width, height);
          }
          break;
        }

        case "multicam": {
          // 2x2 grid representing 4 synchronized cams
          const activeCam = Math.floor(t.current * 0.8) % 4;
          const cellW = width / 2;
          const cellH = height / 2;

          for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 2; c++) {
              const idx = r * 2 + c;
              const x = c * cellW;
              const y = r * cellH;

              ctx.fillStyle = idx === activeCam ? "#15122e" : "#0d0c15";
              ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);

              ctx.strokeStyle = idx === activeCam ? C.sun : "#27253d";
              ctx.lineWidth = idx === activeCam ? 1.5 : 0.8;
              ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

              // Draw camera identifier
              ctx.fillStyle = idx === activeCam ? C.starc : C.dim;
              ctx.font = "8px monospace";
              ctx.fillText(`CAM_${idx + 1}`, x + 8, y + 14);

              // Waveform in the cell
              ctx.strokeStyle = idx === activeCam ? C.coral : "#38364c";
              ctx.beginPath();
              for (let wave = 0; wave < cellW - 20; wave += 4) {
                const wh = Math.sin(wave * 0.2 + t.current * 5 + idx) * (idx === activeCam ? 8 : 2);
                if (wave === 0) ctx.moveTo(x + 10 + wave, y + cellH * 0.6 + wh);
                else ctx.lineTo(x + 10 + wave, y + cellH * 0.6 + wh);
              }
              ctx.stroke();
            }
          }
          break;
        }

        case "documentary": {
          // Speaker layout and lower third
          ctx.fillStyle = "#191535";
          ctx.beginPath();
          ctx.arc(width / 2, height * 0.55, 20, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.ellipse(width / 2, height + 10, 30, 20, 0, 0, Math.PI * 2);
          ctx.fill();

          // Interview lower third title popup
          const showThird = (Math.floor(t.current * 0.4) % 2 === 0);
          if (showThird) {
            ctx.fillStyle = C.bg2;
            ctx.fillRect(15, height - 32, 100, 20);
            ctx.strokeStyle = C.sun;
            ctx.lineWidth = 1;
            ctx.strokeRect(15, height - 32, 100, 20);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 7px sans-serif";
            ctx.fillText("Adi Manga", 20, height - 23);
            ctx.fillStyle = C.mut;
            ctx.font = "6px sans-serif";
            ctx.fillText("Lead Developer", 20, height - 16);
          }
          break;
        }

        case "trailer": {
          // Letterbox bars
          ctx.fillStyle = "#1c1838";
          ctx.fillRect(0, 15, width, height - 30);
          
          // Fading Title reveal
          const alpha = Math.abs(Math.sin(t.current * 1.2));
          ctx.fillStyle = `rgba(255, 178, 62, ${alpha})`;
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText("COMING SOON...", width / 2, height / 2 + 3);

          // Safe margin guides
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.strokeRect(8, 8, width - 16, height - 16);
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
        <canvas ref={canvasRef} className="block w-full h-full" />
        
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

  // Timecode parameters (24fps project duration: 10 seconds = 240 frames total)
  const TOTAL_FRAMES = 240;
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
      mCtx.clearRect(0, 0, mWidth, mHeight);
      mCtx.fillStyle = "#0c0a18";
      mCtx.fillRect(0, 0, mWidth, mHeight);

      // Render graded background scene (glowing wireframe space grid)
      mCtx.strokeStyle = "rgba(124, 108, 255, 0.15)";
      mCtx.lineWidth = 1;
      const perspectiveY = mHeight * 0.45;
      
      // Horizon line
      mCtx.beginPath();
      mCtx.moveTo(0, perspectiveY);
      mCtx.lineTo(mWidth, perspectiveY);
      mCtx.stroke();

      // Orthogonal grid lines converging to center
      const center = mWidth / 2;
      mCtx.beginPath();
      for (let x = -mWidth * 0.5; x <= mWidth * 1.5; x += 40) {
        mCtx.moveTo(x, mHeight);
        mCtx.lineTo(center + (x - center) * 0.1, perspectiveY);
      }
      mCtx.stroke();

      // Scrolling horizontal perspective grid lines
      mCtx.beginPath();
      const gridOffset = (timeVal * 40) % 30;
      for (let y = perspectiveY; y < mHeight; y += 15) {
        const drawY = y + gridOffset * ((y - perspectiveY) / (mHeight - perspectiveY));
        mCtx.moveTo(0, drawY);
        mCtx.lineTo(mWidth, drawY);
      }
      mCtx.stroke();

      // Draw original/graded comparison scanline slider
      const sliderX = mWidth * (0.3 + Math.sin(timeVal * 0.8) * 0.25);

      // Raw LOG footage desaturated box (left side of slider)
      mCtx.save();
      mCtx.beginPath();
      mCtx.rect(0, 0, sliderX, mHeight);
      mCtx.clip();
      
      // LOG overlay shading
      mCtx.fillStyle = "rgba(100, 116, 139, 0.15)";
      mCtx.fillRect(0, 0, mWidth, mHeight);
      
      // Desaturated mountains
      mCtx.fillStyle = "#272a38";
      mCtx.beginPath();
      mCtx.moveTo(0, perspectiveY);
      mCtx.lineTo(mWidth * 0.2, perspectiveY - 30);
      mCtx.lineTo(mWidth * 0.45, perspectiveY);
      mCtx.closePath();
      mCtx.fill();
      mCtx.restore();

      // High-glowing Color Graded scene (right side of slider)
      mCtx.save();
      mCtx.beginPath();
      mCtx.rect(sliderX, 0, mWidth - sliderX, mHeight);
      mCtx.clip();

      // Vivid neon mountain
      const gradient = mCtx.createLinearGradient(0, perspectiveY - 60, 0, perspectiveY);
      gradient.addColorStop(0, "rgba(255, 107, 87, 0.8)");
      gradient.addColorStop(1, "rgba(124, 108, 255, 0.1)");
      
      mCtx.fillStyle = gradient;
      mCtx.beginPath();
      mCtx.moveTo(0, perspectiveY);
      mCtx.lineTo(mWidth * 0.2, perspectiveY - 45);
      mCtx.lineTo(mWidth * 0.45, perspectiveY);
      mCtx.closePath();
      mCtx.fill();

      mCtx.strokeStyle = C.coral;
      mCtx.lineWidth = 1.5;
      mCtx.beginPath();
      mCtx.moveTo(0, perspectiveY);
      mCtx.lineTo(mWidth * 0.2, perspectiveY - 45);
      mCtx.lineTo(mWidth * 0.45, perspectiveY);
      mCtx.stroke();

      // Glowing Neon Sun
      mCtx.shadowColor = C.sun;
      mCtx.shadowBlur = 30;
      mCtx.fillStyle = C.sun;
      mCtx.beginPath();
      mCtx.arc(mWidth * 0.72, perspectiveY - 40, 26, 0, Math.PI * 2);
      mCtx.fill();
      mCtx.shadowBlur = 0;
      mCtx.restore();

      // Vertical Slider comparison divider
      mCtx.strokeStyle = "#ffffff";
      mCtx.lineWidth = 1.5;
      mCtx.beginPath();
      mCtx.moveTo(sliderX, 0);
      mCtx.lineTo(sliderX, mHeight);
      mCtx.stroke();

      // Slider indicator tag text
      mCtx.fillStyle = "#ffffff";
      mCtx.font = "bold 9px monospace";
      mCtx.fillText("LOG FOOTAGE", sliderX - 82, 18);
      mCtx.fillStyle = C.sun;
      mCtx.fillText("COLOUR GRADED (LUT_2D)", sliderX + 12, 18);

      // Safe margin overlays
      mCtx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      mCtx.lineWidth = 0.8;
      mCtx.strokeRect(18, 18, mWidth - 36, mHeight - 36);

      // Vectorscope overlay widget inside monitor (top-right corner)
      const vSize = 46;
      const vx = mWidth - vSize - 26;
      const vy = 26;
      mCtx.fillStyle = "rgba(0,0,0,0.6)";
      mCtx.beginPath();
      mCtx.arc(vx + vSize/2, vy + vSize/2, vSize/2, 0, Math.PI*2);
      mCtx.fill();
      mCtx.strokeStyle = "rgba(255,255,255,0.15)";
      mCtx.stroke();
      
      // Scope rings
      mCtx.strokeRect(vx + vSize/4, vy + vSize/4, vSize/2, vSize/2);
      
      // Vectorscope signal trace lines
      mCtx.strokeStyle = C.green;
      mCtx.lineWidth = 1;
      mCtx.beginPath();
      mCtx.moveTo(vx + vSize/2, vy + vSize/2);
      for (let a = 0; a < Math.PI * 2; a += 0.3) {
        const noise = 8 + Math.sin(a * 4 + timeVal * 10) * 8 + Math.cos(a * 8) * 3;
        mCtx.lineTo(vx + vSize/2 + Math.cos(a) * noise, vy + vSize/2 + Math.sin(a) * noise);
      }
      mCtx.closePath();
      mCtx.stroke();

      // Audio volume VU meters on the sides
      const vuW = 5;
      const vuH = mHeight - 60;
      const vuY = 30;
      
      const leftVol = 0.3 + Math.abs(Math.sin(timeVal * 12)) * 0.65;
      const rightVol = 0.3 + Math.abs(Math.cos(timeVal * 10)) * 0.65;

      // Draw meter tracks
      mCtx.fillStyle = "rgba(255,255,255,0.05)";
      mCtx.fillRect(10, vuY, vuW, vuH);
      mCtx.fillRect(mWidth - 10 - vuW, vuY, vuW, vuH);

      // Draw volume fills
      mCtx.fillStyle = leftVol > 0.85 ? C.coral : leftVol > 0.7 ? C.sun : C.green;
      mCtx.fillRect(10, vuY + vuH * (1 - leftVol), vuW, vuH * leftVol);
      
      mCtx.fillStyle = rightVol > 0.85 ? C.coral : rightVol > 0.7 ? C.sun : C.green;
      mCtx.fillRect(mWidth - 10 - vuW, vuY + vuH * (1 - rightVol), vuW, vuH * rightVol);

      // ----------------------------------------
      // 2. RENDERING TRACKS TIMELINE (lwTimeline)
      // ----------------------------------------
      tCtx.clearRect(0, 0, tWidth, tHeight);
      tCtx.fillStyle = "#100e1a";
      tCtx.fillRect(0, 0, tWidth, tHeight);

      // Ruler headers
      const rulerH = 24;
      tCtx.fillStyle = "#15121f";
      tCtx.fillRect(0, 0, tWidth, rulerH);
      tCtx.strokeStyle = C.line;
      tCtx.lineWidth = 1;
      tCtx.beginPath();
      tCtx.moveTo(0, rulerH);
      tCtx.lineTo(tWidth, rulerH);
      tCtx.stroke();

      // Tracks offsets
      const startX = 64; // width of track label column
      const timelineW = tWidth - startX - 24;

      // Draw ruler time tick marks
      tCtx.fillStyle = C.dim;
      tCtx.font = "8px monospace";
      tCtx.strokeStyle = "rgba(255,255,255,0.1)";
      for (let i = 0; i <= 10; i++) {
        const tx = startX + (i / 10) * timelineW;
        tCtx.beginPath();
        tCtx.moveTo(tx, rulerH - 6);
        tCtx.lineTo(tx, rulerH);
        tCtx.stroke();
        tCtx.fillText(`00:0${i}:00`, tx - 16, rulerH - 8);
      }

      // Draw tracks row lanes
      const trackLabels = ["V2 TITLE", "V1 VIDEO", "A1 VOX", "A2 MUSIC"];
      const laneH = 26;
      
      for (let row = 0; row < 4; row++) {
        const laneY = rulerH + row * laneH;
        
        // Lane divider
        tCtx.strokeStyle = C.line;
        tCtx.beginPath();
        tCtx.moveTo(0, laneY + laneH);
        tCtx.lineTo(tWidth, laneY + laneH);
        tCtx.stroke();

        // Track label column backgrounds
        tCtx.fillStyle = "#151221";
        tCtx.fillRect(0, laneY + 1, startX, laneH - 1);
        tCtx.strokeStyle = C.line;
        tCtx.strokeRect(0, laneY, startX, laneH);

        tCtx.fillStyle = "#EDEBFF";
        tCtx.font = "bold 8px monospace";
        tCtx.fillText(trackLabels[row], 8, laneY + laneH * 0.6);
      }

      // Render video/audio block elements
      // track V2 (Titles)
      const drawClipBlock = (lane: number, sPerc: number, ePerc: number, label: string, color: string) => {
        const laneY = rulerH + lane * laneH + 3;
        const x = startX + sPerc * timelineW;
        const w = (ePerc - sPerc) * timelineW;
        const h = laneH - 6;

        tCtx.fillStyle = color;
        tCtx.fillRect(x, laneY, w, h);
        tCtx.strokeStyle = "rgba(255,255,255,0.15)";
        tCtx.lineWidth = 1;
        tCtx.strokeRect(x, laneY, w, h);

        tCtx.fillStyle = "#1a1330";
        tCtx.font = "bold 8px sans-serif";
        tCtx.save();
        tCtx.beginPath();
        tCtx.rect(x + 2, laneY, w - 4, h);
        tCtx.clip();
        tCtx.fillText(label, x + 6, laneY + h * 0.65);
        tCtx.restore();
      };

      // V2 (Titles)
      drawClipBlock(0, 0.05, 0.35, "Lower Third Intro", "rgba(255, 178, 62, 0.8)");
      drawClipBlock(0, 0.70, 0.95, "Credits Outro", "rgba(255, 178, 62, 0.8)");

      // V1 (Video Footage)
      drawClipBlock(1, 0.0, 0.3, "Sync A - Cam 1", "rgba(124, 108, 255, 0.85)");
      drawClipBlock(1, 0.3, 0.55, "Zoom Punch - Cam 2", "rgba(91, 226, 160, 0.85)");
      drawClipBlock(1, 0.55, 0.8, "Multicam Angle B", "rgba(124, 108, 255, 0.85)");
      drawClipBlock(1, 0.8, 1.0, "Teaser Cut A", "rgba(255, 107, 87, 0.85)");

      // A1 (Dialogue Voiceover)
      drawClipBlock(2, 0.0, 0.55, "VOX_Lead_01.wav", "rgba(255, 143, 208, 0.8)");
      drawClipBlock(2, 0.6, 0.95, "VOX_Lead_02.wav", "rgba(255, 143, 208, 0.8)");

      // A2 (Background Music Bed)
      drawClipBlock(3, 0.0, 1.0, "Retro_Synth_Beat_120bpm.mp3", "rgba(159, 232, 255, 0.75)");

      // ----------------------------------------
      // 3. RENDER PLAYHEAD
      // ----------------------------------------
      const playheadX = startX + (activeFrame / TOTAL_FRAMES) * timelineW;

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
      tCtx.lineTo(playheadX + 5, 16);
      tCtx.lineTo(playheadX, 22);
      tCtx.lineTo(playheadX - 5, 16);
      tCtx.closePath();
      tCtx.fill();

      // White dot in playhead handle
      tCtx.fillStyle = "#ffffff";
      tCtx.beginPath();
      tCtx.arc(playheadX, 11, 1.8, 0, Math.PI * 2);
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
          <canvas ref={monitorCanvasRef} className="block w-full h-full" />
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
            <span className="text-[#FF6B57]">COLOUR GRADED</span>
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
            className="block w-full h-full cursor-ew-resize select-none"
            aria-label="Interactive track timeline grid editor"
          />
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
