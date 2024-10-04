import { useRef, useEffect } from 'react';

const useAnimationLoop = (callback) => {
  const requestRef = useRef();
  const lastTimeRef = useRef(0);

  const loop = (time) => {
    // Calculate deltaTime (in seconds)
    const deltaTime = (time - lastTimeRef.current) / 1000; 
    lastTimeRef.current = time;

    // Call the animation callback
    callback(time / 1000, deltaTime);

    // Request the next frame
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    // Start the loop
    requestRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(requestRef.current); // Cleanup on unmount
  }, [callback]); // Re-run only when callback changes
};

export default useAnimationLoop;
