import React, { useState, useEffect, useRef } from 'react';
import './Football.css';

const Football = () => {
  const wrapperRef = useRef(null);
  const ballRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const animationRef = useRef(null);
  const chargeStartTimeRef = useRef(0);
  const swipeStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isSwipingRef = useRef(false);
  
  const [isCharging, setIsCharging] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [isGoal, setIsGoal] = useState(false);
  const [skinIndex, setSkinIndex] = useState(0);

  const lastTapTimeRef = useRef(0);

  const skins = [
    { type: 'football', url: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg" }, // Football
    { type: 'football', url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='white' stroke='%23ccc' stroke-width='1'/><path d='M30 30 Q50 10 70 30 T70 70 T30 70 T30 30' fill='none' stroke='%23ff004d' stroke-width='6'/><path d='M20 50 Q50 80 80 50' fill='none' stroke='%2300f0ba' stroke-width='6'/><text x='50' y='58' font-size='22' font-family='Arial, sans-serif' font-weight='900' text-anchor='middle' fill='%23111'>2026</text></svg>" }, // FIFA 2026
    { type: 'basketball', url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%23ff7a00'/><path d='M50 2 L50 98 M2 50 L98 50 M15 15 Q40 50 15 85 M85 15 Q60 50 85 85' fill='none' stroke='%23333' stroke-width='2.5'/></svg>" } // Basketball
  ];

  const ballSize = 60; // Size of the football in pixels
  const goalWidth = 250;
  const goalHeight = 80;

  // Set initial position (bottom right corner)
  useEffect(() => {
    const initPos = () => {
      if (!isMovingRef.current && wrapperRef.current) {
        const x = window.innerWidth - ballSize - 30; 
        const y = window.innerHeight - ballSize - 30;
        positionRef.current = { x, y };
        wrapperRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    
    initPos();
    window.addEventListener('resize', initPos);
    
    return () => window.removeEventListener('resize', initPos);
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    if (isGoal) return; // Cannot shoot while goal animation is playing

    const now = Date.now();
    if (now - lastTapTimeRef.current < 300) {
      // Double tap detected!
      setSkinIndex((prev) => (prev + 1) % skins.length);
      lastTapTimeRef.current = 0; // Reset
      // Stop any movement just in case
      isMovingRef.current = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      velocityRef.current = { x: 0, y: 0 };
      setShowGoal(false);
      setIsCharging(false);
      return; 
    }
    lastTapTimeRef.current = now;
    
    // Stop current movement when grabbed
    isMovingRef.current = false;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    velocityRef.current = { x: 0, y: 0 };
    
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      swipeStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      isSwipingRef.current = true;
    } 
    
    // Always start charging (slingshot) as a fallback
    chargeStartTimeRef.current = Date.now();
    setIsCharging(true);
    setShowGoal(true);
  };

  const handlePointerUp = (e) => {
    if (e.cancelable) e.preventDefault();

    if (isSwipingRef.current && (e.pointerType === 'touch' || e.pointerType === 'pen')) {
      isSwipingRef.current = false;
      const endX = e.clientX;
      const endY = e.clientY;
      const swipeDx = endX - swipeStartRef.current.x;
      const swipeDy = endY - swipeStartRef.current.y;
      const dt = Math.max(1, Date.now() - swipeStartRef.current.time);
      
      // If it was a clear swipe (fast enough and moved enough distance)
      if (dt < 1000 && (Math.abs(swipeDx) >= 15 || Math.abs(swipeDy) >= 15)) {
        const swipeMultiplier = 15; 
        let vx = (swipeDx / dt) * swipeMultiplier;
        let vy = (swipeDy / dt) * swipeMultiplier;
        
        const maxSpeed = window.innerWidth < 768 ? 35 : 50;
        const currentSpeed = Math.sqrt(vx * vx + vy * vy);
        if (currentSpeed > maxSpeed) {
           vx = (vx / currentSpeed) * maxSpeed;
           vy = (vy / currentSpeed) * maxSpeed;
        }
        
        velocityRef.current = { x: vx, y: vy };
        setIsCharging(false);
      } else {
        // Fallback to slingshot if they just held it
        executeSlingshot(e);
      }
    } else if (isCharging) {
      // Slingshot logic for mouse
      executeSlingshot(e);
    } else {
      return;
    }

    setShowGoal(true);
    isMovingRef.current = true;
    animate();
  };

  const executeSlingshot = (e) => {
    setIsCharging(false);
    const holdDuration = Math.min(Date.now() - chargeStartTimeRef.current, 1500);
    const powerMultiplier = 0.5 + (holdDuration / 1500) * 1.5; 

    const rect = ballRef.current.getBoundingClientRect();
    const ballCenterX = rect.left + ballSize / 2;
    const ballCenterY = rect.top + ballSize / 2;
    
    const dx = e.clientX - ballCenterX;
    const dy = e.clientY - ballCenterY;
    
    // If just a tiny tap directly on the center, cancel
    if (Math.abs(dx) < 5 && Math.abs(dy) < 5 && holdDuration < 200) {
      setShowGoal(false);
      velocityRef.current = { x: 0, y: 0 };
      return;
    }
    
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / distance;
    const ny = dy / distance;
    
    const baseSpeed = window.innerWidth < 768 ? 22 : 35;
    const speed = baseSpeed * powerMultiplier;
    velocityRef.current = { x: -nx * speed, y: -ny * speed };
  };

  // If pointer leaves the ball while dragging, we still want to fire
  useEffect(() => {
    const handleGlobalPointerUp = (e) => {
      if (isCharging || isSwipingRef.current) handlePointerUp(e);
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isCharging]);

  // Hide goal post on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showGoal && !isGoal) {
        setShowGoal(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showGoal, isGoal]);

  const animate = () => {
    let { x, y } = positionRef.current;
    let { x: vx, y: vy } = velocityRef.current;

    const gravity = 0.35; 
    const bounceFriction = 0.85; 
    const airFriction = 0.995; 
    const groundFriction = 0.96; 

    vy += gravity; 
    vx *= airFriction; 

    x += vx;
    y += vy;

    // Window bounds collision detection
    if (x <= 0) {
      x = 0;
      vx = -vx * bounceFriction;
    } else if (x + ballSize >= window.innerWidth) {
      x = window.innerWidth - ballSize;
      vx = -vx * bounceFriction;
    }

    if (y <= 0) {
      y = 0;
      vy = -vy * bounceFriction;
    } else if (y + ballSize >= window.innerHeight) {
      y = window.innerHeight - ballSize;
      
      if (Math.abs(vy) < gravity * 1.5) {
        vy = 0;
      } else {
        vy = -vy * bounceFriction;
      }
      vx *= groundFriction; 
    }

    // Goal collision detection
    // Show goal is true, y is hitting top of screen, x is within goal bounds
    if (showGoal && !isGoal) {
       const goalLeft = window.innerWidth / 2 - goalWidth / 2;
       const goalRight = window.innerWidth / 2 + goalWidth / 2;
       
       // If ball's center is within goal width and hits the top 80 pixels
       if (y <= goalHeight && (x + ballSize/2) >= goalLeft && (x + ballSize/2) <= goalRight) {
          triggerGoal();
       }
    }

    // Stop completely if moving very slowly and on the ground
    if (y >= window.innerHeight - ballSize && Math.abs(vy) === 0 && Math.abs(vx) < 0.1) {
      y = window.innerHeight - ballSize;
      vy = 0;
      vx = 0;
      isMovingRef.current = false;
      setShowGoal(false);
    }

    positionRef.current = { x, y };
    velocityRef.current = { x: vx, y: vy };

    if (wrapperRef.current && ballRef.current) {
      wrapperRef.current.style.transform = `translate(${x}px, ${y}px)`;
      
      const currentRotation = parseFloat(ballRef.current.dataset.rotation || '0');
      const speed = Math.sqrt(vx * vx + vy * vy);
      const rotationSpeed = vx > 0 ? speed : -speed;
      const newRotation = currentRotation + rotationSpeed;
      
      ballRef.current.dataset.rotation = newRotation;
      ballRef.current.style.transform = `rotate(${newRotation}deg)`;
    }

    if (isMovingRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const triggerGoal = () => {
    setIsGoal(true);
    // Add an extra little bounce off the net
    velocityRef.current.vy = Math.abs(velocityRef.current.vy) * 0.5; // bounce down
    velocityRef.current.vx *= 0.5; // lose horizontal speed
    
    // Hide goal and text after 3 seconds
    setTimeout(() => {
      setIsGoal(false);
      setShowGoal(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {showGoal && skins[skinIndex].type === 'football' && (
        <div className="football-goal-post">
          <div className="goal-net"></div>
        </div>
      )}

      {showGoal && skins[skinIndex].type === 'basketball' && (
        <div className="basketball-hoop-container">
          <div className="basketball-backboard"></div>
          <div className="basketball-hoop">
            <div className="basketball-net"></div>
          </div>
        </div>
      )}
      
      {isGoal && (
        <div className="goal-celebration">
          <h1>{skins[skinIndex].type === 'basketball' ? 'SWISH!!' : 'GOAL!!'}</h1>
        </div>
      )}

      <div 
        ref={wrapperRef}
        className="interactive-football-wrapper"
      >
        <div 
          ref={ballRef}
          className={`interactive-football ${isCharging ? 'charging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          title="Double-click to change skin! Hold to shoot!"
          style={{ touchAction: 'none' }} // Prevent scrolling while charging on mobile
        >
          <img 
            src={skins[skinIndex].url} 
            alt={`${skins[skinIndex].type} Skin`} 
            draggable="false"
          />
        </div>
      </div>
    </>
  );
};

export default Football;
