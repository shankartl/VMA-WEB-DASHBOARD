import { useCallback, useEffect } from "react";

/**
 * Debounced State Effect. Useful for type ahead API search.
 * @param {Function} effect
 * @param {Number} delay
 * @param {Array} deps
 */
export const useDebouncedEffect = (effect, delay, deps) => {
  const callback = useCallback(effect, [...deps, effect]);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
};
