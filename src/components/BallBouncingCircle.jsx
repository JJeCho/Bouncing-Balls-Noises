import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { add, multiply, normalize, magnitude, subtract, reflect } from '../utils/VectorUtils';
import {
  increaseSpeed,
  playRandomBounceSound,
  changeColor,
  handleBallCollision,
  areBallsColliding,
  clampVelocity,
} from '../utils/CollisionHandlers';
import {
  CreateOnAnyBounceMode,
  CreateOnSpecificAreaBounceMode,
  CreateAfterXSecondsMode,
} from '../utils/BallCreationModes';
import { COLLISION_SOUNDS, MAX_BALLS, DEFAULT_BALL, START_ANGLE, END_ANGLE, CREATION_INTERVAL, COOLDOWN_DURATION, MAX_NEW_BALLS_PER_FRAME } from '../config';
import useAnimationLoop from '../hooks/useAnimationLoop';
import Ball from './Ball';
import './BallBouncingCircle.css';

const BallBouncingCircle = () => {
  const [ballOnBallCollisionCreation, setBallOnBallCollisionCreation] = useState(false);
  const creationModeRef = useRef(null);
  const circleRef = useRef(null);
  const [selectedSounds, setSelectedSounds] = useState([]);
  const audioRefs = useRef([]);
  const [circleRadius, setCircleRadius] = useState(0);  // Track the dynamic circle radius

  const ballsRef = useRef([
    {
      id: uuidv4(),
      position: { x: 0, y: 0 },
      velocity: {
        x: DEFAULT_BALL.speed * (0.75 + Math.random() * 0.75),
        y: DEFAULT_BALL.speed * (0.75 + Math.random() * 0.75),
      },
      color: DEFAULT_BALL.color,
      size: DEFAULT_BALL.radius,
      sounds: audioRefs.current,
      lastCreationTime: 0,
    },
  ]);
  const [balls, setBalls] = useState(ballsRef.current);
  const [activeMode, setActiveMode] = useState('onAnyBounce');

  useLayoutEffect(() => {
    const updateCircleRadius = () => {
      if (circleRef.current) {
        const rect = circleRef.current.getBoundingClientRect();
        setCircleRadius(rect.width / 2);  // Use half of the circle's width for the radius
      }
    };
    updateCircleRadius();  // Calculate on mount
    window.addEventListener('resize', updateCircleRadius);  // Recalculate on resize
    return () => window.removeEventListener('resize', updateCircleRadius);
  }, []);

  useEffect(() => {
    if (selectedSounds.length > 0) {
      audioRefs.current = selectedSounds.map((soundSrc) => new Audio(soundSrc));
    } else {
      audioRefs.current = [];
    }
  }, [selectedSounds]);

  useEffect(() => {
    const initializeCreationMode = () => {
      switch (activeMode) {
        case 'onAnyBounce':
          creationModeRef.current = new CreateOnAnyBounceMode();
          break;
        case 'onSpecificAreaBounce':
          creationModeRef.current = new CreateOnSpecificAreaBounceMode({
            startAngle: START_ANGLE,
            endAngle: END_ANGLE,
          });
          break;
        case 'afterXSeconds':
          creationModeRef.current = new CreateAfterXSecondsMode(CREATION_INTERVAL);
          break;
        default:
          creationModeRef.current = new CreateOnAnyBounceMode();
      }
    };
    initializeCreationMode();
  }, [activeMode]);

  useEffect(() => {
    ballsRef.current = ballsRef.current.map((ball) => ({
      ...ball,
      sounds: audioRefs.current,
    }));
    setBalls([...ballsRef.current]);
  }, [audioRefs.current]);

  const generateNewBall = (existingBalls, maxAttempts = 50) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const angle = Math.random() * 2 * Math.PI;
      const spawnRadius = Math.random() * (circleRadius - DEFAULT_BALL.radius);
      const x = spawnRadius * Math.cos(angle);
      const y = spawnRadius * Math.sin(angle);
      const newBallPosition = { x, y };

      const distanceFromCenter = magnitude(newBallPosition);
      if (distanceFromCenter + DEFAULT_BALL.radius > circleRadius) continue;

      const isOverlapping = existingBalls.some((ball) => {
        const distance = magnitude(subtract(ball.position, newBallPosition));
        return distance <= ball.size + DEFAULT_BALL.radius + 2;
      });

      if (!isOverlapping) {
        return {
          id: uuidv4(),
          position: newBallPosition,
          velocity: {
            x: DEFAULT_BALL.speed * (0.75 + Math.random() * 0.75),
            y: DEFAULT_BALL.speed * (0.75 + Math.random() * 0.75),
          },
          color: changeColor(),
          size: DEFAULT_BALL.radius,
          sounds: audioRefs.current,
          lastCreationTime: 0,
        };
      }
    }

    console.warn('Failed to generate new ball after', maxAttempts, 'attempts');
    return null;
  };

  const canCreateBall = (lastCreationTime, currentTime) => currentTime - lastCreationTime >= COOLDOWN_DURATION;

  const animate = (time, deltaTime) => {
    if (!circleRadius) return; // Wait until the circle radius is calculated
    const currentTime = time * 1000; // Convert to milliseconds if necessary
    const deltaTimeMs = deltaTime * 1000; 
    let hasChanges = false; // Track if we need to update state
    let ballCount = ballsRef.current.length; // Track ball count to prevent excessive creation
  
    // Update ball positions and handle boundary reflection
    const updatedBalls = ballsRef.current.map((ball) => {
      const deltaPosition = multiply(ball.velocity, deltaTime);
      const newPos = add(ball.position, deltaPosition);
      const dist = magnitude(newPos);
  
      // Reflect the ball if it hits the boundary
      if (dist + ball.size >= circleRadius) {
        const normal = normalize(ball.position);
        ball.velocity = reflect(ball.velocity, normal);
        ball.velocity = clampVelocity(increaseSpeed(ball.velocity, 1.05));
        ball.position = multiply(normalize(ball.position), circleRadius - ball.size - 1);
        ball.color = changeColor();
        hasChanges = true; // Mark changes for state update
      }
      return { ...ball, position: newPos };
    });
  
    const newBalls = [];
    const collisionPairs = new Set();
  
    // Handle ball-on-ball collisions
    for (let i = 0; i < updatedBalls.length; i++) {
      for (let j = i + 1; j < updatedBalls.length; j++) {
        const ballA = updatedBalls[i];
        const ballB = updatedBalls[j];
        const pairKey = `${Math.min(ballA.id, ballB.id)}-${Math.max(ballA.id, ballB.id)}`;
  
        // Check if the pair has already been processed
        if (collisionPairs.has(pairKey)) continue;
  
        // Check if balls are colliding
        if (areBallsColliding(ballA, ballB)) {
          const { ball1: newVelocityA, ball2: newVelocityB } = handleBallCollision(ballA, ballB);
          ballA.velocity = clampVelocity(newVelocityA);
          ballB.velocity = clampVelocity(newVelocityB);
  
          playRandomBounceSound(ballA.sounds);
          playRandomBounceSound(ballB.sounds);
  
          // Separate the balls if they are overlapping
          const distanceBetween = magnitude(subtract(ballB.position, ballA.position));
          const overlap = ballA.size + ballB.size - distanceBetween;
  
          if (overlap > 0) {
            const collisionNormal = normalize(subtract(ballB.position, ballA.position));
            const adjustment = multiply(collisionNormal, overlap / 2 + 1);
            ballA.position = subtract(ballA.position, adjustment);
            ballB.position = add(ballB.position, adjustment);
          }
  
          // Optionally create a new ball during ball-on-ball collision
          if (
            ballOnBallCollisionCreation &&
            creationModeRef.current.shouldCreateBall(
              ballA,
              { position: ballA.position, normal: normalize(ballA.velocity) },
              currentTime
            ) &&
            ballCount + newBalls.length < MAX_BALLS &&
            newBalls.length < MAX_NEW_BALLS_PER_FRAME &&
            canCreateBall(ballA.lastCreationTime, currentTime)
          ) {
            const newBall = generateNewBall([...ballsRef.current, ...newBalls]);
            if (newBall) {
              newBall.lastCreationTime = currentTime;
              newBalls.push(newBall);
              ballCount++; // Increment ball count
              hasChanges = true; // Mark changes for state update
  
              // Update lastCreationTime for both balls involved in the collision
              ballA.lastCreationTime = currentTime;
              ballB.lastCreationTime = currentTime;
            }
          }
  
          // Add this pair to processed pairs
          collisionPairs.add(pairKey);
  
          // Limit the number of new balls per frame
          if (newBalls.length >= MAX_NEW_BALLS_PER_FRAME) {
            break;
          }
        }
      }
  
      // Break early if we've reached the max new balls per frame
      if (newBalls.length >= MAX_NEW_BALLS_PER_FRAME) {
        break;
      }
    }
  
    // Handle ball creation from boundary bounces
    if (ballCount < MAX_BALLS) {
      updatedBalls.forEach((ball) => {
        if (
          creationModeRef.current.shouldCreateBall(
            ball,
            { position: ball.position, normal: normalize(ball.velocity) },
            currentTime
          ) &&
          ballCount + newBalls.length < MAX_BALLS &&
          newBalls.length < MAX_NEW_BALLS_PER_FRAME &&
          canCreateBall(ball.lastCreationTime, currentTime)
        ) {
          const newBall = generateNewBall([...ballsRef.current, ...newBalls]);
          if (newBall) {
            newBall.lastCreationTime = currentTime;
            newBalls.push(newBall);
            ballCount++; // Increment ball count
            hasChanges = true; // Mark changes for state update
  
            // Update lastCreationTime for the ball that created the new ball
            ball.lastCreationTime = currentTime;
          }
        }
      });
    }
  
    // Ensure the new ball count doesn't exceed the limit
    const availableSlots = MAX_BALLS - updatedBalls.length;
    const limitedNewBalls = newBalls.slice(0, availableSlots);
  
    // Update state if any meaningful changes occurred
    if (hasChanges || limitedNewBalls.length > 0) {
      ballsRef.current = [...updatedBalls, ...limitedNewBalls];
      setBalls([...ballsRef.current]);
    }
  };
  
  

  useAnimationLoop(animate);

  const handleModeChange = (e) => setActiveMode(e.target.value);

  const handleSoundSelection = (sound) => {
    setSelectedSounds((prev) => (prev.includes(sound) ? prev.filter((s) => s !== sound) : [...prev, sound]));
  };

  return (
    <div className="main-container">
      {/* Mode and Sound Selectors */}
      <div className="mode-sound-container">
        <div className="mode-selector">
          <label>Select Ball Creation Mode:</label>
          <select value={activeMode} onChange={handleModeChange}>
            <option value="onAnyBounce">On Any Bounce</option>
            <option value="onSpecificAreaBounce">On Specific Area Bounce</option>
            <option value="afterXSeconds">After X Seconds</option>
          </select>
          <label>Create Balls when Balls Collide:</label>
          <input
            type="checkbox"
            checked={ballOnBallCollisionCreation}
            onChange={() => setBallOnBallCollisionCreation((prevState) => !prevState)}
          />
        </div>

        <div className="sound-selector">
          <label>Select Collision Sounds:</label>
          {COLLISION_SOUNDS.map((sound, index) => {
            const soundName = sound.split('/').pop().split('.')[0];
            return (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={selectedSounds.includes(sound)}
                  onChange={() => handleSoundSelection(sound)}
                />
                <label>{soundName}</label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Circle Container */}
      <div className="circle-container">
        <div className="circle" ref={circleRef}>
          {balls.map((ball) => (
            <Ball key={ball.id} position={ball.position} circleRadius={circleRadius} ballRadius={ball.size} color={ball.color} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BallBouncingCircle;
