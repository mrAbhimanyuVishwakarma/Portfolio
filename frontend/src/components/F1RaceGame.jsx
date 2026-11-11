import { useEffect, useRef, useState } from 'react';
import './F1RaceGame.css';

/**
 * Super Star Car - F1 Grand Prix 3D Arcade Racing Game
 * Inspired by Poki's "Super Star Car" & classic 3D arcade racers (OutRun / Pole Position).
 * Features:
 * - 3D Perspective Road Projection with hills, curves, kerbs, and roadside scenery
 * - Multiple AI F1 rival cars to battle and overtake for position (P8 to P1)
 * - Nitro / DRS Boost system with exhaust flames and speed streaks
 * - Real-time synthesized F1 V10 engine audio (revs pitch with speed & braking)
 * - Skid marks, tire smoke, collision sparks, and camera shake
 * - Speedometer, RPM tachometer, Lap timer, and podium finish celebrations
 * - Responsive desktop (WASD/Arrows + Space) and mobile touch controls
 */

const ROAD_WIDTH = 2000;
const SEGMENT_LENGTH = 200;
const RUMBLE_LENGTH = 3;
const CAMERA_DEPTH = 0.84;
const DRAW_DISTANCE = 300;
const TOTAL_LAPS = 3;

// Rival teams and liveries
const RIVALS_CONFIG = [
  { name: 'Red Stallion', color: '#dc2626', wingColor: '#000000', baseSpeed: 230 },
  { name: 'Silver Arrow', color: '#94a3b8', wingColor: '#06b6d4', baseSpeed: 236 },
  { name: 'Papaya Strike', color: '#f97316', wingColor: '#3b82f6', baseSpeed: 228 },
  { name: 'Bull Energy', color: '#1e3a8a', wingColor: '#fbbf24', baseSpeed: 238 },
  { name: 'Alpine Green', color: '#059669', wingColor: '#10b981', baseSpeed: 226 },
  { name: 'Neon Apex', color: '#8b5cf6', wingColor: '#00e5ff', baseSpeed: 232 },
  { name: 'Alpha Ghost', color: '#ffffff', wingColor: '#000000', baseSpeed: 224 }
];

