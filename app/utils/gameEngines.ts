// app/utils/gameEngines.ts

import { playRetroSound } from "@/app/utils/soundSynth";

export interface GameEnv {
  t: number;
  pointer: {
    x: number;
    y: number;
    down: boolean;
    active: boolean;
    lastT: number;
  };
  speedSetting?: number;
  gravitySetting?: number;
  customGrid?: any[];
  onScoreChange?: (score: number) => void;
}

export interface GameEngine {
  resize?: (w: number, h: number) => void;
  tap?: (x: number, y: number) => void;
  step: (dt: number, w: number, h: number) => void;
}

export type GameFactory = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  env: GameEnv
) => GameEngine;

// Theme Colors matching dashboard styling
export const C = {
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

const TAU = Math.PI * 2;

// Math Helpers
const rnd = (a = 1, b?: number) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const ri = (a: number, b: number) => Math.floor(rnd(a, b + 1));
const pick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const clamp = (v: number, a: number, b: number) => v < a ? a : v > b ? b : v;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Rounded Rectangle drawing helper
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Vector Star shape helper
function starPath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, n = 5, inner = 0.45) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = i / (n * 2) * TAU - Math.PI / 2;
    const rad = i % 2 ? r * inner : r;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// Particle System
function Particles() {
  const ps: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    age: number;
    color: string;
    size: number;
    g: number;
  }> = [];
  return {
    burst(x: number, y: number, color: string, n = 10, spd = 120) {
      for (let i = 0; i < n; i++) {
        const a = rnd(TAU);
        const s = rnd(spd * 0.3, spd);
        ps.push({
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
    },
    step(dt: number) {
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.age += dt;
        if (p.age >= p.life) {
          ps.splice(i, 1);
          continue;
        }
        p.vy += p.g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    },
    draw(ctx: CanvasRenderingContext2D) {
      for (const p of ps) {
        const k = 1 - p.age / p.life;
        ctx.globalAlpha = k;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    count() { return ps.length; }
  };
}

// Starfield Generator
function starfield(n: number, w: number, h: number) {
  const a = [];
  for (let i = 0; i < n; i++) {
    a.push({
      x: rnd(w),
      y: rnd(h),
      z: rnd(0.3, 1),
      tw: rnd(TAU)
    });
  }
  return a;
}

// Starfield Renderer
function drawStarfield(
  ctx: CanvasRenderingContext2D,
  field: Array<{ x: number; y: number; z: number; tw: number }>,
  w: number,
  h: number,
  t: number,
  scroll?: number
) {
  for (const s of field) {
    if (scroll) {
      s.y += s.z * scroll;
      if (s.y > h) {
        s.y = 0;
        s.x = rnd(w);
      }
    }
    const a = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + s.tw));
    ctx.globalAlpha = a * s.z;
    ctx.fillStyle = C.star;
    ctx.fillRect(s.x, s.y, s.z * 1.6, s.z * 1.6);
  }
  ctx.globalAlpha = 1;
}

// Background Gradient helper
function bg(ctx: CanvasRenderingContext2D, w: number, h: number, c0: string, c1: string) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, c0);
  g.addColorStop(1, c1);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

// WeakMap Cache for Starfield layers
const _sfCache = new WeakMap();
function starfield_cache(key: any, w: number, h: number) {
  if (!_sfCache.has(key)) _sfCache.set(key, starfield(40, w, h));
  return _sfCache.get(key);
}

/* ================= 16 GAME ENGINES ================= */

// 1. STAR CATCHER
export function StarCatcher(opts?: { onScoreChange?: (score: number) => void }): GameFactory {
  return function(ctx, w, h, env) {
    let field = starfield(46, w, h);
    const parts = Particles();
    const ship = { x: w / 2, tx: w / 2 };
    let falls: Array<{ x: number; y: number; v: number; bomb: boolean; r: number; sp: number }> = [];
    let score = 0;
    let spawn = 0;
    let shake = 0;
    let aiT = w / 2;

    const onScoreChange = opts?.onScoreChange || env.onScoreChange;

    function spawnStar() {
      const bomb = Math.random() < 0.16;
      falls.push({
        x: rnd(16, w - 16),
        y: -14,
        v: rnd(60, 120) * (env.speedSetting ? env.speedSetting / 4.0 : 1.0),
        bomb,
        r: bomb ? 9 : 8,
        sp: rnd(TAU)
      });
    }

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        field = starfield(46, w, h);
        ship.x = clamp(ship.x, 0, w);
      },
      step(dt) {
        w = ctx.canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
        h = ctx.canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

        spawn -= dt;
        if (spawn <= 0) {
          spawnStar();
          spawn = rnd(0.4, 0.85);
        }

        if (env.pointer.active) {
          ship.tx = env.pointer.x;
        } else {
          let best = null;
          let bd = 1e9;
          for (const f of falls) {
            if (f.bomb) continue;
            const d = h - f.y;
            if (d < bd) {
              bd = d;
              best = f;
            }
          }
          if (best) aiT = best.x;
          ship.tx = lerp(ship.tx, aiT, 0.04);
        }
        ship.x = lerp(ship.x, clamp(ship.tx, 18, w - 18), 0.18);

        for (let i = falls.length - 1; i >= 0; i--) {
          const f = falls[i];
          f.y += f.v * dt;
          f.sp += dt * 3;
          if (f.y > h + 16) {
            falls.splice(i, 1);
            continue;
          }
          if (f.y > h - 46 && Math.abs(f.x - ship.x) < 24) {
            if (f.bomb) {
              shake = 10;
              score = Math.max(0, score - 25);
              parts.burst(f.x, f.y, C.coral, 16, 180);
              playRetroSound('hit');
            } else {
              score += 10;
              parts.burst(f.x, f.y, C.sun, 12, 150);
              playRetroSound('coin');
            }
            falls.splice(i, 1);
            if (onScoreChange) onScoreChange(score);
          }
        }

        parts.step(dt);

        bg(ctx, w, h, '#1a1640', '#0d0b22');
        drawStarfield(ctx, field, w, h, env.t, 18 * dt * 60);

        let sx = 0, sy = 0;
        if (shake > 0) {
          sx = rnd(-shake, shake);
          sy = rnd(-shake, shake);
          shake *= 0.86;
          if (shake < 0.4) shake = 0;
        }

        ctx.save();
        ctx.translate(sx, sy);

        for (const f of falls) {
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
            starPath(ctx, 0, 0, f.r, 5, 0.45);
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.save();
        ctx.translate(ship.x, h - 30);
        ctx.fillStyle = C.star;
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(15, 12);
        ctx.lineTo(0, 5);
        ctx.lineTo(-15, 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = C.moon;
        ctx.beginPath();
        ctx.arc(0, -2, 4, 0, TAU);
        ctx.fill();

        ctx.fillStyle = C.coral;
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(env.t * 30);
        ctx.beginPath();
        ctx.moveTo(-5, 12);
        ctx.lineTo(0, 12 + rnd(6, 12));
        ctx.lineTo(5, 12);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();

        parts.draw(ctx);
        ctx.restore();
      }
    };
  };
}

// 2. ASTRO BLASTER
export function AstroBlaster(): GameFactory {
  return function(ctx, w, h, env) {
    let field = starfield(40, w, h);
    const parts = Particles();
    const ship = { x: w / 2 };
    let bullets: Array<{ x: number; y: number }> = [];
    let rocks: Array<{ x: number; y: number; v: number; r: number; rot: number; vr: number }> = [];
    let fire = 0;
    let spawn = 0;
    let score = 0;

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        field = starfield(40, w, h);
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        spawn -= dt;
        if (spawn <= 0) {
          rocks.push({
            x: rnd(18, w - 18),
            y: -12,
            v: rnd(40, 80) * speedMultiplier,
            r: rnd(8, 15),
            rot: rnd(TAU),
            vr: rnd(-2, 2)
          });
          spawn = rnd(0.5, 1.1);
        }

        let tgt: typeof rocks[0] | null = null;
        let bd = 1e9;
        for (const r of rocks) {
          if (r.y < h * 0.7) {
            const d = Math.abs(r.x - ship.x) + r.y * 0.3;
            if (d < bd) {
              bd = d;
              tgt = r;
            }
          }
        }

        const tx = env.pointer.active ? env.pointer.x : (tgt ? tgt.x : w / 2);
        ship.x = lerp(ship.x, clamp(tx, 16, w - 16), 0.12);

        fire -= dt;
        if (fire <= 0) {
          bullets.push({ x: ship.x, y: h - 30 });
          fire = 0.22 / speedMultiplier;
          playRetroSound('laser');
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.y -= 420 * dt * speedMultiplier;
          if (b.y < -8) bullets.splice(i, 1);
        }

        for (let i = rocks.length - 1; i >= 0; i--) {
          const r = rocks[i];
          r.y += r.v * dt;
          r.rot += r.vr * dt;
          if (r.y > h + 16) {
            rocks.splice(i, 1);
            continue;
          }
          for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            if (Math.hypot(b.x - r.x, b.y - r.y) < r.r + 3) {
              parts.burst(r.x, r.y, C.coral, 12, 150);
              rocks.splice(i, 1);
              bullets.splice(j, 1);
              score += 10;
              playRetroSound('hit');
              if (env.onScoreChange) env.onScoreChange(score);
              break;
            }
          }
        }

        parts.step(dt);

        bg(ctx, w, h, '#161236', '#0c0a20');
        drawStarfield(ctx, field, w, h, env.t, 30 * dt * 60);

        for (const b of bullets) {
          ctx.fillStyle = C.sun;
          ctx.fillRect(b.x - 1.5, b.y - 7, 3, 9);
        }

        for (const r of rocks) {
          ctx.save();
          ctx.translate(r.x, r.y);
          ctx.rotate(r.rot);
          ctx.fillStyle = '#6a6390';
          ctx.strokeStyle = C.moon;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let k = 0; k < 7; k++) {
            const a = k / 7 * TAU;
            const rr2 = r.r * (0.8 + ((k * 37) % 10) / 20);
            const px = Math.cos(a) * rr2;
            const py = Math.sin(a) * rr2;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        ctx.translate(ship.x, h - 22);
        ctx.fillStyle = C.star;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(11, 10);
        ctx.lineTo(-11, 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = C.coral;
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(env.t * 30);
        ctx.fillRect(-3, 10, 6, rnd(5, 10));
        ctx.globalAlpha = 1;
        ctx.restore();

        parts.draw(ctx);
      }
    };
  };
}

