import { useEffect, useRef } from 'react';

export default function useEventListener(eventName, handler, element = window, options) {
  const savedHandler = useRef();

  // Update ref if handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Resolve element if it's a ref object
    const target = element && element.current ? element.current : element;

    if (!(target && target.addEventListener)) return;

    const eventListener = event => savedHandler.current?.(event);

    target.addEventListener(eventName, eventListener, options || { passive: true });

    return () => {
      target.removeEventListener(eventName, eventListener, options || { passive: true });
    };
  }, [eventName, element, options]);
}
