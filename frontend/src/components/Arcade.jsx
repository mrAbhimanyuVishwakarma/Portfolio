import React, { useState, useEffect, useRef } from 'react';
import './Arcade.css';
import FighterJetGame from './FighterJetGame';
import F1RaceGame from './F1RaceGame';

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

  // Arena Physics Refs
  const arenaRef = useRef(null);
  const wrapperRef = useRef(null);
  const ballRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const animFrameRef = useRef(null);
  const chargeStartTimeRef = useRef(0);
  const swipeStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isSwipingRef = useRef(false);
  const isChargingRef = useRef(false);
  const isGoalRef = useRef(false);
  const lastTapRef = useRef(0);
  const aimLineRef = useRef(null);
  const lastTimeRef = useRef(0);

  const ballSize = 60;
  const goalWidth = 280;
  const goalHeight = 85;

  // Initialize or reset ball position to center kickoff spot on the pitch
  const resetBallPosition = () => {
    if (!arenaRef.current || !wrapperRef.current) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const arenaW = arenaRef.current.clientWidth || 800;
    const arenaH = arenaRef.current.clientHeight || 680;

    const x = Math.max(0, Math.min(arenaW / 2 - ballSize / 2, arenaW - ballSize));
    const y = Math.max(100, Math.min(arenaH * 0.65, arenaH - ballSize - 50));

    posRef.current = { x, y };
    velRef.current = { x: 0, y: 0 };
    isMovingRef.current = false;
    isChargingRef.current = false;
    isSwipingRef.current = false;
    setIsCharging(false);

    if (aimLineRef.current) {
      aimLineRef.current.style.display = 'none';
    }

    wrapperRef.current.style.transform = `translate(${x}px, ${y}px)`;
    if (ballRef.current) {
      ballRef.current.style.transform = 'rotate(0deg)';
      ballRef.current.dataset.rotation = '0';
    }
  };

  useEffect(() => {
    const timer = setTimeout(resetBallPosition, 60);
    window.addEventListener('resize', resetBallPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resetBallPosition);
    };
  }, [selectedGame, isGameSelectorOpen]);

  // Pointer Down (Mouse, Touch, or Pen)
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (isGoalRef.current) return;

    e.preventDefault();

    // Double tap/click to cycle skin (identical to dashboard Football)
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setSkinIndex((prev) => (prev + 1) % skins.length);
      lastTapRef.current = 0;
      isMovingRef.current = false;
      isChargingRef.current = false;
      isSwipingRef.current = false;
      setIsCharging(false);
      velRef.current = { x: 0, y: 0 };
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (aimLineRef.current) aimLineRef.current.style.display = 'none';
      return;
    }
    lastTapRef.current = now;

    // Grab ball and stop current motion
    isMovingRef.current = false;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    velRef.current = { x: 0, y: 0 };

    chargeStartTimeRef.current = now;
    swipeStartRef.current = { x: e.clientX, y: e.clientY, time: now };
    isChargingRef.current = true;
    setIsCharging(true);

    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      isSwipingRef.current = true;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Live Slingshot / Aim Drag Tracking
  const handlePointerMove = (e) => {
    if (!isChargingRef.current || !wrapperRef.current) return;

    const dx = e.clientX - swipeStartRef.current.x;
    const dy = e.clientY - swipeStartRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (aimLineRef.current) {
      if (dist > 10) {
        aimLineRef.current.style.display = 'block';
        // Aim direction points toward goal/shot direction
        const shootDx = dy > 10 ? -dx : dx;
        const shootDy = dy > 10 ? -dy : dy;
        const angle = Math.atan2(shootDy, shootDx) * (180 / Math.PI);
        const lineLen = Math.min(dist * 1.25, 150);

        aimLineRef.current.style.width = `${lineLen}px`;
        aimLineRef.current.style.transform = `rotate(${angle}deg)`;
      } else {
        aimLineRef.current.style.display = 'none';
      }
    }
  };

  // Pointer Up / Release: Execute Shot
  const handlePointerUp = (e) => {
    try {
      e.currentTarget?.releasePointerCapture?.(e.pointerId);
    } catch (_) {}

    if (!isChargingRef.current && !isSwipingRef.current) return;

    isChargingRef.current = false;
    setIsCharging(false);

    if (aimLineRef.current) {
      aimLineRef.current.style.display = 'none';
    }

    const now = Date.now();
    const holdDuration = Math.min(now - chargeStartTimeRef.current, 1200);
    const powerMultiplier = 0.75 + (holdDuration / 1200) * 0.55;

    const endX = e.clientX;
    const endY = e.clientY;
    const swipeDx = endX - swipeStartRef.current.x;
    const swipeDy = endY - swipeStartRef.current.y;
    const dt = Math.max(1, now - swipeStartRef.current.time);
    const dist = Math.sqrt(swipeDx * swipeDx + swipeDy * swipeDy);

    let vx = 0;
    let vy = 0;

    // 1. Touch swipe / forward flick: if moved forward or swiped fast
    if (isSwipingRef.current && dt < 1000 && dist >= 15) {
      isSwipingRef.current = false;
      const swipeMultiplier = 7;
      vx = (swipeDx / dt) * swipeMultiplier;
      vy = (swipeDy / dt) * swipeMultiplier;

      const maxSpeed = 18;
      const currentSpeed = Math.sqrt(vx * vx + vy * vy);
      if (currentSpeed > maxSpeed) {
        vx = (vx / currentSpeed) * maxSpeed;
        vy = (vy / currentSpeed) * maxSpeed;
      }
    } else if (dist > 10) {
      // 2. Slingshot or Drag (Calibrated for smooth PC play)
      if (swipeDy > 10) {
        // Slingshot: user pulled downward/backward -> fires forward toward goal!
        const nx = swipeDx / dist;
        const ny = swipeDy / dist;
        const speed = Math.min(9 + dist * 0.08, 17) * powerMultiplier;
        vx = -nx * speed;
        vy = -ny * speed;
      } else {
        // Direct forward drag toward goal
        const nx = swipeDx / dist;
        const ny = swipeDy / dist;
        const speed = Math.min(8 + dist * 0.08, 16) * powerMultiplier;
        vx = nx * speed;
        vy = ny * speed;
      }
    } else {
      // 3. Quick tap or direct click on the ball -> smooth kick straight towards goal!
      vx = (Math.random() - 0.5) * 3;
      vy = -13 * powerMultiplier;
    }

    velRef.current = { x: vx, y: vy };
    isMovingRef.current = true;
    lastTimeRef.current = performance.now();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);
  };

  // Continuous Physics Loop - STRICTLY CONFINED TO PITCH ARENA FIELD
  const animate = () => {
    if (!arenaRef.current || !wrapperRef.current) return;

    const arenaW = arenaRef.current.clientWidth || 800;
    const arenaH = arenaRef.current.clientHeight || 680;

    // Delta-time normalization: prevents ball from moving too fast on 120Hz/144Hz/240Hz PC monitors
    const now = performance.now();
    const rawDt = lastTimeRef.current ? (now - lastTimeRef.current) / 16.667 : 1;
    lastTimeRef.current = now;
    const dt = Math.max(0.1, Math.min(rawDt, 1.8));

    let { x, y } = posRef.current;
    let { x: vx, y: vy } = velRef.current;

    const gravity = 0.35;
    const bounceFriction = 0.82;
    const airFriction = 0.994;
    const groundFriction = 0.95;

    vy += gravity * dt;
    vx *= Math.pow(airFriction, dt);

    x += vx * dt;
    y += vy * dt;

    const minX = 0;
    const maxX = Math.max(0, arenaW - ballSize);
    const minY = 0;
    const maxY = Math.max(0, arenaH - ballSize);

    // Left and Right Boundary Checks (Never goes out of field)
    if (x <= minX) {
      x = minX;
      vx = Math.abs(vx) * bounceFriction;
    } else if (x >= maxX) {
      x = maxX;
      vx = -Math.abs(vx) * bounceFriction;
    }

    // Top Goal Mouth & Top Wall Check
    const goalLeft = arenaW / 2 - goalWidth / 2;
    const goalRight = arenaW / 2 + goalWidth / 2;
    const ballCenter = x + ballSize / 2;

    if (y <= goalHeight && ballCenter >= goalLeft && ballCenter <= goalRight) {
      // Inside Goal Post Netting!
      if (!isGoalRef.current) {
        handleTriggerGoal();
      }
      y = Math.min(y, goalHeight);
      vy = Math.abs(vy) * 0.45; // gentle bounce downward off net
      vx *= 0.5;
    } else if (y <= minY) {
      // Top wall outside the goal
      y = minY;
      vy = Math.abs(vy) * bounceFriction;
    }

    // Bottom Boundary (Turf / Floor)
    if (y >= maxY) {
      y = maxY;
      if (Math.abs(vy) < gravity * 1.5) {
        vy = 0;
      } else {
        vy = -Math.abs(vy) * bounceFriction;
      }
      vx *= groundFriction;
    }

    // Settled & Resting on Pitch Floor
    if (y >= maxY - 1 && Math.abs(vy) === 0 && Math.abs(vx) < 0.12) {
      y = maxY;
      vx = 0;
      vy = 0;
      isMovingRef.current = false;
    }

    posRef.current = { x, y };
    velRef.current = { x: vx, y: vy };

    wrapperRef.current.style.transform = `translate(${x}px, ${y}px)`;

    // Dynamic Ball Spin Rotation based on Velocity
    if (ballRef.current) {
      const currentRotation = parseFloat(ballRef.current.dataset.rotation || '0');
      const speed = Math.sqrt(vx * vx + vy * vy);
      const rotationSpeed = vx > 0 ? speed : -speed;
      const newRotation = currentRotation + rotationSpeed;
      ballRef.current.dataset.rotation = newRotation;
      ballRef.current.style.transform = `rotate(${newRotation}deg)`;
    }

    if (isMovingRef.current) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const handleTriggerGoal = () => {
    isGoalRef.current = true;
    setIsGoal(true);
    setNetShaking(true);
    setScore((prev) => prev + 1);

    setTimeout(() => {
      setNetShaking(false);
    }, 700);

    setTimeout(() => {
      isGoalRef.current = false;
      setIsGoal(false);
    }, 2800);
  };

  // Window fallback release listeners
  useEffect(() => {
    const handleGlobalPointerUp = (e) => {
      if (isChargingRef.current || isSwipingRef.current) {
        handlePointerUp(e);
      }
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

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

            <div className="modal-games-layout">
              {/* Left Column: Featured Main Card (Ball Striker Challenge) */}
              <div className="modal-featured-card">
                <div className="featured-banner-wrapper">
                  <img src="/ball_striker_banner.png" alt="Ball Striker Challenge" className="featured-banner-img" />
                </div>
                
                <div className="featured-card-body">
                  <h3 className="featured-card-title">Ball Striker Challenge</h3>
                  <p className="featured-card-desc">
                    Physics-driven shooting game. Slingshot or swipe the ball, hit the top net or hoop, and switch ball skins!
                  </p>
                  
                  <button 
                    type="button" 
                    className="modal-launch-btn"
                    onClick={() => {
                      setSelectedGame('football');
                      setIsGameSelectorOpen(false);
                      resetBallPosition();
                    }}
                  >
                    Launch Game 🎯
                  </button>
                </div>
              </div>

              {/* Right Column: Stacked Secondary Cards */}
              <div className="modal-secondary-column">
                {/* Game 2: F1 Speed Sprint */}
                <div className="modal-compact-card f1-card">
                  <div>
                    <div className="compact-card-top">
                      <span className="compact-card-icon">🏎️</span>
                      <span className="modal-status-badge status-live">Live Playable</span>
                    </div>
                    <h3 className="compact-card-title">F1 Speed Sprint</h3>
                    <p className="compact-card-desc">
                      3D Grand Prix arcade racer inspired by Super Star Car. Battle 7 AI rivals, hit curves, activate DRS Nitro, and claim P1!
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="modal-launch-btn"
                    onClick={() => {
                      setSelectedGame('f1');
                      setIsGameSelectorOpen(false);
                    }}
                  >
                    Launch F1 Sprint 🏎️
                  </button>
                </div>

                {/* Game 3: Sky Strike: Fighter Jet */}
                <div className="modal-compact-card jet-card">
                  <div>
                    <div className="compact-card-top">
                      <span className="compact-card-icon">✈️</span>
                      <span className="modal-status-badge status-live">Live Playable</span>
                    </div>
                    <h3 className="compact-card-title">Sky Strike: Fighter Jet</h3>
                    <p className="compact-card-desc">
                      Supersonic aerial combat shooter. Engage enemy squadrons, dodge barrages, collect weapon upgrades, and defeat bosses!
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="modal-launch-btn"
                    onClick={() => {
                      setSelectedGame('jet');
                      setIsGameSelectorOpen(false);
                    }}
                  >
                    Launch Sky Strike ✈️
                  </button>
                </div>
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
          ACTIVE GAME ARENA: BALL STRIKER, F1 SPRINT, OR FIGHTER JET
      ==================================================== */}
      <section className="arcade-cabinet">
        {selectedGame === 'football' && (
          <>
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

                <button
                  type="button"
                  className="hud-btn switch-game-btn"
                  onClick={() => setSelectedGame('f1')}
                  title="Switch to F1 Speed Sprint"
                >
                  🏎️ Play F1 Race
                </button>

                <button
                  type="button"
                  className="hud-btn switch-game-btn"
                  onClick={() => setSelectedGame('jet')}
                  title="Switch to Sky Strike: Fighter Jet"
                >
                  ✈️ Play Fighter Jet
                </button>
              </div>
            </div>

            {/* The Stadium Pitch Court */}
            <div 
              ref={arenaRef} 
              className="pitch-arena-container"
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
                <div className={`pitch-goal-post ${netShaking ? 'shake' : ''}`}>
                  <div className="pitch-goal-netting"></div>
                </div>
              ) : (
                <div className={`pitch-basketball-hoop ${netShaking ? 'shake' : ''}`}>
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
                ref={wrapperRef}
                className="arena-ball-wrapper"
                style={{ userSelect: 'none', WebkitTouchCallout: 'none' }}
              >
                {/* Slingshot Aim Indicator Arrow */}
                <div 
                  ref={aimLineRef}
                  className="slingshot-aim-line"
                  style={{ display: 'none' }}
                />

                <div 
                  ref={ballRef}
                  className={`arena-ball ${isCharging ? 'charging' : ''}`}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onContextMenu={(e) => e.preventDefault()}
                  title="Click or pull back to shoot! Double click to switch ball skin!"
                  style={{ touchAction: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
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
          </>
        )}

        {selectedGame === 'f1' && (
          <>
            <div className="cabinet-top-hud">
              <div className="cabinet-title-box">
                <span className="cabinet-icon">🏎️</span>
                <div>
                  <h2 className="cabinet-game-title">F1 Speed Sprint: Super Star Car</h2>
                </div>
                <span className="cabinet-tag">Live Playable</span>
              </div>

              <div className="cabinet-hud-controls">
                <button
                  type="button"
                  className="hud-btn switch-game-btn"
                  onClick={() => {
                    setSelectedGame('football');
                    resetBallPosition();
                  }}
                  title="Switch to Football"
                >
                  ⚽ Play Football
                </button>

                <button
                  type="button"
                  className="hud-btn switch-game-btn"
                  onClick={() => setSelectedGame('jet')}
                  title="Switch to Sky Strike: Fighter Jet"
                >
                  ✈️ Play Fighter Jet
                </button>

                <button
                  type="button"
                  className="hud-btn"
                  onClick={() => setIsGameSelectorOpen(true)}
                  title="Select Game Modal"
                >
                  🕹️ Game Menu
                </button>
              </div>
            </div>

            <F1RaceGame onBackToMenu={() => setIsGameSelectorOpen(true)} />
          </>
        )}

        {selectedGame === 'jet' && (
          <>
            <div className="cabinet-top-hud">
              <div className="cabinet-title-box">
                <span className="cabinet-icon">✈️</span>
                <div>
                  <h2 className="cabinet-game-title">Sky Strike: Fighter Jet</h2>
                </div>
                <span className="cabinet-tag">Live Playable</span>
              </div>

              <div className="cabinet-hud-controls">
                <button
                  type="button"
                  className="hud-btn switch-game-btn"
                  onClick={() => {
                    setSelectedGame('football');
                    resetBallPosition();
                  }}
                  title="Switch to Football"
                >
                  ⚽ Play Football
                </button>

                <button
                  type="button"
                  className="hud-btn switch-game-btn"
                  onClick={() => setSelectedGame('f1')}
                  title="Switch to F1 Speed Sprint"
                >
                  🏎️ Play F1 Race
                </button>

                <button
                  type="button"
                  className="hud-btn"
                  onClick={() => setIsGameSelectorOpen(true)}
                  title="Select Game Modal"
                >
                  🕹️ Game Menu
                </button>
              </div>
            </div>

            <FighterJetGame onBackToFootball={() => {
              setSelectedGame('football');
              resetBallPosition();
            }} />
          </>
        )}
      </section>

      {/* ====================================================
          GAME PIPELINE SHOWCASE
      ==================================================== */}
      <section className="pipeline-section">
        <div className="pipeline-header">
          <span className="pipeline-tag">Featured Games</span>
          <h2 className="pipeline-title">Playable Arcade Library</h2>
        </div>

        <div className="pipeline-grid">
          <div className="pipeline-card">
            <div>
              <div className="pipeline-card-top">
                <span className="pipeline-card-icon">🏎️</span>
                <span className="modal-status-badge status-live">Live Playable</span>
              </div>
              <h3 className="pipeline-card-title">F1 Speed Sprint: Super Star Car</h3>
              <p className="pipeline-card-desc">
                High-speed 3D Grand Prix racer with realistic banked curves, 7 AI rival cars, DRS Nitro, and synthesized V10 engine roar.
              </p>
            </div>
            <div className="pipeline-tags">
              <span className="pipeline-tag-pill">3D Pseudo-Engine</span>
              <span className="pipeline-tag-pill">AI F1 Grid</span>
              <span className="pipeline-tag-pill">V10 Audio FX</span>
              <span className="pipeline-tag-pill">DRS Boost</span>
            </div>
          </div>

          <div className="pipeline-card">
            <div>
              <div className="pipeline-card-top">
                <span className="pipeline-card-icon">✈️</span>
                <span className="modal-status-badge status-live">Live Playable</span>
              </div>
              <h3 className="pipeline-card-title">Sky Strike: Fighter Jet</h3>
              <p className="pipeline-card-desc">
                Supersonic aerial combat shooter with enemy squadrons, plasma upgrades, synthesized audio, and ace boss battles!
              </p>
            </div>
            <div className="pipeline-tags">
              <span className="pipeline-tag-pill">Canvas 2D</span>
              <span className="pipeline-tag-pill">Arcade Shooter</span>
              <span className="pipeline-tag-pill">Web Audio FX</span>
              <span className="pipeline-tag-pill">Boss Battles</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Arcade;