// 3. BRICK BREAKER
export function BrickBreaker(): GameFactory {
  return function(ctx, w, h, env) {
    const parts = Particles();
    const pad = { x: w / 2, wd: 50 };
    let ball: { x: number; y: number; vx: number; vy: number; r: number };
    let bricks: Array<{ x: number; y: number; w: number; h: number; c: string; alive: boolean }> = [];
    const cols = 7;
    const rows = 4;
    let score = 0;

    function build() {
      bricks = [];
      const bw = (w - 16) / cols;
      const bh = 12;
      const isCustom = env.customGrid && env.customGrid.length === rows * cols;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (isCustom && !env.customGrid![r * cols + c]) continue;
          bricks.push({
            x: 8 + c * bw,
            y: 14 + r * (bh + 5),
            w: bw - 4,
            h: bh,
            c: [C.coral, C.sun, C.green, C.moon][r % 4],
            alive: true
          });
        }
      }
    }

    function newBall() {
      ball = { x: w / 2, y: h - 30, vx: rnd(-90, 90), vy: -150, r: 5 };
    }

    build();
    newBall();

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        build();
        newBall();
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        const tx = env.pointer.active ? env.pointer.x : ball.x;
        pad.x = lerp(pad.x, clamp(tx, pad.wd / 2, w - pad.wd / 2), 0.2);

        ball.x += ball.vx * dt * speedMultiplier;
        ball.y += ball.vy * dt * speedMultiplier;

        if (ball.x < ball.r) {
          ball.x = ball.r;
          ball.vx *= -1;
          playRetroSound('select');
        }
        if (ball.x > w - ball.r) {
          ball.x = w - ball.r;
          ball.vx *= -1;
          playRetroSound('select');
        }
        if (ball.y < ball.r) {
          ball.y = ball.r;
          ball.vy *= -1;
          playRetroSound('select');
        }
        if (ball.y > h - 22 && ball.y < h - 14 && Math.abs(ball.x - pad.x) < pad.wd / 2 + ball.r && ball.vy > 0) {
          ball.vy *= -1;
          ball.vx += (ball.x - pad.x) * 2;
          playRetroSound('select');
        }
        if (ball.y > h + 12) newBall();

        for (const b of bricks) {
          if (!b.alive) continue;
          if (
            ball.x > b.x - ball.r &&
            ball.x < b.x + b.w + ball.r &&
            ball.y > b.y - ball.r &&
            ball.y < b.y + b.h + ball.r
          ) {
            b.alive = false;
            ball.vy *= -1;
            parts.burst(ball.x, ball.y, b.c, 10, 140);
            score += 10;
            playRetroSound('coin');
            if (env.onScoreChange) env.onScoreChange(score);
            break;
          }
        }

        if (bricks.length > 0 && bricks.every((b) => !b.alive)) build();

        parts.step(dt);

        bg(ctx, w, h, '#161333', '#0e0b24');

        for (const b of bricks) {
          if (!b.alive) continue;
          ctx.fillStyle = b.c;
          rr(ctx, b.x, b.y, b.w, b.h, 3);
          ctx.fill();
        }

        ctx.fillStyle = C.star;
        rr(ctx, pad.x - pad.wd / 2, h - 20, pad.wd, 8, 4);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, TAU);
        ctx.fill();

        parts.draw(ctx);
      }
    };
  };
}

// 4. SNAKE
export function Snake(): GameFactory {
  return function(ctx, w, h, env) {
    const cell = 12;
    let cols = Math.floor(w / cell);
    let rows = Math.floor(h / cell);
    let snake: Array<{ x: number; y: number }>;
    let dir: { x: number; y: number };
    let food: { x: number; y: number };
    let tick = 0;
    let score = 0;

    function spawnFood() {
      // Find a safe spot free from obstacles/walls
      let spot = { x: ri(0, cols - 1), y: ri(0, rows - 1) };
      let attempts = 0;
      while (attempts < 100 && env.customGrid && env.customGrid[spot.y * cols + spot.x]) {
        spot = { x: ri(0, cols - 1), y: ri(0, rows - 1) };
        attempts++;
      }
      food = spot;
    }

    function reset() {
      snake = [{ x: (cols >> 1), y: (rows >> 1) }];
      dir = { x: 1, y: 0 };
      spawnFood();
    }

    reset();

    function think() {
      const head = snake[0];
      const dx = food.x - head.x;
      const dy = food.y - head.y;
      let opts = [];
      if (Math.abs(dx) > Math.abs(dy)) {
        opts = [
          { x: Math.sign(dx), y: 0 },
          { x: 0, y: Math.sign(dy) || 1 },
          { x: 0, y: -(Math.sign(dy) || 1) }
        ];
      } else {
        opts = [
          { x: 0, y: Math.sign(dy) },
          { x: Math.sign(dx) || 1, y: 0 },
          { x: -(Math.sign(dx) || 1), y: 0 }
        ];
      }
      for (const o of opts) {
        if (o.x === -dir.x && o.y === -dir.y) continue;
        const nx = head.x + o.x;
        const ny = head.y + o.y;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        if (snake.some((s) => s.x === nx && s.y === ny)) continue;
        if (env.customGrid && env.customGrid[ny * cols + nx]) continue;
        return o;
      }
      return dir;
    }

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        cols = Math.floor(w / cell);
        rows = Math.floor(h / cell);
        reset();
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        tick += dt;
        if (tick >= 0.12 / speedMultiplier) {
          tick = 0;
          dir = think();
          const head = snake[0];
          const nx = head.x + dir.x;
          const ny = head.y + dir.y;
          const isHitObstacle = env.customGrid && env.customGrid[ny * cols + nx];
          if (
            nx < 0 ||
            ny < 0 ||
            nx >= cols ||
            ny >= rows ||
            snake.some((s) => s.x === nx && s.y === ny) ||
            isHitObstacle
          ) {
            reset();
            playRetroSound('lose');
          } else {
            snake.unshift({ x: nx, y: ny });
            if (nx === food.x && ny === food.y) {
              spawnFood();
              score += 50;
              playRetroSound('coin');
              if (env.onScoreChange) env.onScoreChange(score);
            } else {
              snake.pop();
            }
          }
        }

        bg(ctx, w, h, '#13112c', '#0d0b20');
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = C.moon;
        for (let x = 0; x <= cols; x++) {
          ctx.beginPath();
          ctx.moveTo(x * cell, 0);
          ctx.lineTo(x * cell, rows * cell);
          ctx.stroke();
        }
        for (let y = 0; y <= rows; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * cell);
          ctx.lineTo(cols * cell, y * cell);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Draw custom obstacles
        if (env.customGrid) {
          ctx.fillStyle = '#2c274a';
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              if (env.customGrid[y * cols + x]) {
                rr(ctx, x * cell + 1, y * cell + 1, cell - 2, cell - 2, 2);
                ctx.fill();
              }
            }
          }
        }

        ctx.fillStyle = C.coral;
        starPath(ctx, food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.4, 5, 0.5);
        ctx.fill();

        for (let i = 0; i < snake.length; i++) {
          const s = snake[i];
          ctx.fillStyle = i === 0 ? C.sun : C.green;
          ctx.globalAlpha = i === 0 ? 1 : clamp(1 - (i / snake.length) * 0.6, 0.4, 1);
          rr(ctx, s.x * cell + 1, s.y * cell + 1, cell - 2, cell - 2, 3);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    };
  };
}

