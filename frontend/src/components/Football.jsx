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
  
  const [isCharging, setIsCharging] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [isGoal, setIsGoal] = useState(false);

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
    
    // Stop current movement when grabbed
    isMovingRef.current = false;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    velocityRef.current = { x: 0, y: 0 };
    chargeStartTimeRef.current = Date.now();
    setIsCharging(true);
    setShowGoal(true);
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    if (!isCharging) return;
    setIsCharging(false);

    // Calculate charge power (max 1.5 seconds)
    const holdDuration = Math.min(Date.now() - chargeStartTimeRef.current, 1500);
    // Base power + power based on time
    const powerMultiplier = 0.5 + (holdDuration / 1500) * 1.5; 

    // Calculate vector from ball center to cursor
    const rect = ballRef.current.getBoundingClientRect();
    const ballCenterX = rect.left + ballSize / 2;
    const ballCenterY = rect.top + ballSize / 2;
    
    const dx = e.clientX - ballCenterX;
    const dy = e.clientY - ballCenterY;
    
    // Normalize vector
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Shoot in OPPOSITE direction of cursor relative to ball center
    // Scale speed based on screen size so it isn't too fast on mobile
    const baseSpeed = window.innerWidth < 768 ? 22 : 35;
    const speed = baseSpeed * powerMultiplier;
    velocityRef.current = { x: -nx * speed, y: -ny * speed };

    setShowGoal(true);
    isMovingRef.current = true;
    animate();
  };

  // If pointer leaves the ball while dragging, we still want to fire
  useEffect(() => {
    const handleGlobalPointerUp = (e) => {
      if (isCharging) handlePointerUp(e);
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
      {showGoal && (
        <div className="football-goal-post">
          <div className="goal-net"></div>
        </div>
      )}
      
      {isGoal && (
        <div className="goal-celebration">
          <h1>GOAL!!</h1>
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
          title="Hold and release to shoot!"
          style={{ touchAction: 'none' }} // Prevent scrolling while charging on mobile
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Soccerball.svg" 
            alt="Football" 
            draggable="false"
          />
        </div>
      </div>
    </>
  );
};

export default Football;
