import { useEffect } from 'react';

export default function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      window.addEventListener("mousedown", listener);
      window.addEventListener("touchstart", listener);
      return () => {
        window.removeEventListener("mousedown", listener);
        window.removeEventListener("touchstart", listener);
      };
    },
    [ref, handler]
  );
}