// 5. TAP HOPPER
export function TapHopper(): GameFactory {
  return function(ctx, w, h, env) {
    let bird: { y: number; vy: number };
    let pipes: Array<{ x: number; gy: number; passed: boolean }> = [];
    const gap = 58;
    let spawn = 0;
    let score = 0;

    function reset() {
      bird = { y: h / 2, vy: 0 };
      pipes = [];
      spawn = 0;
      score = 0;
    }

    reset();

    function flap() {
      const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
      bird.vy = -150 * speedMultiplier;
      playRetroSound('jump');
    }

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        reset();
      },
      tap() {
        flap();
      },
      step(dt) {
        const gravityMultiplier = env.gravitySetting ? env.gravitySetting / 0.6 : 1.0;
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;

        spawn -= dt;
        if (spawn <= 0) {
          const gy = rnd(gap, h - gap);
          pipes.push({ x: w + 10, gy, passed: false });
          spawn = 1.5 / speedMultiplier;
        }

        bird.vy += 420 * gravityMultiplier * dt;
        bird.y += bird.vy * dt;

        // Auto AI when not actively playing
        if (!env.pointer.down) {
          const np = pipes.find((p) => p.x > 40);
          const target = np ? np.gy : h / 2;
          if (bird.y > target + 6 && bird.vy > -40) flap();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
          const p = pipes[i];
          p.x -= 110 * speedMultiplier * dt;
          if (p.x < -20) {
            pipes.splice(i, 1);
            continue;
          }
          if (!p.passed && p.x < 46) {
            p.passed = true;
            score += 10;
            playRetroSound('coin');
            if (env.onScoreChange) env.onScoreChange(score);
          }
          if (p.x < 60 && p.x > 20) {
            if (bird.y < p.gy - gap / 2 || bird.y > p.gy + gap / 2) {
              reset();
              playRetroSound('lose');
            }
          }
        }

        if (bird.y > h - 6 || bird.y < 6) {
          reset();
          playRetroSound('lose');
        }

        bg(ctx, w, h, '#1c2247', '#10142e');

        for (const p of pipes) {
          ctx.fillStyle = C.green;
          rr(ctx, p.x, 0, 26, p.gy - gap / 2, 4);
          ctx.fill();
          rr(ctx, p.x, p.gy + gap / 2, 26, h - (p.gy + gap / 2), 4);
          ctx.fill();
        }

        ctx.save();
        ctx.translate(46, bird.y);
        ctx.rotate(clamp(bird.vy / 300, -0.5, 0.7));
        ctx.fillStyle = C.sun;
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, TAU);
        ctx.fill();

        ctx.fillStyle = '#13102a';
        ctx.beginPath();
        ctx.arc(3, -2, 2, 0, TAU);
        ctx.fill();

        ctx.fillStyle = C.coral;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(13, 2);
        ctx.lineTo(8, 4);
        ctx.fill();
        ctx.restore();
      }
    };
  };
}

// 6. PIXEL PLATFORMER
export function Platformer(): GameFactory {
  return function(ctx, w, h, env) {
    const hero = { x: w * 0.3, y: 0, vy: 0, onG: false };
    let ground: number;
    let coins: Array<{ x: number; y: number; got: boolean }> = [];
    let scroll = 0;
    let obst: Array<{ x: number; w: number; h: number }> = [];
    let spawn = 0;
    let cspawn = 0;
    let score = 0;

    function reset() {
      ground = h - 26;
      hero.y = ground - 14;
      hero.vy = 0;
      obst = [];
      coins = [];
    }

    reset();

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        reset();
      },
      step(dt) {
        const gravityMultiplier = env.gravitySetting ? env.gravitySetting / 0.6 : 1.0;
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;

        scroll += 70 * speedMultiplier * dt;
        spawn -= dt;
        if (spawn <= 0) {
          obst.push({ x: w + 20, w: rnd(12, 20), h: rnd(14, 26) });
          spawn = rnd(1.1, 1.9) / speedMultiplier;
        }

        cspawn -= dt;
        if (cspawn <= 0) {
          coins.push({ x: w + 20, y: ground - rnd(30, 70), got: false });
          cspawn = rnd(0.7, 1.3) / speedMultiplier;
        }

        hero.vy += 900 * gravityMultiplier * dt;
        hero.y += hero.vy * dt;
        if (hero.y > ground - 14) {
          hero.y = ground - 14;
          hero.vy = 0;
          hero.onG = true;
        } else {
          hero.onG = false;
        }

        // Auto jump over obstacles
        let near = null;
        for (const o of obst) {
          const d = o.x - hero.x;
          if (d > -10 && d < 70) {
            near = o;
            break;
          }
        }
        if (near && hero.onG && near.x - hero.x < 46) {
          hero.vy = -340 * (env.gravitySetting ? Math.sqrt(env.gravitySetting / 0.6) : 1.0);
          playRetroSound('jump');
        }

        for (let i = obst.length - 1; i >= 0; i--) {
          obst[i].x -= 70 * speedMultiplier * dt;
          if (obst[i].x < -30) obst.splice(i, 1);
        }

        for (let i = coins.length - 1; i >= 0; i--) {
          const c = coins[i];
          c.x -= 70 * speedMultiplier * dt;
          if (c.x < -20) {
            coins.splice(i, 1);
            continue;
          }
          if (!c.got && Math.abs(c.x - hero.x) < 16 && Math.abs(c.y - hero.y) < 18) {
            c.got = true;
            coins.splice(i, 1);
            score += 20;
            playRetroSound('coin');
            if (env.onScoreChange) env.onScoreChange(score);
          }
        }

        bg(ctx, w, h, '#241a45', '#15112e');

        ctx.fillStyle = '#2c2152';
        for (let k = 0; k < 3; k++) {
          const off = (scroll * 0.3 + k * w * 0.5) % (w + 200) - 100;
          ctx.beginPath();
          ctx.moveTo(off - 60, ground);
          ctx.arc(off, ground, 70, Math.PI, 0);
          ctx.fill();
        }

        ctx.fillStyle = '#3a2e63';
        ctx.fillRect(0, ground, w, h - ground);
        ctx.fillStyle = C.moon;
        ctx.globalAlpha = 0.5;
        for (let x = (scroll % 24); x < w; x += 24) {
          ctx.fillRect(x, ground, 12, 3);
        }
        ctx.globalAlpha = 1;

        for (const o of obst) {
          ctx.fillStyle = C.coral;
          rr(ctx, o.x, ground - o.h, o.w, o.h, 3);
          ctx.fill();
        }

        for (const c of coins) {
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(Math.sin(env.t * 6) * 0.4 + 0.7, 1);
          ctx.fillStyle = C.sun;
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, TAU);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.translate(hero.x, hero.y);
        const bob = hero.onG ? Math.sin(env.t * 16) * 1.5 : 0;
        ctx.fillStyle = C.star;
        rr(ctx, -8, -12 + bob, 16, 22, 4);
        ctx.fill();

        ctx.fillStyle = '#13102a';
        ctx.fillRect(-3, -7 + bob, 3, 3);
        ctx.fillRect(2, -7 + bob, 3, 3);

        ctx.fillStyle = C.coral;
        const lp = hero.onG ? Math.sin(env.t * 16) * 3 : 0;
        ctx.fillRect(-7, 9 + bob, 4, 4 + lp);
        ctx.fillRect(3, 9 + bob, 4, 4 - lp);
        ctx.restore();
      }
    };
  };
}

