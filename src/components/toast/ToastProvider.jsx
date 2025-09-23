import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import "./toast.css";

export const ToastContext = createContext(null);

let idCounter = 0;

const DEFAULT_DURATION = 5000;

export function ToastProvider({ children, position = "bottom-right" }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timersRef.current[id];
    }
  }, []);

  const show = useCallback((message, { type = "info", duration = DEFAULT_DURATION } = {}) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      timersRef.current[id] = setTimeout(() => remove(id), duration);
    }
    return id;
  }, [remove]);

  const api = useMemo(() => ({
    show,
    success: (msg, opts) => show(msg, { ...(opts || {}), type: "success" }),
    error: (msg, opts) => show(msg, { ...(opts || {}), type: "error" }),
    info: (msg, opts) => show(msg, { ...(opts || {}), type: "info" }),
    warning: (msg, opts) => show(msg, { ...(opts || {}), type: "warning" }),
    remove,
  }), [show, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={`toast-container ${position}`} role="region" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <div className="toast-message">{t.message}</div>
            <button className="toast-close" onClick={() => remove(t.id)} aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
