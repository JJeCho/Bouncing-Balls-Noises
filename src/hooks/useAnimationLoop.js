import { useRef, useEffect } from 'react';

const useAnimationLoop = (callback) => {
  const requestRef = useRef();
  const lastTimeRef = useRef(0);

  const loop = (time) => {
    const deltaTime = (time - lastTimeRef.current) / 1000; 
    lastTimeRef.current = time;
    callback(time / 1000, deltaTime);
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
};

export default useAnimationLoop;