// 7. GEM CASCADE
export function GemMatch(): GameFactory {
  return function(ctx, w, h, env) {
    let cols: number;
    let rows: number;
    let cw: number;
    let grid: number[][];
    let timer = 0;
    let popping: Array<{ x: number; y: number; c: string; t: number }> = [];
    const cset = [C.coral, C.sun, C.green, C.moon, C.star, C.pink];
    let score = 0;

    function init() {
      cw = Math.floor(Math.min(w, h) / 5);
      cols = Math.max(4, Math.floor(w / cw));
      rows = Math.max(4, Math.floor(h / cw));
      grid = [];
      for (let y = 0; y < rows; y++) {
        grid[y] = [];
        for (let x = 0; x < cols; x++) {
          grid[y][x] = ri(0, cset.length - 1);
        }
      }
    }

    init();

    function clearLine() {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols - 2; x++) {
          const v = grid[y][x];
          if (v === grid[y][x + 1] && v === grid[y][x + 2]) {
            for (let k = 0; k < 3; k++) popping.push({ x: x + k, y, c: cset[v], t: 0 });
            return true;
          }
        }
      }
      const y = ri(0, rows - 1);
      const x = ri(0, cols - 3);
      const v = ri(0, cset.length - 1);
      grid[y][x] = grid[y][x + 1] = grid[y][x + 2] = v;
      return false;
    }

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        init();
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        timer -= dt;
        if (timer <= 0) {
          if (clearLine()) {
            score += 30;
            playRetroSound('win');
            if (env.onScoreChange) env.onScoreChange(score);
          }
          timer = 1.1 / speedMultiplier;
        }

        for (let i = popping.length - 1; i >= 0; i--) {
          const p = popping[i];
          p.t += dt;
          if (p.t > 0.35) {
            grid[p.y][p.x] = ri(0, cset.length - 1);
            popping.splice(i, 1);
          }
        }

        bg(ctx, w, h, '#191436', '#0f0b26');

        const ox = (w - cols * cw) / 2;
        const oy = (h - rows * cw) / 2;

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const v = grid[y][x];
            const pop = popping.find((p) => p.x === x && p.y === y);
            let s = 1;
            if (pop) {
              s = clamp(1 - pop.t / 0.35, 0, 1);
            }
            ctx.save();
            ctx.translate(ox + x * cw + cw / 2, oy + y * cw + cw / 2);
            ctx.scale(s, s);
            ctx.fillStyle = cset[v];
            const r = cw * 0.34;
            starPath(ctx, 0, 0, r, 6, 0.6);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,.35)';
            ctx.beginPath();
            ctx.arc(-r * 0.25, -r * 0.25, r * 0.18, 0, TAU);
            ctx.fill();
            ctx.restore();
          }
        }
      }
    };
  };
}

// 8. BUBBLE BURST
export function BubblePop(): GameFactory {
  return function(ctx, w, h, env) {
    const cset = [C.coral, C.sun, C.green, C.moon, C.pink];
    let bubbles: Array<{ x: number; y: number; r: number; c: number }> = [];
    let shotC = 0;
    let shot: { x: number; y: number; vx: number; vy: number; c: number } | null = null;
    let ang = 0;
    let fire = 0;
    const parts = Particles();
    let score = 0;

    function init() {
      bubbles = [];
      const r = 12;
      for (let y = 0; y < 3; y++) {
        const n = Math.floor(w / (r * 2));
        for (let x = 0; x < n; x++) {
          bubbles.push({
            x: r + x * r * 2 + (y % 2 ? r : 0),
            y: r + 6 + y * r * 1.8,
            r,
            c: ri(0, cset.length - 1)
          });
        }
      }
      shotC = ri(0, cset.length - 1);
    }

    init();

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        init();
      },
      tap() {
        if (!shot && fire <= 0) {
          const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
          shot = {
            x: w / 2,
            y: h - 16,
            vx: Math.sin(ang) * 260 * speedMultiplier,
            vy: -300 * speedMultiplier,
            c: shotC
          };
          playRetroSound('laser');
        }
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        ang = Math.sin(env.t * 0.9) * 0.7;
        fire -= dt;

        if (!env.pointer.active && !shot && fire <= 0) {
          shot = {
            x: w / 2,
            y: h - 16,
            vx: Math.sin(ang) * 260 * speedMultiplier,
            vy: -300 * speedMultiplier,
            c: shotC
          };
          playRetroSound('laser');
        }

        if (shot) {
          shot.x += shot.vx * dt;
          shot.y += shot.vy * dt;
          if (shot.x < 10 || shot.x > w - 10) shot.vx *= -1;

          let hit = false;
          for (const b of bubbles) {
            if (Math.hypot(b.x - shot.x, b.y - shot.y) < b.r + 10) {
              hit = true;
              break;
            }
          }

          if (hit || shot.y < 14) {
            const ix = shot.x;
            const iy = shot.y;
            let popCount = 0;
            for (let i = bubbles.length - 1; i >= 0; i--) {
              const b = bubbles[i];
              if (Math.hypot(b.x - ix, b.y - iy) < 40 && b.c === shot.c) {
                parts.burst(b.x, b.y, cset[b.c], 8, 120);
                bubbles.splice(i, 1);
                popCount++;
              }
            }
            if (popCount > 0) {
              score += popCount * 10;
              playRetroSound('coin');
              if (env.onScoreChange) env.onScoreChange(score);
            }
            shot = null;
            fire = 0.5 / speedMultiplier;
            shotC = ri(0, cset.length - 1);
            if (bubbles.length < 6) init();
          }
        }

        parts.step(dt);

        bg(ctx, w, h, '#191537', '#0e0b25');

        for (const b of bubbles) {
          ctx.fillStyle = cset[b.c];
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, TAU);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,.3)';
          ctx.beginPath();
          ctx.arc(b.x - 3, b.y - 3, b.r * 0.3, 0, TAU);
          ctx.fill();
        }

        ctx.save();
        ctx.translate(w / 2, h - 12);
        ctx.rotate(ang);
        ctx.fillStyle = C.moon;
        rr(ctx, -4, -22, 8, 22, 3);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = cset[shotC];
        ctx.beginPath();
        ctx.arc(w / 2, h - 12, 7, 0, TAU);
        ctx.fill();

        if (shot) {
          ctx.fillStyle = cset[shot.c];
          ctx.beginPath();
          ctx.arc(shot.x, shot.y, 10, 0, TAU);
          ctx.fill();
        }

        parts.draw(ctx);
      }
    };
  };
}

// 9. TOWER SIEGE
export function TowerSiege(): GameFactory {
  return function(ctx, w, h, env) {
    let path: Array<{ x: number; y: number }> = [];
    let enemies: Array<{ d: number; hp: number; max: number }> = [];
    let towers: Array<{ x: number; y: number; cd: number }> = [];
    let spawn = 0;
    const parts = Particles();
    let shots: Array<{ x: number; y: number; tx: number; ty: number; e: typeof enemies[0]; life: number }> = [];
    let score = 0;

    function init() {
      path = [
        { x: -10, y: h * 0.3 },
        { x: w * 0.4, y: h * 0.3 },
        { x: w * 0.4, y: h * 0.7 },
        { x: w + 10, y: h * 0.7 }
      ];
      enemies = [];
      spawn = 0;
      towers = [
        { x: w * 0.25, y: h * 0.6, cd: 0 },
        { x: w * 0.6, y: h * 0.45, cd: 0 }
      ];
      shots = [];
    }

    init();

    function segLen() {
      let L = 0;
      for (let i = 0; i < path.length - 1; i++) {
        L += Math.hypot(path[i + 1].x - path[i].x, path[i + 1].y - path[i].y);
      }
      return L;
    }

    function posAt(d: number) {
      for (let i = 0; i < path.length - 1; i++) {
        const a = path[i];
        const b = path[i + 1];
        const l = Math.hypot(b.x - a.x, b.y - a.y);
        if (d <= l) {
          const t = d / l;
          return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
        }
        d -= l;
      }
      return path[path.length - 1];
    }

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        init();
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        spawn -= dt;
        if (spawn <= 0) {
          enemies.push({ d: 0, hp: 3, max: 3 });
          spawn = rnd(1.0, 1.8) / speedMultiplier;
        }

        const total = segLen();
        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          e.d += 40 * speedMultiplier * dt;
          if (e.d > total) {
            enemies.splice(i, 1);
          }
        }

        for (const t of towers) {
          t.cd -= dt;
          if (t.cd <= 0) {
            let tg = null;
            let bd = 70;
            for (const e of enemies) {
              const p = posAt(e.d);
              const dd = Math.hypot(p.x - t.x, p.y - t.y);
              if (dd < bd) {
                bd = dd;
                tg = e;
              }
            }
            if (tg) {
              const p = posAt(tg.d);
              shots.push({ x: t.x, y: t.y, tx: p.x, ty: p.y, e: tg, life: 0.18 });
              t.cd = 0.6 / speedMultiplier;
              playRetroSound('select');
            }
          }
        }

        for (let i = shots.length - 1; i >= 0; i--) {
          const s = shots[i];
          s.life -= dt;
          if (s.life <= 0) {
            if (s.e && enemies.includes(s.e)) {
              s.e.hp--;
              const p = posAt(s.e.d);
              parts.burst(p.x, p.y, C.sun, 6, 90);
              playRetroSound('select');
              if (s.e.hp <= 0) {
                enemies.splice(enemies.indexOf(s.e), 1);
                parts.burst(p.x, p.y, C.coral, 12, 150);
                score += 50;
                playRetroSound('hit');
                if (env.onScoreChange) env.onScoreChange(score);
              }
            }
            shots.splice(i, 1);
          }
        }

        parts.step(dt);

        bg(ctx, w, h, '#15182f', '#0d0f22');

        ctx.strokeStyle = '#2c3358';
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke();

        ctx.strokeStyle = '#3a447a';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke();
        ctx.setLineDash([]);

        for (const e of enemies) {
          const p = posAt(e.d);
          ctx.fillStyle = C.coral;
          rr(ctx, p.x - 7, p.y - 7, 14, 14, 3);
          ctx.fill();
          ctx.fillStyle = '#0d0f22';
          ctx.fillRect(p.x - 8, p.y - 13, 16, 3);
          ctx.fillStyle = C.green;
          ctx.fillRect(p.x - 8, p.y - 13, 16 * (e.hp / e.max), 3);
        }

        for (const t of towers) {
          ctx.fillStyle = C.moon;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 11, 0, TAU);
          ctx.fill();
          ctx.fillStyle = C.star;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 5, 0, TAU);
          ctx.fill();
        }

        for (const s of shots) {
          ctx.strokeStyle = C.sun;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.tx, s.ty);
          ctx.stroke();
        }

        parts.draw(ctx);
      }
    };
  };
}

