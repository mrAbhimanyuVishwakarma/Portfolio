import React, { useState, useEffect, useRef } from 'react';
import './Arcade.css';

// Load skins dynamically from assets
const footballImports = import.meta.glob('../assets/Mini Game/Football/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });
const basketballImports = import.meta.glob('../assets/Mini Game/Basketball/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' });

const skins = [
  ...Object.values(footballImports).map((url, i) => ({ type: 'football', url, name: i === 0 ? 'FIFA 2026' : `Football ${i + 1}` })),
  ...Object.values(basketballImports).map((url, i) => ({ type: 'basketball', url, name: `Basketball ${i + 1}` }))
];

const Arcade = ({ onNavigate }) => {
  // Game Selector Popup is open by default on first visit
  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(true);
  const [selectedGame, setSelectedGame] = useState('football'); // 'football' | 'f1' | 'jet'
  
  // Game State
  const [score, setScore] = useState(0);
  const [skinIndex, setSkinIndex] = useState(0);
  const [isGoal, setIsGoal] = useState(false);
  const [netShaking, setNetShaking] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [aimVector, setAimVector] = useState(null);

  // Arena Physics Refs
  const arenaRef = useRef(null);
  const ballRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const animFrameRef = useRef(null);
  const dragStartRef = useRef(null);
  const lastTapRef = useRef(0);

  const aimLineRef = useRef(null);

  const ballSize = 62;
  const goalWidth = 280;
  const goalHeight = 85;

  // Initialize ball position to center kickoff spot on the enlarged pitch
  const resetBallPosition = () => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const x = rect.width / 2 - ballSize / 2;
    const y = Math.max(rect.height * 0.72 - ballSize / 2, rect.height - ballSize - 120);
    posRef.current = { x, y };
    velRef.current = { x: 0, y: 0 };
    isMovingRef.current = false;
    setIsCharging(false);

    if (aimLineRef.current) {
      aimLineRef.current.style.display = 'none';
    }

    if (ballRef.current) {
      ballRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  };

  useEffect(() => {
    resetBallPosition();
    window.addEventListener('resize', resetBallPosition);
    return () => window.removeEventListener('resize', resetBallPosition);
  }, [selectedGame]);

  // Pointer Down (Mouse or Touch) - Left Click Only
  const handlePointerDown = (e) => {
    // Completely ignore right click or other buttons
    if (e.button !== undefined && e.button !== 0) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    if (isGoal) return;

    // Double tap/click to swap skin
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setSkinIndex((prev) => (prev + 1) % skins.length);
      lastTapRef.current = 0;
      velRef.current = { x: 0, y: 0 };
      isMovingRef.current = false;
      setIsCharging(false);
      if (aimLineRef.current) aimLineRef.current.style.display = 'none';
      return;
    }
    lastTapRef.current = now;

    // Stop current ball velocity
    isMovingRef.current = false;
    velRef.current = { x: 0, y: 0 };
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    dragStartRef.current = { x: clientX, y: clientY };
    setIsCharging(true);
    if (aimLineRef.current) {
      aimLineRef.current.style.display = 'block';
      aimLineRef.current.style.width = '0px';
    }
  };

  // Pointer Move (Mouse or Touch) - Direct GPU transform without React re-renders!
  const handlePointerMove = (e) => {
    if (!isCharging || !dragStartRef.current || !aimLineRef.current) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const dx = dragStartRef.current.x - clientX;
    const dy = dragStartRef.current.y - clientY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 160);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    aimLineRef.current.style.width = `${distance * 1.2}px`;
    aimLineRef.current.style.transform = `rotate(${angle}deg)`;
  };

  // Pointer Up (Mouse or Touch) - Launch Ball
  const handlePointerUp = (e) => {
    if (!isCharging || !dragStartRef.current) return;
    setIsCharging(false);
    if (aimLineRef.current) {
      aimLineRef.current.style.display = 'none';
    }

    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

    const dx = dragStartRef.current.x - clientX;
    const dy = dragStartRef.current.y - clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // If it was just a tiny click without drag, launch upward toward goal
    if (dist < 10) {
      velRef.current = { x: (Math.random() - 0.5) * 4, y: -22 };
    } else {
      const speedMultiplier = Math.min(dist / 4, 34);
      const angle = Math.atan2(dy, dx);
      velRef.current = {
        x: Math.cos(angle) * speedMultiplier,
        y: Math.sin(angle) * speedMultiplier
      };
    }

    dragStartRef.current = null;
    isMovingRef.current = true;
    animate();
  };

  // Animation Loop within Arena Bounds
  const animate = () => {
    if (!arenaRef.current || !ballRef.current) return;

    const rect = arenaRef.current.getBoundingClientRect();
    const arenaW = rect.width;
    const arenaH = rect.height;

    let { x, y } = posRef.current;
    let { x: vx, y: vy } = velRef.current;

    const gravity = 0.35;
    const bounce = 0.78;
    const friction = 0.985;

    vy += gravity;
    vx *= friction;

    x += vx;
    y += vy;

    // Left and Right Wall Collision
    if (x <= 0) {
      x = 0;
      vx = -vx * bounce;
    } else if (x + ballSize >= arenaW) {
      x = arenaW - ballSize;
      vx = -vx * bounce;
    }

    // Top Boundary & Goal Collision
    const goalLeft = arenaW / 2 - goalWidth / 2;
    const goalRight = arenaW / 2 + goalWidth / 2;
    const ballCenter = x + ballSize / 2;

    if (y <= goalHeight && ballCenter >= goalLeft && ballCenter <= goalRight) {
      // GOAL SCORED!
      if (!isGoal) {
        handleTriggerGoal();
      }
      y = goalHeight;
      vy = Math.abs(vy) * 0.4; // Bounce downward from net
      vx *= 0.5;
    } else if (y <= 0) {
      y = 0;
      vy = -vy * bounce;
    }

    // Floor Boundary Collision
    if (y + ballSize >= arenaH) {
      y = arenaH - ballSize;
      if (Math.abs(vy) < 1.2) {
        vy = 0;
      } else {
        vy = -vy * bounce;
      }
      vx *= 0.94; // ground friction
    }

    // Stop if resting on floor
    if (y >= arenaH - ballSize - 1 && Math.abs(vy) === 0 && Math.abs(vx) < 0.15) {
      y = arenaH - ballSize;
      vx = 0;
      vy = 0;
      isMovingRef.current = false;
    }

    posRef.current = { x, y };
    velRef.current = { x: vx, y: vy };

    ballRef.current.style.transform = `translate(${x}px, ${y}px)`;

    if (isMovingRef.current) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const handleTriggerGoal = () => {
    setIsGoal(true);
    setNetShaking(true);
    setScore((prev) => prev + 1);

    setTimeout(() => {
      setNetShaking(false);
    }, 700);

    setTimeout(() => {
      setIsGoal(false);
    }, 2400);
  };

  useEffect(() => {
    const handleGlobalUp = (e) => {
      if (isCharging) handlePointerUp(e);
    };
    const handleGlobalMove = (e) => {
      if (isCharging) handlePointerMove(e);
    };
    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('pointermove', handleGlobalMove);
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('pointermove', handleGlobalMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCharging]);

  const currentSkin = skins[skinIndex] || skins[0];

  return (
    <div className="arcade-page">
      {/* ====================================================
          GAME SELECTOR POPUP MODAL (Appears on first visit or on demand)
      ==================================================== */}
      {isGameSelectorOpen && (
        <div className="game-modal-overlay" onClick={() => setIsGameSelectorOpen(false)}>
          <div className="game-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="game-modal-close" 
              onClick={() => setIsGameSelectorOpen(false)}
              aria-label="Close game selector"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="game-modal-header">
              <span className="game-modal-badge">🕹️ Arcade Game Hub</span>
              <h2 className="game-modal-title">Select a Game to Play</h2>
              <p className="game-modal-subtitle">
                Choose an arcade mini-game to launch in the interactive arena below.
              </p>
            </div>

            <div className="modal-games-grid">
              {/* Game 1: Ball Striker Challenge (Active) */}
              <div className={`modal-game-item ${selectedGame === 'football' ? 'active-game' : ''}`}>
                <div>
                  <div className="modal-game-top">
                    <span className="modal-game-icon">⚽🏀</span>
                    <span className="modal-status-badge status-playable">Playable Now</span>
                  </div>
                  <h3 className="modal-item-title">Ball Striker Challenge</h3>
                  <p className="modal-item-desc">
                    Physics-driven shooting game. Slingshot or swipe the ball, hit the top net or hoop, and switch ball skins!
                  </p>
                </div>
                <button 
                  type="button" 
                  className="modal-play-btn btn-launch"
                  onClick={() => {
                    setSelectedGame('football');
                    setIsGameSelectorOpen(false);
                    resetBallPosition();
                  }}
                >
                  Launch Game 🎯
                </button>
              </div>

              {/* Game 2: F1 Speed Sprint (Coming Soon) */}
              <div className="modal-game-item">
                <div>
                  <div className="modal-game-top">
                    <span className="modal-game-icon">🏎️</span>
                    <span className="modal-status-badge status-soon">Coming Soon</span>
                  </div>
                  <h3 className="modal-item-title">F1 Speed Sprint</h3>
                  <p className="modal-item-desc">
                    High-speed asphalt racer. Dodge rivals, manage grip, and clock fastest sector times.
                  </p>
                </div>
                <button type="button" className="modal-play-btn btn-locked" disabled>
                  In Development ⏳
                </button>
              </div>

              {/* Game 3: Sky Strike: Fighter Jet (Coming Soon) */}
              <div className="modal-game-item">
                <div>
                  <div className="modal-game-top">
                    <span className="modal-game-icon">✈️</span>
                    <span className="modal-status-badge status-soon">Coming Soon</span>
                  </div>
                  <h3 className="modal-item-title">Sky Strike: Fighter Jet</h3>
                  <p className="modal-item-desc">
                    Supersonic aerial combat simulator. Evade missile locks and engage enemy squadrons.
                  </p>
                </div>
                <button type="button" className="modal-play-btn btn-locked" disabled>
                  In Development ⏳
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          TOP NAVIGATION BAR
      ==================================================== */}
      <div className="arcade-top-bar">
        <div className="arcade-nav-actions">
          <button 
            type="button" 
            className="arcade-btn" 
            onClick={() => onNavigate('home', 'top')}
            aria-label="Back to Portfolio"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Portfolio
          </button>

          <button 
            type="button" 
            className="arcade-btn arcade-btn-primary" 
            onClick={() => setIsGameSelectorOpen(true)}
            aria-label="Select Game"
          >
            🕹️ Select Game
          </button>
        </div>

        <div className="arcade-badge-group">
          <div className="arcade-status-badge">
            <span className="arcade-pulse-dot"></span>
            Arcade Zone
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="arcade-header">
        <h1 className="arcade-title">Arcade & Mini Games</h1>
        <p className="arcade-subtitle">
          Interactive games built right into the browser. 
          Pull back and release to shoot the ball into the top goal, or choose another game above!
        </p>
      </header>

      {/* ====================================================
          ACTIVE GAME ARENA: BALL STRIKER
      ==================================================== */}
      <section className="arcade-cabinet">
        <div className="cabinet-top-hud">
          <div className="cabinet-title-box">
            <span className="cabinet-icon">{currentSkin.type === 'basketball' ? '🏀' : '⚽'}</span>
            <div>
              <h2 className="cabinet-game-title">
                {currentSkin.type === 'basketball' ? 'Hoops Challenge' : 'Penalty Striker Arena'}
              </h2>
            </div>
            <span className="cabinet-tag">Live Playable</span>
          </div>

          <div className="cabinet-hud-controls">
            <div className="score-badge">
              <span className="score-label">{currentSkin.type === 'basketball' ? 'Swishes:' : 'Goals:'}</span>
              <span className="score-num">{score}</span>
            </div>

            <button 
              type="button" 
              className="hud-btn" 
              onClick={resetBallPosition}
              title="Reset ball to kickoff spot"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              Reset Ball
            </button>
          </div>
        </div>

        {/* The Stadium Pitch Court */}
        <div 
          ref={arenaRef} 
          className="pitch-arena-container"
          onPointerDown={handlePointerDown}
        >
          {/* Pitch Field Markings */}
          <div className="pitch-lines">
            <div className="pitch-box-penalty"></div>
            <div className="pitch-box-goal"></div>
            <div className="pitch-penalty-spot"></div>
            <div className="pitch-penalty-arc"></div>
            <div className="pitch-center-line"></div>
            <div className="pitch-center-circle-ring"></div>
            <div className="pitch-kickoff-spot-marker"></div>
          </div>

          {/* Goal Net or Basketball Hoop at Top of Pitch */}
          {currentSkin.type === 'football' ? (
            <div className="pitch-goal-post">
              <div className="pitch-goal-netting"></div>
            </div>
          ) : (
            <div className="pitch-basketball-hoop">
              <div className="hoop-backboard"></div>
              <div className="hoop-ring">
                <div className="hoop-net"></div>
              </div>
            </div>
          )}

          {/* Celebration Text on Goal */}
          {isGoal && (
            <div className="pitch-goal-celebration">
              <h1>{currentSkin.type === 'basketball' ? 'SWISH!! 🏀' : 'GOAL!! ⚽'}</h1>
            </div>
          )}

          {/* The Playable Ball */}
          <div 
            ref={ballRef}
            className="arena-ball-wrapper"
            onPointerDown={handlePointerDown}
            onContextMenu={(e) => e.preventDefault()}
            title="Drag to shoot! Double click to switch ball skin!"
            style={{ userSelect: 'none', WebkitTouchCallout: 'none', touchAction: 'none' }}
          >
            {/* GPU Accelerated Slingshot Aim Arrow Indicator */}
            <div 
              ref={aimLineRef}
              className="slingshot-aim-line"
              style={{ display: 'none' }}
            />

            <div 
              className={`arena-ball ${isCharging ? 'charging' : ''}`}
              onContextMenu={(e) => e.preventDefault()}
            >
              <img src={currentSkin.url} alt={currentSkin.name} draggable="false" />
            </div>
          </div>

          {/* Bottom Pitch Controls & Skin Selector */}
          <div className="pitch-bottom-bar">
            <div className="pitch-tip-pill">
              <span>🎯 <strong>How to Play:</strong> Click/touch & pull back on the ball to slingshot into the goal! Double-click to switch ball.</span>
            </div>

            <div className="pitch-skins-picker">
              <span className="skin-picker-label">Ball:</span>
              {skins.map((skin, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pitch-skin-btn ${skinIndex === i ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSkinIndex(i);
                    resetBallPosition();
                  }}
                  title={`Switch to ${skin.name}`}
                >
                  <img src={skin.url} alt={skin.name} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          GAME PIPELINE SHOWCASE
      ==================================================== */}
      <section className="pipeline-section">
        <div className="pipeline-header">
          <span className="pipeline-tag">Upcoming Releases</span>
          <h2 className="pipeline-title">More Games in Development</h2>
        </div>

        <div className="pipeline-grid">
          <div className="pipeline-card">
            <div>
              <div className="pipeline-card-top">
                <span className="pipeline-card-icon">🏎️</span>
                <span className="modal-status-badge status-soon">In Progress</span>
              </div>
              <h3 className="pipeline-card-title">F1 Speed Sprint</h3>
              <p className="pipeline-card-desc">
                High-speed top-down Grand Prix racer with collision physics, drifting mechanics, and dynamic weather laps.
              </p>
            </div>
            <div className="pipeline-tags">
              <span className="pipeline-tag-pill">Canvas 2D</span>
              <span className="pipeline-tag-pill">Asphalt Racing</span>
              <span className="pipeline-tag-pill">Tire Grip Physics</span>
            </div>
          </div>

          <div className="pipeline-card">
            <div>
              <div className="pipeline-card-top">
                <span className="pipeline-card-icon">✈️</span>
                <span className="modal-status-badge status-soon">In Progress</span>
              </div>
              <h3 className="pipeline-card-title">Sky Strike: Fighter Jet</h3>
              <p className="pipeline-card-desc">
                Supersonic aerial combat simulation with radar sweeps, dogfight barrel rolls, and evasive flare countermeasures.
              </p>
            </div>
            <div className="pipeline-tags">
              <span className="pipeline-tag-pill">Arcade Shooter</span>
              <span className="pipeline-tag-pill">Radar Targeting</span>
              <span className="pipeline-tag-pill">Particle FX</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Arcade;
