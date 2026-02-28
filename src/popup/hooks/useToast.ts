import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMessage(null);
    }, 3000);
  }, []);

  const dismissToast = useCallback(() => {
    clearTimeout(timerRef.current);
    setMessage(null);
  }, []);

  return { message, showToast, dismissToast };
}