const F1RaceGame = ({ onBackToMenu }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const engineSoundRef = useRef(null);

  // HUD State
  const [speedKmh, setSpeedKmh] = useState(0);
  const [position, setPosition] = useState(8);
  const [lap, setLap] = useState(1);
  const [lapTime, setLapTime] = useState(0);
  const [bestLapTime, setBestLapTime] = useState(() => {
    return parseFloat(localStorage.getItem('f1_best_lap') || '0');
  });
  const [nitro, setNitro] = useState(100);
  const [isBoosting, setIsBoosting] = useState(false);
  const [raceState, setRaceState] = useState('racing'); // 'racing' | 'finished' | 'paused'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Synthesizer for F1 V10 Engine & FX
  const initAudio = () => {
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

      if (!engineSoundRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        engineSoundRef.current = { osc, gain, filter };
      }
    } catch {
      // ignore
    }
  };

  const updateEngineAudio = (speedPercent, boosting) => {
    if (!engineSoundRef.current || !soundEnabled) return;
    try {
      const { osc, gain, filter } = engineSoundRef.current;
      const ctx = audioCtxRef.current;
      const targetFreq = 75 + speedPercent * 340 + (boosting ? 110 : 0);
      osc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.08);

      const targetGain = 0.02 + speedPercent * 0.07 + (boosting ? 0.03 : 0);
      gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.08);

      const targetFilter = 400 + speedPercent * 1600;
      filter.frequency.setTargetAtTime(targetFilter, ctx.currentTime, 0.08);
    } catch {
      // ignore
    }
  };

  const playEffect = (type) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'crash') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      } else if (type === 'boost') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.4);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.42);
      } else if (type === 'chequered') {
        // Chequered fanfare
        [440, 554, 659, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.2, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.36);
        });
      }
    } catch {
      // ignore
    }
  };

  // Game Engine State Refs
  const gameRef = useRef({
    keys: { left: false, right: false, up: false, down: false, boost: false },
    touchSteer: 0,
    touchGas: false,
    touchBrake: false,
    position: 0, // track distance along circuit
    playerX: 0, // lateral offset (-1 to 1 is road, outside is grass)
    speed: 0,
    maxSpeed: 250,
    maxBoostSpeed: 325,
    accel: 52,
    decel: -65,
    braking: -160,
    offRoadDecel: -120,
    nitro: 100,
    isBoosting: false,
    lap: 1,
    lapStartTime: 0,
    skidmarks: [],
    particles: [],
    rivals: [],
    trackSegments: [],
    trackLength: 0,
    screenShake: 0,
    lastFrameTime: 0,
    raceFinished: false,
    finalPosition: 8
  });

  // Build Procedural Grand Prix Circuit (Turns, Hills, Straightaways, Chicane)
  const buildTrack = () => {
    const segments = [];

    const addRoad = (enter, hold, leave, curve, y) => {
      const startY = segments.length > 0 ? segments[segments.length - 1].p2.world.y : 0;
      const endY = startY + y * SEGMENT_LENGTH;
      const total = enter + hold + leave;

      for (let n = 0; n < total; n++) {
        const ease = n < enter ? n / enter : n >= enter + hold ? 1 - (n - enter - hold) / leave : 1;
        const curveVal = curve * ease;
        const yVal = startY + (endY - startY) * (n / total);

        segments.push({
          index: segments.length,
          p1: { world: { y: yVal, z: segments.length * SEGMENT_LENGTH }, camera: {}, screen: {} },
          p2: { world: { y: yVal, z: (segments.length + 1) * SEGMENT_LENGTH }, camera: {}, screen: {} },
          curve: curveVal,
          color: Math.floor(segments.length / RUMBLE_LENGTH) % 2 === 0
            ? { road: '#1e293b', grass: '#064e3b', rumble: '#ef4444', lane: '#ffffff' }
            : { road: '#334155', grass: '#047857', rumble: '#ffffff', lane: '#334155' }
        });
      }
    };

    // Track Geometry Blueprint
    addRoad(40, 80, 40, 0, 0);       // Start / Finish Grandstand Straightaway
    addRoad(30, 50, 30, 3.5, 20);     // Turn 1: High-speed Right Sweeper uphill
    addRoad(25, 40, 25, -4.2, -15);   // Turn 2: Sharp Left Hairpin downhill
    addRoad(30, 70, 30, 0, 0);       // DRS Back Straightaway
    addRoad(20, 35, 20, 5.0, 10);     // Chicane Entry Right
    addRoad(20, 35, 20, -5.0, -10);   // Chicane Exit Left
    addRoad(40, 90, 40, 0, 0);       // Riverside Straight
    addRoad(30, 60, 30, -3.8, 25);    // Final Sector Banked Curve into Home Straight
    addRoad(20, 40, 20, 0, -20);      // Drop back to starting grid

    // Mark Finish Line on the first 4 segments
    for (let i = 0; i < 4; i++) {
      if (segments[i]) {
        segments[i].color.road = '#ffffff';
        segments[i].color.lane = '#000000';
        segments[i].isFinishLine = true;
      }
    }

    return segments;
  };

  // Reset / Restart Race
  const handleRestartRace = () => {
    const g = gameRef.current;
    g.position = 0;
    g.playerX = 0;
    g.speed = 0;
    g.nitro = 100;
    g.isBoosting = false;
    g.lap = 1;
    g.lapStartTime = performance.now();
    g.raceFinished = false;
    g.skidmarks = [];
    g.particles = [];
    g.screenShake = 0;

    // Reset rivals placed ahead of player on the starting grid
    g.rivals = RIVALS_CONFIG.map((conf, index) => ({
      ...conf,
      x: (index % 2 === 0 ? -0.45 : 0.45) + (Math.random() - 0.5) * 0.15,
      z: 1200 + index * 950, // grid placement ahead
      speed: conf.baseSpeed * (0.88 + Math.random() * 0.15),
      width: 140,
      height: 70
    }));

    setSpeedKmh(0);
    setPosition(8);
    setLap(1);
    setLapTime(0);
    setNitro(100);
    setIsBoosting(false);
    setRaceState('racing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;

    const g = gameRef.current;
    g.trackSegments = buildTrack();
    g.trackLength = g.trackSegments.length * SEGMENT_LENGTH;

    // Initialize rival grid
    g.rivals = RIVALS_CONFIG.map((conf, index) => ({
      ...conf,
      x: (index % 2 === 0 ? -0.45 : 0.45) + (Math.random() - 0.5) * 0.15,
      z: 1200 + index * 950,
      speed: conf.baseSpeed * (0.88 + Math.random() * 0.15),
      width: 140,
      height: 70
    }));

    // Window Resize Handler
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // ==========================================
    // KEYBOARD CONTROLS (WITH SCROLL PREVENTION)
    // ==========================================
    const handleKeyDown = (e) => {
      initAudio();
      // Prevent webpage from scrolling when using arrow keys or spacebar
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW') g.keys.up = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') g.keys.down = true;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') g.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') g.keys.right = true;
      if (e.code === 'Space') {
        g.keys.boost = true;
      }
      if (e.code === 'KeyP') {
        setRaceState(prev => (prev === 'racing' ? 'paused' : prev === 'paused' ? 'racing' : prev));
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW') g.keys.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') g.keys.down = false;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') g.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') g.keys.right = false;
      if (e.code === 'Space') g.keys.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // ==========================================
    // 3D PROJECTION HELPER
    // ==========================================
    const project = (p, cameraX, cameraY, cameraZ, width, height) => {
      p.camera.x = (p.world.x || 0) - cameraX;
      p.camera.y = (p.world.y || 0) - cameraY;
      p.camera.z = (p.world.z || 0) - cameraZ;

      if (p.camera.z <= 0) p.camera.z = 1;
      p.screen.scale = CAMERA_DEPTH / p.camera.z;
      p.screen.x = Math.round((width / 2) + (p.screen.scale * p.camera.x * width / 2));
      p.screen.y = Math.round((height / 2) - (p.screen.scale * p.camera.y * height / 2));
      p.screen.w = Math.round(p.screen.scale * ROAD_WIDTH * width / 2);
    };

    const drawPolygon = (x1, y1, x2, y2, x3, y3, x4, y4, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      ctx.fill();
    };

    // ==========================================
    // MAIN 3D RACING LOOP
    // ==========================================
    const renderLoop = (currentTime) => {
      animId = requestAnimationFrame(renderLoop);

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const deltaMs = currentTime - g.lastFrameTime;
      g.lastFrameTime = currentTime;
      const dt = Math.min(Math.max(deltaMs / 1000, 0.005), 0.1);

      if (raceState === 'paused') return;

      // ========================================
      // PHYSICS & PLAYER INPUT HANDLING
      // ========================================
      const isSteeringLeft = g.keys.left || g.touchSteer < -0.2;
      const isSteeringRight = g.keys.right || g.touchSteer > 0.2;
      const isAccelerating = g.keys.up || g.touchGas;
      const isBraking = g.keys.down || g.touchBrake;
      const wantsBoost = (g.keys.boost || isBoosting) && g.nitro > 5;

      // Off-road Grass Penalty Check
      const isOffRoad = Math.abs(g.playerX) > 1.05;

      // Nitro Boost handling
      if (wantsBoost && g.speed > 50 && !isOffRoad) {
        g.isBoosting = true;
        g.nitro = Math.max(0, g.nitro - 28 * dt);
        if (Math.random() < 0.3) playEffect('boost');
      } else {
        g.isBoosting = false;
        // Nitro slow recharge
        g.nitro = Math.min(100, g.nitro + 12 * dt);
      }
      setNitro(Math.round(g.nitro));
      setIsBoosting(g.isBoosting);

      const targetTopSpeed = g.isBoosting ? g.maxBoostSpeed : g.maxSpeed;

      // Acceleration and Braking curves
      if (isAccelerating) {
        const accelRate = g.accel * (g.isBoosting ? 1.6 : 1.0);
        g.speed = Math.min(targetTopSpeed, g.speed + accelRate * dt);
      } else if (isBraking) {
        g.speed = Math.max(0, g.speed + g.braking * dt);
      } else {
        g.speed = Math.max(0, g.speed + g.decel * dt);
      }

      if (isOffRoad && g.speed > 80) {
        g.speed = Math.max(70, g.speed + g.offRoadDecel * dt);
        g.screenShake = 3;
      }

      // Update position along track
      g.position = (g.position + g.speed * dt * 100) % g.trackLength;

      // Lap and Sector Tracking
      const currentLapTimeSec = (currentTime - g.lapStartTime) / 1000;
      setLapTime(currentLapTimeSec);

      const startSegmentIndex = Math.floor(g.position / SEGMENT_LENGTH);
      if (startSegmentIndex < 5 && g.speed > 50 && !g.lapCounted && g.position > 100) {
        g.lapCounted = true;
        if (g.lap < TOTAL_LAPS) {
          g.lap += 1;
          setLap(g.lap);
          if (bestLapTime === 0 || currentLapTimeSec < bestLapTime) {
            setBestLapTime(currentLapTimeSec);
            localStorage.setItem('f1_best_lap', currentLapTimeSec.toFixed(2));
          }
          g.lapStartTime = currentTime;
        } else if (!g.raceFinished) {
          g.raceFinished = true;
          setRaceState('finished');
          playEffect('chequered');
        }
      } else if (startSegmentIndex > 20) {
        g.lapCounted = false;
      }

      // Steering with speed sensitivity & centrifugal curve pull
      const speedRatio = g.speed / g.maxSpeed;
      const currentSegment = g.trackSegments[startSegmentIndex % g.trackSegments.length];
      const curveForce = currentSegment ? currentSegment.curve : 0;

      if (isSteeringLeft) {
        g.playerX -= 1.8 * speedRatio * dt;
      }
      if (isSteeringRight) {
        g.playerX += 1.8 * speedRatio * dt;
      }

      // Centrifugal force pushes player outwards on turns
      g.playerX -= (curveForce * speedRatio * speedRatio * 0.8) * dt;

      // Tire smoke & skidmarks on hard turns
      if (Math.abs(curveForce) > 2 && g.speed > 160) {
        for (let i = 0; i < 2; i++) {
          g.particles.push({
            x: (i === 0 ? -0.4 : 0.4) + (Math.random() - 0.5) * 0.1,
            y: 0,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 1,
            size: Math.random() * 4 + 3,
            alpha: 0.6,
            life: 14
          });
        }
      }

      // Audio engine update
      updateEngineAudio(speedRatio, g.isBoosting);
      setSpeedKmh(Math.round(g.speed));

      // ========================================
      // AI RIVALS UPDATE & POSITION CALCULATOR
      // ========================================
      let carsAhead = 0;
      g.rivals.forEach((rival) => {
        // AI speed along circuit
        rival.z = (rival.z + rival.speed * dt * 95) % g.trackLength;

        // Subtle AI lane weaving
        rival.x += Math.sin((currentTime + rival.z) * 0.002) * 0.2 * dt;

        // Collision Check with Player F1 Car
        const dz = Math.abs(rival.z - g.position);
        if (dz < 160 && Math.abs(rival.x - g.playerX) < 0.45) {
          // Bump collision!
          playEffect('crash');
          g.speed = Math.max(60, g.speed * 0.75);
          g.screenShake = 12;

          // Push apart
          if (g.playerX < rival.x) {
            g.playerX -= 0.2;
            rival.x += 0.2;
          } else {
            g.playerX += 0.2;
            rival.x -= 0.2;
          }

          // Spark particles
          for (let k = 0; k < 12; k++) {
            g.particles.push({
              x: (g.playerX + rival.x) / 2,
              y: 0.2,
              vx: (Math.random() - 0.5) * 8,
              vy: Math.random() * 6 + 2,
              size: Math.random() * 4 + 2,
              alpha: 1,
              color: '#fbbf24',
              life: 16
            });
          }
        }

        // Leaderboard position check: is this rival ahead of player?
        const playerProgress = (g.lap - 1) * g.trackLength + g.position;
        const rivalProgress = (g.lap - 1) * g.trackLength + rival.z;
        if (rivalProgress > playerProgress) {
          carsAhead++;
        }
      });

      const currentPos = Math.min(8, Math.max(1, carsAhead + 1));
      setPosition(currentPos);
      g.finalPosition = currentPos;

      // ========================================
      // 3D PSEUDO-PERSPECTIVE RENDERING
      // ========================================
      ctx.save();
      if (g.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * g.screenShake;
        const shakeY = (Math.random() - 0.5) * g.screenShake;
        ctx.translate(shakeX, shakeY);
        g.screenShake = Math.max(0, g.screenShake - 0.6);
      }

      // 1. Sky & Distant Mountain Horizon (Parallax)
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height / 2);
      skyGradient.addColorStop(0, '#0284c7');
      skyGradient.addColorStop(0.6, '#38bdf8');
      skyGradient.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height / 2);

      // Mountains silhouette with curve shift
      ctx.fillStyle = '#0f172a';
      const mountainOffset = (g.playerX * 80) % width;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width * 0.15 + mountainOffset, height * 0.32);
      ctx.lineTo(width * 0.38 + mountainOffset, height * 0.45);
      ctx.lineTo(width * 0.62 + mountainOffset, height * 0.28);
      ctx.lineTo(width * 0.85 + mountainOffset, height * 0.42);
      ctx.lineTo(width, height * 0.36);
      ctx.lineTo(width, height / 2);
      ctx.closePath();
      ctx.fill();

      // Sun Flare
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(width * 0.75, height * 0.2, 40, 0, Math.PI * 2);
      ctx.fill();

      // 2. Project Road Segments from Back to Front
      const baseSegment = g.trackSegments[startSegmentIndex % g.trackSegments.length];
      const cameraX = g.playerX * ROAD_WIDTH;
      const cameraY = 1500 + baseSegment.p1.world.y;
      const cameraZ = g.position;

      let maxY = height;
      let x = 0;
      let dx = -(baseSegment.curve * (g.position % SEGMENT_LENGTH) / SEGMENT_LENGTH);

      for (let n = 0; n < DRAW_DISTANCE; n++) {
        const segment = g.trackSegments[(startSegmentIndex + n) % g.trackSegments.length];
        const looped = segment.index < startSegmentIndex;

        segment.p1.world.z = (segment.index + (looped ? g.trackSegments.length : 0)) * SEGMENT_LENGTH;
        segment.p2.world.z = (segment.index + 1 + (looped ? g.trackSegments.length : 0)) * SEGMENT_LENGTH;

        segment.p1.world.x = x;
        segment.p2.world.x = x + dx;

        project(segment.p1, cameraX, cameraY, cameraZ, width, height);
        project(segment.p2, cameraX, cameraY, cameraZ, width, height);

        x += dx;
        dx += segment.curve;

        if (segment.p1.camera.z <= CAMERA_DEPTH || segment.p2.screen.y >= maxY) continue;

        // Draw Grass, Rumble Kerbs, and Asphalt Polygon
        const p1 = segment.p1.screen;
        const p2 = segment.p2.screen;

        // Grass Terrain
        drawPolygon(0, p2.y, width, p2.y, width, p1.y, 0, p1.y, segment.color.grass);

        // Rumble Strips (Kerbs)
        const rumbleW1 = p1.w * 1.25;
        const rumbleW2 = p2.w * 1.25;
        drawPolygon(p1.x - rumbleW1, p1.y, p1.x + rumbleW1, p1.y, p2.x + rumbleW2, p2.y, p2.x - rumbleW2, p2.y, segment.color.rumble);

        // Asphalt Track
        drawPolygon(p1.x - p1.w, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x - p2.w, p2.y, segment.color.road);

        // Center White Dashed Lane Line
        if (segment.color.lane && !segment.isFinishLine) {
          const laneW1 = p1.w * 0.05;
          const laneW2 = p2.w * 0.05;
          drawPolygon(p1.x - laneW1, p1.y, p1.x + laneW1, p1.y, p2.x + laneW2, p2.y, p2.x - laneW2, p2.y, segment.color.lane);
        }

        // Chequered Finish Line Pattern
        if (segment.isFinishLine) {
          const blocks = 10;
          const bw = (p1.w * 2) / blocks;
          for (let b = 0; b < blocks; b++) {
            if (b % 2 === 0) {
              const bx1 = p1.x - p1.w + b * bw;
              const bx2 = p2.x - p2.w + b * (p2.w * 2 / blocks);
              const bw1 = bw;
              const bw2 = (p2.w * 2) / blocks;
              drawPolygon(bx1, p1.y, bx1 + bw1, p1.y, bx2 + bw2, p2.y, bx2, p2.y, '#000000');
            }
          }
        }

        maxY = p2.y;
      }

      // 3. Render AI Rival F1 Cars
      g.rivals.forEach((rival) => {
        const relZ = rival.z - g.position;
        if (relZ > 0 && relZ < DRAW_DISTANCE * SEGMENT_LENGTH) {
          const scale = CAMERA_DEPTH / relZ;
          const rx = Math.round((width / 2) + (scale * (rival.x * ROAD_WIDTH - cameraX) * width / 2));
          const ry = Math.round((height / 2) - (scale * (baseSegment.p1.world.y - cameraY + 600) * height / 2));
          const carW = Math.round(rival.width * scale * width / 2);
          const carH = Math.round(rival.height * scale * width / 2);

          if (carW > 8 && carH > 4) {
            ctx.save();
            ctx.translate(rx, ry);

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.45)';
            ctx.beginPath();
            ctx.ellipse(0, carH * 0.45, carW * 0.55, carH * 0.22, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tires
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-carW * 0.52, -carH * 0.1, carW * 0.2, carH * 0.6);
            ctx.fillRect(carW * 0.32, -carH * 0.1, carW * 0.2, carH * 0.6);

            // Main Body Cockpit
            ctx.fillStyle = rival.color;
            ctx.beginPath();
            ctx.moveTo(-carW * 0.25, carH * 0.35);
            ctx.lineTo(carW * 0.25, carH * 0.35);
            ctx.lineTo(carW * 0.15, -carH * 0.4);
            ctx.lineTo(-carW * 0.15, -carH * 0.4);
            ctx.closePath();
            ctx.fill();

            // Rear Wing
            ctx.fillStyle = rival.wingColor;
            ctx.fillRect(-carW * 0.42, -carH * 0.48, carW * 0.84, carH * 0.18);

            // Driver Helmet
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.arc(0, -carH * 0.12, carW * 0.08, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
        }
      });

      // 4. Render Player Formula 1 Car (High Fidelity Chase Perspective)
      const carScale = 1.35;
      const px = width / 2;
      const py = height - 90;
      const playerCarW = 190 * carScale;
      const playerCarH = 92 * carScale;

      ctx.save();
      ctx.translate(px, py);

      // Car body roll tilt on turning
      const tilt = (isSteeringLeft ? -0.09 : isSteeringRight ? 0.09 : 0);
      ctx.rotate(tilt);

      // Dynamic Underglow & Ground Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(0, playerCarH * 0.38, playerCarW * 0.52, playerCarH * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wide Rear Slick Tires with Rim Glow
      ctx.fillStyle = '#090d16';
      ctx.fillRect(-playerCarW * 0.48, -playerCarH * 0.05, playerCarW * 0.18, playerCarH * 0.55);
      ctx.fillRect(playerCarW * 0.3, -playerCarH * 0.05, playerCarW * 0.18, playerCarH * 0.55);

      // Yellow Tire Pirelli Compound Rings
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-playerCarW * 0.46, -playerCarH * 0.03, playerCarW * 0.14, playerCarH * 0.51);
      ctx.strokeRect(playerCarW * 0.32, -playerCarH * 0.03, playerCarW * 0.14, playerCarH * 0.51);

      // Aerodynamic Rear Wing & DRS Flap
      ctx.fillStyle = g.isBoosting ? '#00e5ff' : '#0369a1';
      ctx.shadowColor = g.isBoosting ? '#00e5ff' : 'transparent';
      ctx.shadowBlur = g.isBoosting ? 20 : 0;
      ctx.fillRect(-playerCarW * 0.42, -playerCarH * 0.48, playerCarW * 0.84, playerCarH * 0.18);

      // Sidepods & Carbon-Fiber Floor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-playerCarW * 0.35, playerCarH * 0.05, playerCarW * 0.7, playerCarH * 0.32);

      // Main F1 Monocoque Fuselage (Vibrant Cyan / Gulf Blue livery)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-playerCarW * 0.26, playerCarH * 0.36);
      ctx.lineTo(playerCarW * 0.26, playerCarH * 0.36);
      ctx.lineTo(playerCarW * 0.14, -playerCarH * 0.42);
      ctx.lineTo(-playerCarW * 0.14, -playerCarH * 0.42);
      ctx.closePath();
      ctx.fill();

      // Livery Racing Stripes
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-playerCarW * 0.04, -playerCarH * 0.38, playerCarW * 0.08, playerCarH * 0.7);

      // Driver Halo & Helmet
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(0, -playerCarH * 0.14, playerCarW * 0.11, Math.PI, 0);
      ctx.fill();

      // Driver Golden Helmet
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, -playerCarH * 0.15, playerCarW * 0.065, 0, Math.PI * 2);
      ctx.fill();

      // Visor
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-playerCarW * 0.04, -playerCarH * 0.18, playerCarW * 0.08, playerCarH * 0.045);

      // Nitro Exhaust Flames when Boosting
      if (g.isBoosting && g.speed > 80) {
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 25;
        for (let side = -1; side <= 1; side += 2) {
          ctx.beginPath();
          ctx.moveTo(side * playerCarW * 0.12, playerCarH * 0.36);
          ctx.lineTo(side * playerCarW * 0.16, playerCarH * 0.36);
          ctx.lineTo(side * playerCarW * 0.14, playerCarH * (0.6 + Math.random() * 0.3));
          ctx.closePath();
          ctx.fill();
        }
      }

      ctx.restore();

      // 5. Speed Streaks when Boosting
      if (g.isBoosting) {
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const sx = Math.random() * width;
          const sy = Math.random() * height;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + (sx - width / 2) * 0.25, sy + 35);
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (engineSoundRef.current) {
        try {
          engineSoundRef.current.osc.stop();
        } catch {
      // ignore
    }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="f1-game-wrapper" ref={containerRef}>
      {/* Top Telemetry HUD Overlay */}
      <div className="f1-hud-overlay">
        <div className="f1-telemetry-left">
          {/* Position Badge */}
          <div className="telemetry-box pos-box">
            <span className="telemetry-label">POSITION</span>
            <span className="telemetry-value pos-value">
              P<strong className="pos-digit">{position}</strong>
              <small className="pos-total">/ 8</small>
            </span>
          </div>

          {/* Lap Counter */}
          <div className="telemetry-box">
            <span className="telemetry-label">LAP</span>
            <span className="telemetry-value">{lap} <small>/ {TOTAL_LAPS}</small></span>
          </div>

          {/* Lap Time */}
          <div className="telemetry-box">
            <span className="telemetry-label">LAP TIME</span>
            <span className="telemetry-value mono">{lapTime.toFixed(2)}s</span>
          </div>
        </div>

        {/* Speedometer & Nitro Tachometer */}
        <div className="f1-telemetry-right">
          <div className="speedometer-cluster">
            <div className="speed-display">
              <span className="speed-num">{speedKmh}</span>
              <span className="speed-unit">KM/H</span>
            </div>

            {/* Nitro DRS Gauge */}
            <div className="nitro-gauge-wrap">
              <span className="nitro-label">DRS BOOST [SPACE]</span>
              <div className="nitro-track">
                <div 
                  className={`nitro-bar ${isBoosting ? 'active' : ''}`}
                  style={{ width: `${nitro}%` }}
                />
              </div>
            </div>
          </div>

          <div className="f1-audio-controls">
            <button
              type="button"
              className="f1-icon-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Engine Audio' : 'Unmute Engine Audio'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              type="button"
              className="f1-icon-btn"
              onClick={() => setRaceState(prev => (prev === 'racing' ? 'paused' : 'racing'))}
              title={raceState === 'racing' ? 'Pause Race' : 'Resume Race'}
            >
              {raceState === 'racing' ? '⏸️' : '▶️'}
            </button>
          </div>
        </div>
      </div>

      {/* Primary 3D Web Canvas */}
      <canvas 
        ref={canvasRef} 
        className="f1-canvas" 
        onClick={initAudio}
      />

      {/* Chequered Flag / Race Finish Screen */}
      {raceState === 'finished' && (
        <div className="f1-modal-overlay">
          <div className="f1-finish-card">
            <div className="finish-chequered-banner">🏁 CHEQUERED FLAG 🏁</div>
            <h2 className="finish-title">
              {position === 1 ? '🏆 Grand Prix Champion!' : position <= 3 ? '🥉 Podium Finish!' : '🏁 Race Complete!'}
            </h2>
            <p className="finish-desc">
              You finished the Grand Prix in <strong>P{position}</strong> out of 8 drivers!
            </p>

            <div className="finish-stats-grid">
              <div className="finish-stat-box">
                <span className="stat-label">Final Position</span>
                <span className="stat-val highlight">P{position}</span>
              </div>
              <div className="finish-stat-box">
                <span className="stat-label">Best Lap</span>
                <span className="stat-val">{bestLapTime > 0 ? `${bestLapTime.toFixed(2)}s` : '--'}</span>
              </div>
              <div className="finish-stat-box">
                <span className="stat-label">Top Speed</span>
                <span className="stat-val">{speedKmh} km/h</span>
              </div>
            </div>

            <div className="finish-actions">
              <button 
                type="button" 
                className="f1-btn-action f1-btn-primary"
                onClick={handleRestartRace}
              >
                🔄 Race Again
              </button>
              {onBackToMenu && (
                <button 
                  type="button" 
                  className="f1-btn-action"
                  onClick={onBackToMenu}
                >
                  🕹️ Game Menu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Touch Controls Layer */}
      <div className="f1-mobile-controls">
        <div className="f1-touch-steer-cluster">
          <button
            type="button"
            className="touch-btn steer-btn"
            onTouchStart={() => { gameRef.current.touchSteer = -1; initAudio(); }}
            onTouchEnd={() => { gameRef.current.touchSteer = 0; }}
            onMouseDown={() => { gameRef.current.touchSteer = -1; initAudio(); }}
            onMouseUp={() => { gameRef.current.touchSteer = 0; }}
            aria-label="Steer Left"
          >
            ◀
          </button>
          <button
            type="button"
            className="touch-btn steer-btn"
            onTouchStart={() => { gameRef.current.touchSteer = 1; initAudio(); }}
            onTouchEnd={() => { gameRef.current.touchSteer = 0; }}
            onMouseDown={() => { gameRef.current.touchSteer = 1; initAudio(); }}
            onMouseUp={() => { gameRef.current.touchSteer = 0; }}
            aria-label="Steer Right"
          >
            ▶
          </button>
        </div>

        <div className="f1-touch-pedals-cluster">
          <button
            type="button"
            className="touch-btn pedal-btn brake-btn"
            onTouchStart={() => { gameRef.current.touchBrake = true; }}
            onTouchEnd={() => { gameRef.current.touchBrake = false; }}
            onMouseDown={() => { gameRef.current.touchBrake = true; }}
            onMouseUp={() => { gameRef.current.touchBrake = false; }}
            aria-label="Brake"
          >
            BRAKE
          </button>
          <button
            type="button"
            className="touch-btn pedal-btn boost-touch-btn"
            onTouchStart={() => { setIsBoosting(true); }}
            onTouchEnd={() => { setIsBoosting(false); }}
            onMouseDown={() => { setIsBoosting(true); }}
            onMouseUp={() => { setIsBoosting(false); }}
            aria-label="Nitro Boost"
          >
            ⚡ NITRO
          </button>
          <button
            type="button"
            className="touch-btn pedal-btn gas-btn"
            onTouchStart={() => { gameRef.current.touchGas = true; initAudio(); }}
            onTouchEnd={() => { gameRef.current.touchGas = false; }}
            onMouseDown={() => { gameRef.current.touchGas = true; initAudio(); }}
            onMouseUp={() => { gameRef.current.touchGas = false; }}
            aria-label="Accelerate Gas"
          >
            GAS
          </button>
        </div>
      </div>

      {/* Bottom Keyboard Controls Help */}
      <div className="f1-bottom-bar">
        <span>🏎️ <strong>Controls:</strong> W / Up: Gas | S / Down: Brake | A/D / Left/Right: Steer | Space: DRS Boost | P: Pause</span>
      </div>
    </div>
  );
};

export default F1RaceGame;