// 10. MAZE MUNCHER
export function MazeRunner(): GameFactory {
  return function(ctx, w, h, env) {
    const cell = 16;
    let cols: number;
    let rows: number;
    let maze: number[][];
    let player: { x: number; y: number; px: number; py: number };
    let ghost: { x: number; y: number; px: number; py: number };
    let pellets: Array<{ x: number; y: number }> = [];
    let tick = 0;
    let score = 0;

    function gen() {
      cols = Math.floor(w / cell);
      rows = Math.floor(h / cell);
      const isCustom = env.customGrid && env.customGrid.length === rows * cols;

      if (isCustom) {
        maze = [];
        pellets = [];
        for (let y = 0; y < rows; y++) {
          maze[y] = [];
          for (let x = 0; x < cols; x++) {
            const val = env.customGrid![y * cols + x];
            maze[y][x] = val === 1 ? 1 : 0;
            if (val === 2) pellets.push({ x, y });
          }
        }
      } else {
        maze = [];
        for (let y = 0; y < rows; y++) {
          maze[y] = [];
          for (let x = 0; x < cols; x++) {
            maze[y][x] =
              x === 0 ||
              y === 0 ||
              x === cols - 1 ||
              y === rows - 1 ||
              (x % 2 === 0 && y % 2 === 0 && Math.random() < 0.7)
                ? 1
                : 0;
          }
        }
        pellets = [];
        for (let y = 1; y < rows - 1; y++) {
          for (let x = 1; x < cols - 1; x++) {
            if (maze[y][x] === 0 && Math.random() < 0.5) pellets.push({ x, y });
          }
        }
      }
      player = { x: 1, y: 1, px: 1, py: 1 };
      ghost = { x: cols - 2, y: rows - 2, px: cols - 2, py: rows - 2 };
    }

    gen();

    function free(x: number, y: number) {
      return x >= 0 && y >= 0 && x < cols && y < rows && maze[y][x] === 0;
    }

    function stepEntity(e: typeof player, target: { x: number; y: number }) {
      const opts = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ].filter((o) => free(e.x + o.x, e.y + o.y));
      if (!opts.length) return;
      opts.sort(
        (a, b) =>
          Math.hypot(e.x + a.x - target.x, e.y + a.y - target.y) -
          Math.hypot(e.x + b.x - target.x, e.y + b.y - target.y)
      );
      const o = Math.random() < 0.8 ? opts[0] : pick(opts);
      e.px = e.x;
      e.py = e.y;
      e.x += o.x;
      e.y += o.y;
    }

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        gen();
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        tick += dt;
        const sp = 0.14 / speedMultiplier;
        if (tick >= sp) {
          tick = 0;
          let tg = pellets[0] || { x: cols - 2, y: rows - 2 };
          let bd = 1e9;
          for (const p of pellets) {
            const d = Math.hypot(p.x - player.x, p.y - player.y);
            if (d < bd) {
              bd = d;
              tg = p;
            }
          }
          stepEntity(player, tg);
          stepEntity(ghost, player);

          for (let i = pellets.length - 1; i >= 0; i--) {
            if (pellets[i].x === player.x && pellets[i].y === player.y) {
              pellets.splice(i, 1);
              score += 10;
              playRetroSound('select');
              if (env.onScoreChange) env.onScoreChange(score);
            }
          }
          if (player.x === ghost.x && player.y === ghost.y) {
            gen();
            playRetroSound('lose');
          } else if (!pellets.length) {
            gen();
            playRetroSound('win');
          }
        }

        const a = tick / sp;
        bg(ctx, w, h, '#0f0d24', '#0a0818');

        const ox = (w - cols * cell) / 2;
        const oy = (h - rows * cell) / 2;

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 1) {
              ctx.fillStyle = '#2a2a66';
              rr(ctx, ox + x * cell + 1, oy + y * cell + 1, cell - 2, cell - 2, 3);
              ctx.fill();
            }
          }
        }

        ctx.fillStyle = C.sun;
        for (const p of pellets) {
          ctx.beginPath();
          ctx.arc(ox + p.x * cell + cell / 2, oy + p.y * cell + cell / 2, 2.2, 0, TAU);
          ctx.fill();
        }

        const pxx = ox + lerp(player.px, player.x, a) * cell + cell / 2;
        const pyy = oy + lerp(player.py, player.y, a) * cell + cell / 2;
        ctx.fillStyle = C.star;
        ctx.beginPath();
        ctx.arc(
          pxx,
          pyy,
          cell * 0.4,
          0.25 * TAU + Math.sin(env.t * 16) * 0.2,
          0.75 * TAU - Math.sin(env.t * 16) * 0.2
        );
        ctx.lineTo(pxx, pyy);
        ctx.fill();

        const gxx = ox + lerp(ghost.px, ghost.x, a) * cell + cell / 2;
        const gyy = oy + lerp(ghost.py, ghost.y, a) * cell + cell / 2;
        ctx.fillStyle = C.coral;
        ctx.beginPath();
        ctx.arc(gxx, gyy, cell * 0.38, Math.PI, 0);
        ctx.lineTo(gxx + cell * 0.38, gyy + cell * 0.4);
        ctx.lineTo(gxx - cell * 0.38, gyy + cell * 0.4);
        ctx.fill();
      }
    };
  };
}

// 11. SKY RACER
export function SkyRacer(): GameFactory {
  return function(ctx, w, h, env) {
    let traffic: Array<{ lane: number; y: number }> = [];
    const player = { x: w / 2, lane: 1 };
    let scroll = 0;
    let spawn = 0;
    const laneN = 3;
    let score = 0;

    function init() {
      traffic = [];
      player.x = w / 2;
      player.lane = 1;
      spawn = 0;
    }

    init();

    function laneX(l: number) {
      const roadW = Math.min(w * 0.7, 160);
      const x0 = (w - roadW) / 2;
      return x0 + roadW * (l + 0.5) / laneN;
    }

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        init();
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        scroll += 220 * speedMultiplier * dt;
        spawn -= dt;

        if (spawn <= 0) {
          traffic.push({ lane: ri(0, laneN - 1), y: -30 });
          spawn = rnd(0.6, 1.1) / speedMultiplier;
        }

        const danger = [0, 0, 0];
        for (const t of traffic) {
          if (t.y > h * 0.3 && t.y < h * 0.9) danger[t.lane] += 1;
        }

        let best = player.lane;
        let bd = danger[player.lane] + 0.1;
        for (let l = 0; l < laneN; l++) {
          if (danger[l] < bd) {
            bd = danger[l];
            best = l;
          }
        }

        if (env.pointer.active) {
          const roadW = Math.min(w * 0.7, 160);
          const x0 = (w - roadW) / 2;
          best = clamp(Math.floor((env.pointer.x - x0) / (roadW / laneN)), 0, laneN - 1);
        }

        player.lane = best;
        player.x = lerp(player.x, laneX(player.lane), 0.18);

        for (let i = traffic.length - 1; i >= 0; i--) {
          traffic[i].y += 160 * speedMultiplier * dt;
          if (traffic[i].y > h + 30) {
            traffic.splice(i, 1);
            score += 10;
            playRetroSound('coin');
            if (env.onScoreChange) env.onScoreChange(score);
          }
        }

        bg(ctx, w, h, '#15182f', '#0d1022');

        const roadW = Math.min(w * 0.7, 160);
        const x0 = (w - roadW) / 2;

        ctx.fillStyle = '#1f2444';
        ctx.fillRect(x0, 0, roadW, h);

        ctx.strokeStyle = C.sun;
        ctx.lineWidth = 3;
        ctx.setLineDash([14, 16]);
        for (let l = 1; l < laneN; l++) {
          ctx.beginPath();
          ctx.lineDashOffset = -scroll;
          ctx.moveTo(x0 + roadW * l / laneN, 0);
          ctx.lineTo(x0 + roadW * l / laneN, h);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        for (const t of traffic) {
          ctx.fillStyle = C.moon;
          rr(ctx, laneX(t.lane) - 12, t.y - 18, 24, 36, 5);
          ctx.fill();
          ctx.fillStyle = '#0d1022';
          ctx.fillRect(laneX(t.lane) - 8, t.y - 12, 16, 8);
        }

        ctx.save();
        ctx.translate(player.x, h - 34);
        ctx.fillStyle = C.coral;
        rr(ctx, -13, -20, 26, 40, 6);
        ctx.fill();

        ctx.fillStyle = C.star;
        ctx.fillRect(-9, -13, 18, 9);
        ctx.fillStyle = C.sun;
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(env.t * 30);
        ctx.fillRect(-9, 18, 5, rnd(4, 9));
        ctx.fillRect(4, 18, 5, rnd(4, 9));
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    };
  };
}

