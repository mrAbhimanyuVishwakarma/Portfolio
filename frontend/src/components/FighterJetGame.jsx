import { useEffect, useRef, useState } from 'react';
import './FighterJetGame.css';

/**
 * Fighter Jet Arcade Shooter Game
 * Inspired by Moo ICT Jet Fighter Windows Form tutorial, enhanced for modern Web Canvas 2D.
 * Features:
 * - Keyboard (WASD / Arrows + Space), Mouse Follow / Click, and Touch Drag controls
 * - Web Audio API synthesized retro sound effects (no external audio files needed)
 * - Multiple enemy aircraft types (Scouts, Interceptors, Heavy Bombers, and Bosses)
 * - Weapon upgrades (Dual Plasma, Triple Spread, Rapid Fire) & Shield power-ups
 * - Particle explosion engine, thruster exhaust, and scrolling starfield clouds
 * - High score persistence in localStorage
 */

const FighterJetGame = ({ onBackToFootball }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // React UI State
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('sky_strike_highscore') || '0', 10);
  });
  const [health, setHealth] = useState(100);
  const [wave, setWave] = useState(1);
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'paused' | 'gameover'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio Context Ref
  const audioCtxRef = useRef(null);

  // Synthesized Sound FX generator via Web Audio API
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'laser') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'explosion') {
        // White noise burst for explosions
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + 0.25);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.26);
      } else if (type === 'powerup') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(960, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
      } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      }
    } catch {
      // ignore
    }
  };

  // Game Engine Refs
  const gameRef = useRef({
    score: 0,
    health: 100,
    wave: 1,
    gameState: 'playing',
    keys: { left: false, right: false, up: false, down: false, shoot: false },
    touchTarget: null,
    player: {
      x: 350,
      y: 540,
      width: 48,
      height: 54,
      speed: 7,
      weaponLevel: 1,
      lastShootTime: 0,
      shootInterval: 180,
      shieldTime: 0,
      invulnerableTime: 0
    },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    boss: null,
    particles: [],
    stars: [],
    powerups: [],
    floatingTexts: [],
    lastEnemySpawnTime: 0,
    screenShake: 0,
    lastFrameTime: 0
  });

  // Keep state sync for audio or UI
  useEffect(() => {
    gameRef.current.gameState = gameState;
  }, [gameState]);

  // Restart / Reset Game function
  const handleResetGame = () => {
    const g = gameRef.current;
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 700;
    const height = canvas ? canvas.height : 680;

    g.score = 0;
    g.health = 100;
    g.wave = 1;
    g.gameState = 'playing';
    g.bullets = [];
    g.enemyBullets = [];
    g.enemies = [];
    g.boss = null;
    g.particles = [];
    g.powerups = [];
    g.floatingTexts = [];
    g.screenShake = 0;
    g.player.x = width / 2;
    g.player.y = height - 100;
    g.player.weaponLevel = 1;
    g.player.shieldTime = 0;
    g.player.invulnerableTime = 60;
    g.lastFrameTime = performance.now();

    setScore(0);
    setHealth(100);
    setWave(1);
    setGameState('playing');
  };

  // Initialize stars and main canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;

    // Responsive Canvas Resize
    const updateCanvasSize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Reposition player if out of bounds
      const g = gameRef.current;
      g.player.x = Math.min(g.player.x, rect.width - 30);
      g.player.y = Math.min(g.player.y, rect.height - 60);

      // Initialize stars on first resize
      if (g.stars.length === 0) {
        for (let i = 0; i < 70; i++) {
          g.stars.push({
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            size: Math.random() * 2 + 0.8,
            speed: Math.random() * 2.5 + 0.8,
            alpha: Math.random() * 0.7 + 0.3
          });
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // ==========================================
    // KEYBOARD INPUT LISTENERS
    // ==========================================
    const handleKeyDown = (e) => {
      const g = gameRef.current;
      // Prevent browser from scrolling the webpage with arrows or spacebar
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') g.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') g.keys.right = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') g.keys.up = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') g.keys.down = true;
      if (e.code === 'Space' || e.code === 'KeyK') g.keys.shoot = true;
      if (e.code === 'KeyP') {
        setGameState(prev => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };

    const handleKeyUp = (e) => {
      const g = gameRef.current;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') g.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') g.keys.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') g.keys.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') g.keys.down = false;
      if (e.code === 'Space' || e.code === 'KeyK') g.keys.shoot = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // ==========================================
    // MOUSE & TOUCH DRAG LISTENERS
    // ==========================================
    const handlePointerDown = (e) => {
      const g = gameRef.current;
      if (g.gameState !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      g.touchTarget = { x, y };
      g.keys.shoot = true;
    };

    const handlePointerMove = (e) => {
      const g = gameRef.current;
      if (!g.touchTarget) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      g.touchTarget = { x, y };
    };

    const handlePointerUp = () => {
      const g = gameRef.current;
      g.touchTarget = null;
      g.keys.shoot = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // ==========================================
    // SPAWN LOGIC
    // ==========================================
    const spawnEnemy = (now, width) => {
      const g = gameRef.current;
      const spawnInterval = Math.max(700, 1500 - g.wave * 120);

      if (now - g.lastEnemySpawnTime > spawnInterval) {
        g.lastEnemySpawnTime = now;
        const types = ['scout', 'scout', 'interceptor', 'bomber'];
        const type = types[Math.floor(Math.random() * types.length)];

        let speed = 2.2 + Math.random() * 1.8 + g.wave * 0.2;
        let hp = 1;
        let widthEnemy = 38;
        let heightEnemy = 42;
        let color = '#ef4444';

        if (type === 'interceptor') {
          speed = 3.2 + Math.random() * 1.5;
          hp = 2;
          widthEnemy = 42;
          heightEnemy = 44;
          color = '#f97316';
        } else if (type === 'bomber') {
          speed = 1.6 + Math.random() * 0.8;
          hp = 4;
          widthEnemy = 52;
          heightEnemy = 50;
          color = '#a855f7';
        }

        g.enemies.push({
          x: 40 + Math.random() * (width - 80),
          y: -60,
          vx: (Math.random() - 0.5) * 1.5,
          vy: speed,
          type,
          hp,
          maxHp: hp,
          width: widthEnemy,
          height: heightEnemy,
          color,
          lastShootTime: now + Math.random() * 1000
        });
      }

      // Boss Spawn every 18 kills / score milestones
      if (!g.boss && g.score > 0 && g.score % 20 === 0 && g.score / 20 === g.wave) {
        g.boss = {
          x: width / 2,
          y: -120,
          targetY: 110,
          width: 130,
          height: 90,
          hp: 35 + g.wave * 15,
          maxHp: 35 + g.wave * 15,
          vx: 2.2,
          lastShootTime: now + 500,
          color: '#ec4899'
        };
        g.wave += 1;
        setWave(g.wave);
        g.floatingTexts.push({
          x: width / 2,
          y: 200,
          text: `⚠️ WARNING: BOSS INCOMING ⚠️`,
          color: '#ff0055',
          size: 20,
          alpha: 1,
          life: 90
        });
        playSound('hit');
      }
    };

    // ==========================================
    // MAIN GAME LOOP (DELTA-TIME PHYSICS)
    // ==========================================
    const loop = (currentTime) => {
      animId = requestAnimationFrame(loop);
      const g = gameRef.current;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const deltaMs = currentTime - g.lastFrameTime;
      g.lastFrameTime = currentTime;
      const dt = Math.min(Math.max(deltaMs / 16.667, 0.2), 2.0);

      // Handle Screen Shake
      ctx.save();
      if (g.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * g.screenShake;
        const shakeY = (Math.random() - 0.5) * g.screenShake;
        ctx.translate(shakeX, shakeY);
        g.screenShake = Math.max(0, g.screenShake - 0.5 * dt);
      }

      // Background Clear
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, width, height);

      // Starfield rendering with parallax
      ctx.fillStyle = '#ffffff';
      for (let s of g.stars) {
        if (g.gameState === 'playing') {
          s.y += s.speed * dt;
          if (s.y > height) {
            s.y = 0;
            s.x = Math.random() * width;
          }
        }
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Paused State overlay
      if (g.gameState === 'paused') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px "DM Serif Display", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME PAUSED', width / 2, height / 2 - 10);
        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('Press "P" or Click Pause to Resume', width / 2, height / 2 + 25);
        ctx.restore();
        return;
      }

      // ==========================================
      // UPDATE & RENDER PLAYER
      // ==========================================
      const p = g.player;

      if (g.gameState === 'playing') {
        // Keyboard movement
        if (g.keys.left) p.x -= p.speed * dt;
        if (g.keys.right) p.x += p.speed * dt;
        if (g.keys.up) p.y -= p.speed * dt;
        if (g.keys.down) p.y += p.speed * dt;

        // Pointer / Touch smoothing
        if (g.touchTarget) {
          const dx = g.touchTarget.x - p.x;
          const dy = (g.touchTarget.y - 45) - p.y;
          p.x += dx * 0.18 * dt;
          p.y += dy * 0.18 * dt;
        }

        // Boundary Clamp
        p.x = Math.max(p.width / 2, Math.min(width - p.width / 2, p.x));
        p.y = Math.max(p.height / 2 + 60, Math.min(height - p.height / 2, p.y));

        if (p.shieldTime > 0) p.shieldTime -= dt;
        if (p.invulnerableTime > 0) p.invulnerableTime -= dt;

        // Player shooting
        if (g.keys.shoot && currentTime - p.lastShootTime > p.shootInterval) {
          p.lastShootTime = currentTime;
          playSound('laser');

          if (p.weaponLevel === 1) {
            // Single Cannon
            g.bullets.push({ x: p.x, y: p.y - 25, vx: 0, vy: -12, color: '#00e5ff' });
          } else if (p.weaponLevel === 2) {
            // Dual Cannon
            g.bullets.push({ x: p.x - 12, y: p.y - 22, vx: 0, vy: -13, color: '#00e5ff' });
            g.bullets.push({ x: p.x + 12, y: p.y - 22, vx: 0, vy: -13, color: '#00e5ff' });
          } else {
            // Triple Spread Plasma
            g.bullets.push({ x: p.x, y: p.y - 25, vx: 0, vy: -14, color: '#ffea00' });
            g.bullets.push({ x: p.x - 14, y: p.y - 20, vx: -2.5, vy: -13.5, color: '#00e5ff' });
            g.bullets.push({ x: p.x + 14, y: p.y - 20, vx: 2.5, vy: -13.5, color: '#00e5ff' });
          }

          // Thruster back-pulse
          for (let i = 0; i < 2; i++) {
            g.particles.push({
              x: p.x + (Math.random() - 0.5) * 8,
              y: p.y + 25,
              vx: (Math.random() - 0.5) * 1.5,
              vy: Math.random() * 3 + 4,
              color: '#38bdf8',
              size: Math.random() * 4 + 2,
              alpha: 1,
              life: 18
            });
          }
        }

        // Spawn thruster flame particles
        if (Math.random() < 0.8) {
          g.particles.push({
            x: p.x + (Math.random() - 0.5) * 10,
            y: p.y + 24,
            vx: (Math.random() - 0.5) * 1.2,
            vy: Math.random() * 3 + 3,
            color: Math.random() > 0.5 ? '#00e5ff' : '#3b82f6',
            size: Math.random() * 3 + 2,
            alpha: 0.9,
            life: 14
          });
        }
      }

      // Draw Player Fighter Jet
      if (p.invulnerableTime <= 0 || Math.floor(currentTime / 80) % 2 === 0) {
        ctx.save();
        ctx.translate(p.x, p.y);

        // Fighter Jet Wings & Body (Stylized Vector Supersonic Fighter)
        // Main Fuselage Glow
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 15;

        // Wings
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(24, 18);
        ctx.lineTo(8, 20);
        ctx.lineTo(0, 26);
        ctx.lineTo(-8, 20);
        ctx.lineTo(-24, 18);
        ctx.closePath();
        ctx.fill();

        // Upper canopy & fuselage
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(0, -32);
        ctx.lineTo(9, 8);
        ctx.lineTo(0, 18);
        ctx.lineTo(-9, 8);
        ctx.closePath();
        ctx.fill();

        // Cockpit Glass
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.ellipse(0, -6, 4.5, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dual Engine Thrusters
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-8, 18, 4, 6);
        ctx.fillRect(4, 18, 4, 6);

        // Energy Shield Ring
        if (p.shieldTime > 0) {
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 3;
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(0, 0, 36, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      // ==========================================
      // BULLETS UPDATE & DRAW
      // ==========================================
      for (let i = g.bullets.length - 1; i >= 0; i--) {
        const b = g.bullets[i];
        if (g.gameState === 'playing') {
          b.x += b.vx * dt;
          b.y += b.vy * dt;
        }

        // Render Bullet
        ctx.save();
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, 3, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Out of bounds
        if (b.y < -30) {
          g.bullets.splice(i, 1);
        }
      }

      // ==========================================
      // ENEMY BULLETS UPDATE & DRAW
      // ==========================================
      for (let i = g.enemyBullets.length - 1; i >= 0; i--) {
        const eb = g.enemyBullets[i];
        if (g.gameState === 'playing') {
          eb.x += eb.vx * dt;
          eb.y += eb.vy * dt;
        }

        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(eb.x, eb.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Collision with Player
        if (g.gameState === 'playing') {
          const distToPlayer = Math.hypot(eb.x - p.x, eb.y - p.y);
          if (distToPlayer < 24) {
            g.enemyBullets.splice(i, 1);
            if (p.shieldTime > 0) {
              p.shieldTime = 0;
              playSound('hit');
            } else if (p.invulnerableTime <= 0) {
              g.health = Math.max(0, g.health - 15);
              setHealth(g.health);
              g.screenShake = 12;
              p.invulnerableTime = 40;
              playSound('hit');

              if (g.health <= 0) {
                g.gameState = 'gameover';
                setGameState('gameover');
                playSound('explosion');
              }
            }
            continue;
          }
        }

        if (eb.y > height + 30) {
          g.enemyBullets.splice(i, 1);
        }
      }

      // ==========================================
      // SPAWN & UPDATE ENEMIES
      // ==========================================
      if (g.gameState === 'playing') {
        spawnEnemy(currentTime, width);
      }

      for (let i = g.enemies.length - 1; i >= 0; i--) {
        const en = g.enemies[i];
        if (g.gameState === 'playing') {
          en.x += en.vx * dt;
          en.y += en.vy * dt;

          // Enemy shooting (Interceptors & Bombers)
          if ((en.type === 'interceptor' || en.type === 'bomber') && currentTime - en.lastShootTime > 1800) {
            en.lastShootTime = currentTime + Math.random() * 600;
            g.enemyBullets.push({
              x: en.x,
              y: en.y + en.height / 2,
              vx: (p.x - en.x) * 0.015,
              vy: 5.5
            });
          }
        }

        // Draw Enemy
        ctx.save();
        ctx.translate(en.x, en.y);
        ctx.shadowColor = en.color;
        ctx.shadowBlur = 10;

        ctx.fillStyle = en.color;
        ctx.beginPath();
        ctx.moveTo(0, en.height / 2);
        ctx.lineTo(en.width / 2, -en.height / 2);
        ctx.lineTo(0, -en.height / 2 + 10);
        ctx.lineTo(-en.width / 2, -en.height / 2);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#fee2e2';
        ctx.beginPath();
        ctx.ellipse(0, 2, 3, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Collision: Player Bullets hitting Enemy
        if (g.gameState === 'playing') {
          for (let j = g.bullets.length - 1; j >= 0; j--) {
            const b = g.bullets[j];
            const dist = Math.hypot(b.x - en.x, b.y - en.y);

            if (dist < (en.width + en.height) / 3.5) {
              en.hp -= 1;
              g.bullets.splice(j, 1);

              // Bullet spark particle
              for (let k = 0; k < 4; k++) {
                g.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  color: '#fbbf24',
                  size: Math.random() * 3 + 1,
                  alpha: 1,
                  life: 12
                });
              }

              if (en.hp <= 0) {
                // Destroyed Enemy
                playSound('explosion');
                const points = en.type === 'bomber' ? 300 : en.type === 'interceptor' ? 200 : 100;
                g.score += points;
                setScore(g.score);

                // High score update
                if (g.score > highScore) {
                  setHighScore(g.score);
                  localStorage.setItem('sky_strike_highscore', g.score.toString());
                }

                // Floating score text
                g.floatingTexts.push({
                  x: en.x,
                  y: en.y,
                  text: `+${points}`,
                  color: '#facc15',
                  size: 15,
                  alpha: 1,
                  life: 40
                });

                // Spawn big explosion particles
                for (let k = 0; k < 18; k++) {
                  g.particles.push({
                    x: en.x,
                    y: en.y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    color: Math.random() > 0.4 ? '#ef4444' : '#f97316',
                    size: Math.random() * 5 + 3,
                    alpha: 1,
                    life: 25
                  });
                }

                // Chance to drop power-up
                if (Math.random() < 0.22) {
                  const powerTypes = ['weapon', 'shield', 'health'];
                  g.powerups.push({
                    x: en.x,
                    y: en.y,
                    type: powerTypes[Math.floor(Math.random() * powerTypes.length)],
                    vy: 1.8
                  });
                }

                g.enemies.splice(i, 1);
                break;
              }
            }
          }
        }

        // Collision: Enemy crashing into Player
        if (g.gameState === 'playing') {
          const distToPlayer = Math.hypot(en.x - p.x, en.y - p.y);
          if (distToPlayer < 36) {
            g.enemies.splice(i, 1);
            if (p.shieldTime > 0) {
              p.shieldTime = 0;
              playSound('hit');
            } else if (p.invulnerableTime <= 0) {
              g.health = Math.max(0, g.health - 30);
              setHealth(g.health);
              g.screenShake = 16;
              p.invulnerableTime = 40;
              playSound('explosion');

              if (g.health <= 0) {
                g.gameState = 'gameover';
                setGameState('gameover');
              }
            }
            continue;
          }
        }

        // Offscreen check
        if (en.y > height + 50) {
          g.enemies.splice(i, 1);
        }
      }

      // ==========================================
      // BOSS BATTLE LOGIC
      // ==========================================
      if (g.boss) {
        const b = g.boss;
        if (g.gameState === 'playing') {
          // Slide in to position
          if (b.y < b.targetY) {
            b.y += 1.5 * dt;
          } else {
            b.x += b.vx * dt;
            if (b.x < 100 || b.x > width - 100) {
              b.vx = -b.vx;
            }

            // Boss firing barrage
            if (currentTime - b.lastShootTime > 1200) {
              b.lastShootTime = currentTime;
              for (let angle = -0.4; angle <= 0.4; angle += 0.2) {
                g.enemyBullets.push({
                  x: b.x,
                  y: b.y + 40,
                  vx: Math.sin(angle) * 4.5,
                  vy: Math.cos(angle) * 4.5
                });
              }
            }
          }
        }

        // Draw Boss
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 20;

        ctx.fillStyle = '#831843';
        ctx.beginPath();
        ctx.moveTo(0, 45);
        ctx.lineTo(b.width / 2, -20);
        ctx.lineTo(b.width / 4, -45);
        ctx.lineTo(-b.width / 4, -45);
        ctx.lineTo(-b.width / 2, -20);
        ctx.closePath();
        ctx.fill();

        // Boss Armor Core
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(-20, -10, 40, 20);

        ctx.restore();

        // Boss Health Bar above Boss
        ctx.save();
        const barW = 120;
        const barH = 7;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(b.x - barW / 2, b.y - 60, barW, barH);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(b.x - barW / 2, b.y - 60, barW * (b.hp / b.maxHp), barH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x - barW / 2, b.y - 60, barW, barH);
        ctx.restore();

        // Player Bullets hitting Boss
        if (g.gameState === 'playing') {
          for (let j = g.bullets.length - 1; j >= 0; j--) {
            const blt = g.bullets[j];
            if (Math.hypot(blt.x - b.x, blt.y - b.y) < 55) {
              b.hp -= 1;
              g.bullets.splice(j, 1);

              if (b.hp <= 0) {
                // Boss Destroyed!
                playSound('explosion');
                g.score += 1500;
                setScore(g.score);
                g.screenShake = 22;

                g.floatingTexts.push({
                  x: b.x,
                  y: b.y,
                  text: `BOSS DEFEATED! +1500`,
                  color: '#22c55e',
                  size: 20,
                  alpha: 1,
                  life: 60
                });

                // Huge explosion
                for (let k = 0; k < 50; k++) {
                  g.particles.push({
                    x: b.x + (Math.random() - 0.5) * 70,
                    y: b.y + (Math.random() - 0.5) * 50,
                    vx: (Math.random() - 0.5) * 12,
                    vy: (Math.random() - 0.5) * 12,
                    color: Math.random() > 0.5 ? '#f43f5e' : '#fbbf24',
                    size: Math.random() * 7 + 4,
                    alpha: 1,
                    life: 35
                  });
                }

                // Drop multiple powerups
                g.powerups.push({ x: b.x - 30, y: b.y, type: 'weapon', vy: 2 });
                g.powerups.push({ x: b.x + 30, y: b.y, type: 'shield', vy: 2 });

                g.boss = null;
                break;
              }
            }
          }
        }
      }

      // ==========================================
      // POWER-UPS UPDATE & DRAW
      // ==========================================
      for (let i = g.powerups.length - 1; i >= 0; i--) {
        const pw = g.powerups[i];
        if (g.gameState === 'playing') {
          pw.y += pw.vy * dt;
        }

        ctx.save();
        ctx.translate(pw.x, pw.y);
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fillStyle = pw.type === 'weapon' ? '#f59e0b' : pw.type === 'shield' ? '#06b6d4' : '#10b981';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pw.type === 'weapon' ? 'W' : pw.type === 'shield' ? 'S' : '+', 0, 0);
        ctx.restore();

        // Collect Power-up
        if (g.gameState === 'playing') {
          if (Math.hypot(pw.x - p.x, pw.y - p.y) < 32) {
            playSound('powerup');
            if (pw.type === 'weapon') {
              p.weaponLevel = Math.min(3, p.weaponLevel + 1);
              g.floatingTexts.push({ x: p.x, y: p.y - 30, text: 'WEAPON UPGRADE!', color: '#f59e0b', size: 14, alpha: 1, life: 35 });
            } else if (pw.type === 'shield') {
              p.shieldTime = 400; // ~6.5 seconds
              g.floatingTexts.push({ x: p.x, y: p.y - 30, text: 'ENERGY SHIELD ON!', color: '#06b6d4', size: 14, alpha: 1, life: 35 });
            } else {
              g.health = Math.min(100, g.health + 30);
              setHealth(g.health);
              g.floatingTexts.push({ x: p.x, y: p.y - 30, text: '+30 HULL INTEGRITY', color: '#10b981', size: 14, alpha: 1, life: 35 });
            }
            g.powerups.splice(i, 1);
            continue;
          }
        }

        if (pw.y > height + 30) {
          g.powerups.splice(i, 1);
        }
      }

      // ==========================================
      // PARTICLES UPDATE & DRAW
      // ==========================================
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        pt.alpha = pt.life / 25;

        if (pt.life <= 0) {
          g.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ==========================================
      // FLOATING TEXTS UPDATE & DRAW
      // ==========================================
      for (let i = g.floatingTexts.length - 1; i >= 0; i--) {
        const ft = g.floatingTexts[i];
        ft.y -= 0.8 * dt;
        ft.life -= dt;
        ft.alpha = ft.life / 40;

        if (ft.life <= 0) {
          g.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = `bold ${ft.size}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 8;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="jet-game-wrapper" ref={containerRef}>
      {/* Top HUD Overlay inside the Arena */}
      <div className="jet-hud-overlay">
        <div className="jet-hud-stats">
          <div className="hud-metric">
            <span className="metric-label">SCORE</span>
            <span className="metric-value">{score}</span>
          </div>
          <div className="hud-metric">
            <span className="metric-label">BEST</span>
            <span className="metric-value gold">{highScore}</span>
          </div>
          <div className="hud-metric">
            <span className="metric-label">SECTOR</span>
            <span className="metric-value">WAVE {wave}</span>
          </div>
        </div>

        <div className="jet-hud-health">
          <div className="health-bar-container">
            <span className="health-label">HULL INTEGRITY</span>
            <div className="health-bar-track">
              <div 
                className="health-bar-fill"
                style={{ 
                  width: `${health}%`,
                  background: health > 50 ? '#10b981' : health > 25 ? '#f59e0b' : '#ef4444' 
                }}
              />
            </div>
          </div>

          <div className="jet-audio-toggle">
            <button
              type="button"
              className="jet-btn-icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              type="button"
              className="jet-btn-icon"
              onClick={() => setGameState(prev => (prev === 'playing' ? 'paused' : 'playing'))}
              title={gameState === 'playing' ? 'Pause Game' : 'Resume Game'}
            >
              {gameState === 'playing' ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>
      </div>

      {/* Primary 2D Canvas */}
      <canvas 
        ref={canvasRef} 
        className="jet-canvas"
        style={{ touchAction: 'none' }}
      />

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="jet-gameover-overlay">
          <div className="jet-gameover-card">
            <div className="gameover-badge">MISSION FAILED</div>
            <h2 className="gameover-title">Fighter Down!</h2>
            <p className="gameover-desc">
              Your jet fighter was shot down in aerial combat.
            </p>

            <div className="gameover-stats-grid">
              <div className="gameover-stat-item">
                <span className="stat-item-label">Final Score</span>
                <span className="stat-item-val">{score}</span>
              </div>
              <div className="gameover-stat-item">
                <span className="stat-item-label">High Score</span>
                <span className="stat-item-val gold">{highScore}</span>
              </div>
              <div className="gameover-stat-item">
                <span className="stat-item-label">Sectors Cleared</span>
                <span className="stat-item-val">{wave - 1}</span>
              </div>
            </div>

            <div className="gameover-actions">
              <button 
                type="button" 
                className="jet-btn-action jet-btn-primary"
                onClick={handleResetGame}
              >
                🚀 Deploy Again
              </button>
              {onBackToFootball && (
                <button 
                  type="button" 
                  className="jet-btn-action"
                  onClick={onBackToFootball}
                >
                  ⚽ Back to Football
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls Help Pill */}
      <div className="jet-bottom-help">
        <span>🎮 <strong>Controls:</strong> WASD / Arrow Keys or Mouse/Touch Drag to Fly | Spacebar / Click to Fire | P to Pause</span>
      </div>
    </div>
  );
};

export default FighterJetGame;
