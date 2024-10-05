/* src/config.js */


import soundAb1 from './assets/Ab1.mp3';
import soundAb2 from './assets/Ab2.mp3';
import soundAb3 from './assets/Ab3.mp3';
import soundAb4 from './assets/Ab4.mp3';
import soundAb5 from './assets/Ab5.mp3';
import soundAb6 from './assets/Ab6.mp3';
import soundAb7 from './assets/Ab7.mp3';
import soundA0 from './assets/A0.mp3';
import soundA1 from './assets/A1.mp3';
import soundA2 from './assets/A2.mp3';
import soundA3 from './assets/A3.mp3';
import soundA4 from './assets/A4.mp3';
import soundA5 from './assets/A5.mp3';
import soundA6 from './assets/A6.mp3';
import soundA7 from './assets/A7.mp3';
import soundBb0 from './assets/Bb0.mp3';
import soundBb1 from './assets/Bb1.mp3';
import soundBb2 from './assets/Bb2.mp3';
import soundBb3 from './assets/Bb3.mp3';
import soundBb4 from './assets/Bb4.mp3';
import soundBb5 from './assets/Bb5.mp3';
import soundBb6 from './assets/Bb6.mp3';
import soundBb7 from './assets/Bb7.mp3';
import soundB0 from './assets/B0.mp3';
import soundB1 from './assets/B1.mp3';
import soundB2 from './assets/B2.mp3';
import soundB3 from './assets/B3.mp3';
import soundB4 from './assets/B4.mp3';
import soundB5 from './assets/B5.mp3';
import soundB6 from './assets/B6.mp3';
import soundB7 from './assets/B7.mp3';
import soundC1 from './assets/C1.mp3';
import soundC2 from './assets/C2.mp3';
import soundC3 from './assets/C3.mp3';
import soundC4 from './assets/C4.mp3';
import soundC5 from './assets/C5.mp3';
import soundC6 from './assets/C6.mp3';
import soundC7 from './assets/C7.mp3';
import soundDb1 from './assets/Db1.mp3';
import soundDb2 from './assets/Db2.mp3';
import soundDb3 from './assets/Db3.mp3';
import soundDb4 from './assets/Db4.mp3';
import soundDb5 from './assets/Db5.mp3';
import soundDb6 from './assets/Db6.mp3';
import soundDb7 from './assets/Db7.mp3';
import soundD1 from './assets/D1.mp3';
import soundD2 from './assets/D2.mp3';
import soundD3 from './assets/D3.mp3';
import soundD4 from './assets/D4.mp3';
import soundD5 from './assets/D5.mp3';
import soundD6 from './assets/D6.mp3';
import soundD7 from './assets/D7.mp3';
import soundEb1 from './assets/Eb1.mp3';
import soundEb2 from './assets/Eb2.mp3';
import soundEb3 from './assets/Eb3.mp3';
import soundEb4 from './assets/Eb4.mp3';
import soundEb5 from './assets/Eb5.mp3';
import soundEb6 from './assets/Eb6.mp3';
import soundEb7 from './assets/Eb7.mp3';
import soundE1 from './assets/E1.mp3';
import soundE2 from './assets/E2.mp3';
import soundE3 from './assets/E3.mp3';
import soundE4 from './assets/E4.mp3';
import soundE5 from './assets/E5.mp3';
import soundE6 from './assets/E6.mp3';
import soundE7 from './assets/E7.mp3';
import soundF1 from './assets/F1.mp3';
import soundF2 from './assets/F2.mp3';
import soundF3 from './assets/F3.mp3';
import soundF4 from './assets/F4.mp3';
import soundF5 from './assets/F5.mp3';
import soundF6 from './assets/F6.mp3';
import soundF7 from './assets/F7.mp3';
import soundGb1 from './assets/Gb1.mp3';
import soundGb2 from './assets/Gb2.mp3';
import soundGb3 from './assets/Gb3.mp3';
import soundGb4 from './assets/Gb4.mp3';
import soundGb5 from './assets/Gb5.mp3';
import soundGb6 from './assets/Gb6.mp3';
import soundGb7 from './assets/Gb7.mp3';
import soundG1 from './assets/G1.mp3';
import soundG2 from './assets/G2.mp3';
import soundG3 from './assets/G3.mp3';
import soundG4 from './assets/G4.mp3';
import soundG5 from './assets/G5.mp3';
import soundG6 from './assets/G6.mp3';
import soundG7 from './assets/G7.mp3';

export const DEFAULT_BALL = {
  radius: 5,
  speed: 100,
  color: '#FF0000',
};

export const MAX_BALLS = 100;
export const MAX_NEW_BALLS_PER_FRAME = 2;
export const CREATION_INTERVAL = 5;
export const COOLDOWN_DURATION = 0.1;
export const MIN_VELOCITY = 50;
export const MAX_SPEED = 500;


export const CIRCLE_RADIUS = 250;
export const START_ANGLE = 0;
export const END_ANGLE = 10;



export const COLLISION_SOUNDS = [
  soundA0, soundA1, soundA2, soundA3, soundA4, soundA5, soundA6, soundA7,
  soundAb1, soundAb2, soundAb3, soundAb4, soundAb5, soundAb6, soundAb7,
  soundBb0, soundBb1, soundBb2, soundBb3, soundBb4, soundBb5, soundBb6, soundBb7,
  soundB0, soundB1, soundB2, soundB3, soundB4, soundB5, soundB6, soundB7,
  soundC1, soundC2, soundC3, soundC4, soundC5, soundC6, soundC7,
  soundDb1, soundDb2, soundDb3, soundDb4, soundDb5, soundDb6, soundDb7,
  soundD1, soundD2, soundD3, soundD4, soundD5, soundD6, soundD7,
  soundEb1, soundEb2, soundEb3, soundEb4, soundEb5, soundEb6, soundEb7,
  soundE1, soundE2, soundE3, soundE4, soundE5, soundE6, soundE7,
  soundF1, soundF2, soundF3, soundF4, soundF5, soundF6, soundF7,
  soundGb1, soundGb2, soundGb3, soundGb4, soundGb5, soundGb6, soundGb7,
  soundG1, soundG2, soundG3, soundG4, soundG5, soundG6, soundG7
];