// 12. LUA LANDER
export function Lander(): GameFactory {
  return function(ctx, w, h, env) {
    let ship: { x: number; y: number; vy: number; vx: number };
    let terrain: Array<{ x: number; y: number }> = [];
    const parts = Particles();
    let thrust = false;
    let score = 0;

    function makeTerrain() {
      terrain = [];
      let y = h - rnd(20, 40);
      for (let x = 0; x <= w; x += 20) {
        y += rnd(-12, 12);
        y = clamp(y, h - 60, h - 12);
        terrain.push({ x, y });
      }
    }

    function reset() {
      ship = { x: w / 2, y: 20, vy: 10, vx: rnd(-10, 10) };
      thrust = false;
    }

    makeTerrain();
    reset();

    function groundY(x: number) {
      for (let i = 0; i < terrain.length - 1; i++) {
        if (x >= terrain[i].x && x <= terrain[i + 1].x) {
          const t = (x - terrain[i].x) / (terrain[i + 1].x - terrain[i].x);
          return lerp(terrain[i].y, terrain[i + 1].y, t);
        }
      }
      return h - 20;
    }

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        makeTerrain();
        reset();
      },
      step(dt) {
        const gravityMultiplier = env.gravitySetting ? env.gravitySetting / 0.6 : 1.0;
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;

        const gy = groundY(ship.x);
        thrust = ship.vy > 14 || (gy - ship.y < 60 && ship.vy > 4);

        if (env.pointer.down) {
          thrust = true;
        }

        ship.vy += (thrust ? -46 : 30 * gravityMultiplier) * dt * speedMultiplier;
        ship.vx *= 0.99;
        ship.x += ship.vx * dt;
        ship.y += ship.vy * dt;

        if (ship.x < 10) {
          ship.x = 10;
          ship.vx *= -0.5;
        }
        if (ship.x > w - 10) {
          ship.x = w - 10;
          ship.vx *= -0.5;
        }

        if (ship.y >= gy - 8) {
          parts.burst(ship.x, gy, C.sun, 14, 120);
          if (ship.vy < 35 && Math.abs(ship.vx) < 15) {
            score += 100;
            playRetroSound('win');
            if (env.onScoreChange) env.onScoreChange(score);
          } else {
            playRetroSound('lose');
          }
          reset();
        }

        if (thrust && Math.random() < 0.7) {
          parts.burst(ship.x, ship.y + 10, C.coral, 2, 80);
          playRetroSound('laser');
        }

        parts.step(dt);

        bg(ctx, w, h, '#0e0c24', '#070512');
        drawStarfield(ctx, starfield_cache(this, w, h), w, h, env.t, 0);

        ctx.fillStyle = '#241f48';
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (const p of terrain) ctx.lineTo(p.x, p.y);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = C.moon;
        ctx.lineWidth = 2;
        ctx.beginPath();
        terrain.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.stroke();

        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.fillStyle = C.star;
        rr(ctx, -7, -7, 14, 12, 3);
        ctx.fill();
        ctx.fillStyle = C.moon;
        ctx.beginPath();
        ctx.arc(0, -2, 3, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = C.star;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-6, 5);
        ctx.lineTo(-9, 11);
        ctx.moveTo(6, 5);
        ctx.lineTo(9, 11);
        ctx.stroke();

        if (thrust) {
          ctx.fillStyle = C.sun;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.moveTo(-4, 6);
          ctx.lineTo(0, 12 + rnd(4, 9));
          ctx.lineTo(4, 6);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.restore();

        parts.draw(ctx);
      }
    };
  };
}

// 13. CARD CLASH
export function CardClash(): GameFactory {
  return function(ctx, w, h, env) {
    let phase = 0;
    let t = 0;
    let left: { v: number; s: number; flip: number };
    let right: { v: number; s: number; flip: number };
    let winner = 0;
    const suits = ['♠', '♥', '♦', '♣'];
    let score = 0;

    function deal() {
      left = { v: ri(2, 14), s: ri(0, 3), flip: 0 };
      right = { v: ri(2, 14), s: ri(0, 3), flip: 0 };
      winner = 0;
      phase = 1;
      t = 0;
    }

    deal();

    function name(v: number) {
      return v <= 10 ? String(v) : ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' } as any)[v];
    }

    function card(x: number, y: number, cd: typeof left, flip: number, big: boolean) {
      const cwd = big ? 46 : 40;
      const chd = big ? 64 : 56;
      ctx.save();
      ctx.translate(x, y);
      const sc = Math.abs(Math.cos(flip * Math.PI));
      ctx.scale(Math.max(sc, 0.02), 1);
      const showFront = flip >= 0.5;
      ctx.fillStyle = showFront ? '#f4f1ff' : C.moon;
      rr(ctx, -cwd / 2, -chd / 2, cwd, chd, 7);
      ctx.fill();
      ctx.strokeStyle = showFront ? '#cfc8ef' : '#5446b8';
      ctx.lineWidth = 2;
      rr(ctx, -cwd / 2, -chd / 2, cwd, chd, 7);
      ctx.stroke();

      if (showFront) {
        const red = cd.s === 1 || cd.s === 2;
        ctx.fillStyle = red ? C.coral : '#241f48';
        ctx.font = 'bold 16px Inter,sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(name(cd.v), -cwd / 2 + 5, -chd / 2 + 17);
        ctx.font = '20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(suits[cd.s], 0, 6);
      } else {
        ctx.fillStyle = C.star;
        ctx.font = '18px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('★', 0, 6);
      }
      ctx.restore();
    }

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
      },
      tap() {
        if (phase === 2) {
          deal();
          playRetroSound('select');
        }
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        t += dt * speedMultiplier;

        if (phase === 1) {
          left.flip = clamp((t - 0.2) / 0.4, 0, 1);
          right.flip = clamp((t - 0.5) / 0.4, 0, 1);
          if (t > 1.1) {
            phase = 2;
            t = 0;
            winner = left.v > right.v ? -1 : left.v < right.v ? 1 : 0;
            if (winner === -1) {
              score += 50;
              playRetroSound('win');
              if (env.onScoreChange) env.onScoreChange(score);
            } else {
              playRetroSound('lose');
            }
          }
        } else if (phase === 2) {
          if (t > 1.3) deal();
        }

        bg(ctx, w, h, '#171433', '#0e0b24');
        ctx.fillStyle = C.mut;
        ctx.font = '10px "JetBrains Mono",monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CARD CLASH', w / 2, 16);

        const glowL = phase === 2 && winner === -1;
        const glowR = phase === 2 && winner === 1;

        if (glowL) {
          ctx.shadowColor = C.sun;
          ctx.shadowBlur = 18;
        }
        card(w * 0.32, h / 2 + 4, left, left.flip, true);
        ctx.shadowBlur = 0;

        if (glowR) {
          ctx.shadowColor = C.sun;
          ctx.shadowBlur = 18;
        }
        card(w * 0.68, h / 2 + 4, right, right.flip, true);
        ctx.shadowBlur = 0;

        ctx.fillStyle = C.sun;
        ctx.font = 'bold 14px Inter';
        ctx.fillText('VS', w / 2, h / 2 + 9);

        if (phase === 2) {
          ctx.fillStyle = C.green;
          ctx.font = 'bold 11px Inter';
          ctx.fillText(winner === 0 ? 'TIE' : winner === -1 ? '◀ WINS' : 'WINS ▶', w / 2, h - 12);
        }
      }
    };
  };
}

