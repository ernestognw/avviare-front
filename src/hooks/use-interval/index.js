import { useEffect, useRef } from 'react';

const useInterval = (callback, delay, { skip = false, leading = false }) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => !skip && savedCallback.current();

    if (leading) tick();

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, leading, skip]);
};

export default useInterval;
