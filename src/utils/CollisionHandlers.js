/* src/utils/CollisionHandlers.jsx */

import { add, subtract, multiply, normalize, magnitude } from './VectorUtils';
import { MAX_SPEED, MIN_VELOCITY } from '../config';

export const clampVelocity = (velocity) => {
  const speed = magnitude(velocity);
  if (speed > MAX_SPEED) {
    return multiply(normalize(velocity), MAX_SPEED);
  }
  return velocity;
};

export const increaseSpeed = (velocity, factor = 1.05) => {
  const speed = magnitude(velocity) * factor;
  const normalized = normalize(velocity);
  return multiply(normalized, speed);
};

export const playRandomBounceSound = (audioElements) => {
  if (!audioElements.length) return;

  const randomIndex = Math.floor(Math.random() * audioElements.length);
  const selectedAudio = audioElements[randomIndex];
  if (selectedAudio) {
    selectedAudio.currentTime = 0;
    selectedAudio
      .play()
      .catch((error) => {
        console.error('Audio playback failed:', error);
      });
  }
};


export const changeColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};


export const areBallsColliding = (ball1, ball2) => {
  const distance = magnitude(subtract(ball1.position, ball2.position));
  return distance <= ball1.size + ball2.size;
};

export const handleBallCollision = (ballA, ballB) => {
  const posA = ballA.position;
  const posB = ballB.position;
  const velA = ballA.velocity;
  const velB = ballB.velocity;

  const deltaPos = subtract(posA, posB);
  const distanceSquared = magnitude(deltaPos) ** 2;

  if (distanceSquared === 0) {
    deltaPos.x = Math.random() * 0.01;
    deltaPos.y = Math.random() * 0.01;
  }

  const deltaVel = subtract(velA, velB);
  const dotProduct = (deltaVel.x * deltaPos.x + deltaVel.y * deltaPos.y) / distanceSquared;

  const collisionScale = dotProduct;
  const collisionVector = multiply(deltaPos, collisionScale);

const ensureMinimumVelocity = (velocity) => {
  const speed = magnitude(velocity);
  if (speed < MIN_VELOCITY) {
    const scale = MIN_VELOCITY / speed;
    return multiply(velocity, scale);
  }
  return velocity;
};

const newVelA = ensureMinimumVelocity(subtract(velA, collisionVector));
const newVelB = ensureMinimumVelocity(add(velB, collisionVector));

  return { ball1: newVelA, ball2: newVelB };
};