// 14. WHACK CRITTER
export function Whack(): GameFactory {
  return function(ctx, w, h, env) {
    let holes: Array<{ x: number; y: number; up: number; active: boolean; t: number }> = [];
    const parts = Particles();
    let timer = 0;
    const hammer = { x: w / 2, y: h / 2, sw: 0 };
    let score = 0;

    function init() {
      holes = [];
      const cols = 3;
      const rows = 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          holes.push({
            x: ((c + 1) * w) / (cols + 1),
            y: ((r + 1) * h) / (rows + 1) + 6,
            up: 0,
            active: false,
            t: 0
          });
        }
      }
    }

    init();

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        init();
      },
      tap(x, y) {
        hammer.x = x;
        hammer.y = y;
        hammer.sw = 0.1;
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        timer -= dt;
        if (timer <= 0) {
          const freeHoles = holes.filter((o) => !o.active);
          if (freeHoles.length) {
            const o = pick(freeHoles);
            o.active = true;
            o.t = 0;
          }
          timer = rnd(0.4, 0.9) / speedMultiplier;
        }

        let target = null;
        for (const o of holes) {
          if (o.active) {
            o.t += dt * speedMultiplier;
            o.up = Math.sin(clamp(o.t / 0.8, 0, 1) * Math.PI);
            if (o.t > 0.8) {
              o.active = false;
              o.up = 0;
            }
            if (o.up > 0.6 && !target) target = o;
          }
        }

        if (env.pointer.active) {
          hammer.x = lerp(hammer.x, env.pointer.x, 0.25);
          hammer.y = lerp(hammer.y, env.pointer.y, 0.25);
          if (env.pointer.down && hammer.sw === 0) {
            hammer.sw = 0.1;
          }
        } else if (target) {
          hammer.x = lerp(hammer.x, target.x + 14, 0.25);
          hammer.y = lerp(hammer.y, target.y - 16, 0.25);
        }

        if (hammer.sw > 0) {
          hammer.sw += dt * 6 * speedMultiplier;
          if (hammer.sw > 1) {
            holes.forEach((o) => {
              if (o.active && Math.hypot(o.x - hammer.x, o.y - hammer.y) < 36) {
                parts.burst(o.x, o.y - 6, C.sun, 12, 140);
                o.active = false;
                o.up = 0;
                score += 50;
                playRetroSound('hit');
                if (env.onScoreChange) env.onScoreChange(score);
              }
            });
            hammer.sw = 0;
          }
        }

        parts.step(dt);

        bg(ctx, w, h, '#1a1638', '#100c27');

        for (const o of holes) {
          ctx.fillStyle = '#0e0b22';
          ctx.beginPath();
          ctx.ellipse(o.x, o.y + 12, 20, 8, 0, 0, TAU);
          ctx.fill();

          if (o.up > 0.02) {
            const yy = o.y + 12 - o.up * 26;
            ctx.fillStyle = C.coral;
            ctx.beginPath();
            ctx.arc(o.x, yy, 14, Math.PI, 0);
            ctx.lineTo(o.x + 14, o.y + 12);
            ctx.lineTo(o.x - 14, o.y + 12);
            ctx.fill();

            ctx.fillStyle = '#13102a';
            ctx.beginPath();
            ctx.arc(o.x - 5, yy - 3, 2, 0, TAU);
            ctx.arc(o.x + 5, yy - 3, 2, 0, TAU);
            ctx.fill();
          }
        }

        ctx.save();
        ctx.translate(hammer.x, hammer.y);
        ctx.rotate(-0.6 + Math.sin(hammer.sw * Math.PI) * 0.9);
        ctx.fillStyle = C.moon;
        rr(ctx, -4, 0, 8, 30, 3);
        ctx.fill();
        ctx.fillStyle = C.star;
        rr(ctx, -14, -10, 28, 16, 4);
        ctx.fill();
        ctx.restore();

        parts.draw(ctx);
      }
    };
  };
}

// 15. STAR FORGE
export function StarForge(): GameFactory {
  return function(ctx, w, h, env) {
    let nodes: Array<{ x: number; y: number; connected: boolean }> = [];
    const ship = { x: w / 2, y: h / 2 };
    let route: number[] = [];
    let ri2 = 0;
    let prog = 0;
    const parts = Particles();
    let field = starfield(50, w, h);
    let score = 0;

    function init() {
      field = starfield(50, w, h);
      nodes = [];
      const n = 6;
      for (let i = 0; i < n; i++) {
        nodes.push({ x: rnd(24, w - 24), y: rnd(24, h - 24), connected: i === 0 });
      }
      route = [0];
      let cur = 0;
      const used = new Set([0]);
      while (route.length < n) {
        let best = -1;
        let bd = 1e9;
        for (let i = 0; i < n; i++) {
          if (used.has(i)) continue;
          const d = Math.hypot(nodes[i].x - nodes[cur].x, nodes[i].y - nodes[cur].y);
          if (d < bd) {
            bd = d;
            best = i;
          }
        }
        route.push(best);
        used.add(best);
        cur = best;
      }
      ri2 = 0;
      prog = 0;
      ship.x = nodes[route[0]].x;
      ship.y = nodes[route[0]].y;
    }

    init();

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        init();
      },
      tap(x, y) {
        nodes.forEach((n) => {
          if (Math.hypot(n.x - x, n.y - y) < 20) {
            n.connected = true;
            playRetroSound('select');
          }
        });
      },
      step(dt) {
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        const a = nodes[route[ri2]];
        const b = nodes[route[(ri2 + 1) % route.length]];

        prog += dt * 0.6 * speedMultiplier;
        if (prog >= 1) {
          prog = 0;
          parts.burst(b.x, b.y, C.sun, 10, 120);
          ri2 = (ri2 + 1) % route.length;
          b.connected = true;
          score += 20;
          playRetroSound('coin');
          if (env.onScoreChange) env.onScoreChange(score);
          if (ri2 === 0) {
            init();
            playRetroSound('win');
          }
        }

        ship.x = lerp(a.x, b.x, prog);
        ship.y = lerp(a.y, b.y, prog);

        parts.step(dt);

        bg(ctx, w, h, '#100d28', '#070418');
        drawStarfield(ctx, field, w, h, env.t, 0);

        ctx.strokeStyle = 'rgba(124,108,255,.4)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < route.length - 1; i++) {
          ctx.beginPath();
          ctx.moveTo(nodes[route[i]].x, nodes[route[i]].y);
          ctx.lineTo(nodes[route[i + 1]].x, nodes[route[i + 1]].y);
          ctx.stroke();
        }

        ctx.strokeStyle = C.sun;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 5]);
        ctx.lineDashOffset = -env.t * 20;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(ship.x, ship.y);
        ctx.stroke();
        ctx.setLineDash([]);

        for (let i = 0; i < nodes.length; i++) {
          const visited = nodes[i].connected;
          ctx.fillStyle = visited ? C.sun : C.moon;
          starPath(ctx, nodes[i].x, nodes[i].y, visited ? 6 : 5, 5, 0.5);
          ctx.fill();
        }

        if (env.pointer.active) {
          ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ship.x, ship.y);
          ctx.lineTo(env.pointer.x, env.pointer.y);
          ctx.stroke();
        }

        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2);
        ctx.fillStyle = C.star;
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(6, 7);
        ctx.lineTo(-6, 7);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        parts.draw(ctx);
      }
    };
  };
}

