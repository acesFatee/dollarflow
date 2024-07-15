import { useState, useEffect, useCallback } from "react";

export function useDebounce(callback, delay) {
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const debouncedFunction = useCallback((...args) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      callback(...args);
    }, delay);
    setDebounceTimeout(timeout);
  }, [callback, delay, debounceTimeout]);

  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  return debouncedFunction;
} 