// 16. PHYSICS DROP
export function PhysicsDrop(): GameFactory {
  return function(ctx, w, h, env) {
    let blocks: Array<{ x: number; y: number; w: number; h: number; vx: number; vy: number; c: string; settled: boolean }> = [];
    let proj: { x: number; y: number; vx: number; vy: number; r: number } | null = null;
    let phase = 0;
    let t = 0;
    const parts = Particles();
    let launchA = 0;
    let launchP = 0;
    let score = 0;

    function init() {
      blocks = [];
      const bx = w * 0.68;
      const by = h - 18;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          blocks.push({
            x: bx + c * 20,
            y: by - 14 - r * 16,
            w: 18,
            h: 14,
            vx: 0,
            vy: 0,
            c: [C.coral, C.sun, C.green][r % 3],
            settled: true
          });
        }
      }
      phase = 0;
      t = 0;
      launchA = rnd(-1.1, -0.7);
      launchP = rnd(220, 320);
      proj = null;
    }

    init();

    return {
      resize(nw, nh) {
        w = nw;
        h = nh;
        init();
      },
      tap(x, y) {
        if (phase === 0) {
          const sx = w * 0.16;
          const sy = h - 26;
          const angle = Math.atan2(y - sy, x - sx);
          const dist = Math.min(100, Math.hypot(x - sx, y - sy));
          proj = {
            x: sx,
            y: sy,
            vx: Math.cos(angle) * dist * 4,
            vy: Math.sin(angle) * dist * 4,
            r: 8
          };
          phase = 1;
          t = 0;
          playRetroSound('laser');
        }
      },
      step(dt) {
        const gravityMultiplier = env.gravitySetting ? env.gravitySetting / 0.6 : 1.0;
        const speedMultiplier = env.speedSetting ? env.speedSetting / 4.0 : 1.0;
        t += dt;

        if (phase === 0) {
          if (!env.pointer.active && t > 0.8) {
            proj = {
              x: w * 0.16,
              y: h - 26,
              vx: Math.cos(launchA) * launchP,
              vy: Math.sin(launchA) * launchP,
              r: 8
            };
            phase = 1;
            t = 0;
            playRetroSound('laser');
          }
        } else if (phase === 1 && proj) {
          proj.vy += 560 * gravityMultiplier * dt * speedMultiplier;
          proj.x += proj.vx * dt * speedMultiplier;
          proj.y += proj.vy * dt * speedMultiplier;

          for (const b of blocks) {
            if (
              proj.x > b.x - proj.r &&
              proj.x < b.x + b.w + proj.r &&
              proj.y > b.y - proj.r &&
              proj.y < b.y + b.h + proj.r
            ) {
              b.settled = false;
              b.vx = proj.vx * 0.02 + rnd(-20, 40);
              b.vy = -rnd(60, 140);
              proj.vx *= 0.4;
              proj.vy *= -0.3;
              parts.burst(proj.x, proj.y, b.c, 8, 110);
              score += 10;
              playRetroSound('hit');
              if (env.onScoreChange) env.onScoreChange(score);
            }
          }

          if (proj.y > h - 12 || proj.x > w + 20) {
            phase = 2;
            t = 0;
          }
        } else if (phase === 2) {
          if (t > 1.4) init();
        }

        for (const b of blocks) {
          if (!b.settled) {
            b.vy += 560 * gravityMultiplier * dt * speedMultiplier;
            b.x += b.vx * dt * speedMultiplier;
            b.y += b.vy * dt * speedMultiplier;
            if (b.y > h - 12 - b.h) {
              b.y = h - 12 - b.h;
              b.vy *= -0.3;
              b.vx *= 0.6;
              if (Math.abs(b.vy) < 20) b.settled = true;
            }
          }
        }

        parts.step(dt);

        bg(ctx, w, h, '#191333', '#100b24');
        ctx.fillStyle = '#2a2350';
        ctx.fillRect(0, h - 12, w, 12);

        ctx.strokeStyle = C.moon;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(w * 0.16, h - 12);
        ctx.lineTo(w * 0.16, h - 30);
        ctx.stroke();

        if (phase === 0) {
          ctx.strokeStyle = C.sun;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          let px = w * 0.16;
          let py = h - 26;
          let vx = env.pointer.active ? (env.pointer.x - px) * 4 : Math.cos(launchA) * launchP;
          let vy = env.pointer.active ? (env.pointer.y - py) * 4 : Math.sin(launchA) * launchP;
          ctx.moveTo(px, py);
          for (let i = 0; i < 18; i++) {
            vy += 560 * gravityMultiplier * 0.04;
            px += vx * 0.04;
            py += vy * 0.04;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        for (const b of blocks) {
          ctx.fillStyle = b.c;
          rr(ctx, b.x, b.y, b.w, b.h, 3);
          ctx.fill();
        }

        if (proj && phase === 1) {
          ctx.fillStyle = C.star;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, proj.r, 0, TAU);
          ctx.fill();
        }

        parts.draw(ctx);
      }
    };
  };
}

// Map Dashboard Portfolio IDs to Factories
export function getGameEngine(id: string): GameFactory | null {
  switch (id) {
    case "star_catcher":
      return StarCatcher();
    case "astro_blaster":
      return AstroBlaster();
    case "neon_breaker":
      return BrickBreaker();
    case "snake_lua":
      return Snake();
    case "tap_hopper":
      return TapHopper();
    case "pixel_sprint":
      return Platformer();
    case "gem_cascade":
      return GemMatch();
    case "bubble_burst":
      return BubblePop();
    case "tower_siege":
      return TowerSiege();
    case "maze_muncher":
      return MazeRunner();
    case "sky_racer":
      return SkyRacer();
    case "lua_lander":
      return Lander();
    case "card_clash":
      return CardClash();
    case "whack_critter":
      return Whack();
    case "star_forge":
      return StarForge();
    case "block_drop":
      return PhysicsDrop();
    default:
      return null;
  }
}

// Mount and Game Loop Harness supporting Double-Buffered Rendering
export function mount(
  canvas: HTMLCanvasElement,
  factory: GameFactory,
  envOverride: Partial<GameEnv> = {},
  onScoreUpdate?: (score: number) => void
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Offscreen double-buffered canvases
  const bufferCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  const bufferCtx = bufferCanvas ? bufferCanvas.getContext('2d') : null;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let built: GameEngine | null = null;
  
  const env: GameEnv = {
    t: 0,
    pointer: { x: 0, y: 0, down: false, active: false, lastT: -99 },
    ...envOverride,
    onScoreChange: (score) => {
      if (onScoreUpdate) onScoreUpdate(score);
      if (envOverride.onScoreChange) envOverride.onScoreChange(score);
    }
  };

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    
    if (bufferCanvas && bufferCtx) {
      bufferCanvas.width = Math.round(w * dpr);
      bufferCanvas.height = Math.round(h * dpr);
      bufferCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    
    if (built && built.resize) built.resize(w, h);
  }

  function ensure() {
    if (!built) {
      size();
      built = factory(bufferCtx || ctx!, w, h, env);
      if (!w || !h) size();
    }
  }

  function pt(e: MouseEvent | TouchEvent) {
    const r = canvas.getBoundingClientRect();
    const isTouch = 'touches' in e && e.touches.length > 0;
    const clientX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    
    const cx = ((clientX - r.left) / r.width) * w;
    const cy = ((clientY - r.top) / r.height) * h;
    env.pointer.x = cx;
    env.pointer.y = cy;
    env.pointer.active = true;
    env.pointer.lastT = env.t;
  }

  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    pt(e);
  };

  const handlePointerDown = (e: MouseEvent | TouchEvent) => {
    pt(e);
    env.pointer.down = true;
    if (built && built.tap) {
      built.tap(env.pointer.x, env.pointer.y);
    }
  };

  const handlePointerUp = () => {
    env.pointer.down = false;
  };

  const handlePointerLeave = () => {
    env.pointer.active = false;
  };

  canvas.addEventListener('mousemove', handlePointerMove as any);
  canvas.addEventListener('mousedown', handlePointerDown as any);
  window.addEventListener('mouseup', handlePointerUp);
  canvas.addEventListener('mouseleave', handlePointerLeave);
  canvas.addEventListener('touchmove', handlePointerMove as any, { passive: true });
  canvas.addEventListener('touchstart', handlePointerDown as any, { passive: true });
  window.addEventListener('touchend', handlePointerUp);

  ensure();

  return {
    render(dt: number) {
      ensure();
      
      if (envOverride.speedSetting) env.speedSetting = envOverride.speedSetting;
      if (envOverride.gravitySetting) env.gravitySetting = envOverride.gravitySetting;
      if (envOverride.customGrid) env.customGrid = envOverride.customGrid;

      if (env.pointer.active && env.t - env.pointer.lastT > 2.6) {
        env.pointer.active = false;
      }
      env.t += dt;
      try {
        if (built) built.step(dt, w, h);
        
        // Copy buffer offscreen onto visible screen (Double-Buffering Blit)
        if (bufferCanvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(bufferCanvas, 0, 0);
        }
      } catch (err) {
        // Suppress errors
      }
    },
    resize() {
      size();
    },
    destroy() {
      canvas.removeEventListener('mousemove', handlePointerMove as any);
      canvas.removeEventListener('mousedown', handlePointerDown as any);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('mouseleave', handlePointerLeave);
      canvas.removeEventListener('touchmove', handlePointerMove as any);
      canvas.removeEventListener('touchstart', handlePointerDown as any);
      window.removeEventListener('touchend', handlePointerUp);
    }
  };
}
