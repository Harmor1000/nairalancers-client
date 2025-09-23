import { useContext } from "react";
import { ToastContext } from "./ToastProvider";

export default function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    const noop = () => {};
    return {
      show: noop,
      success: noop,
      error: noop,
      info: noop,
      warning: noop,
      remove: noop,
    };
  }
  return ctx;
}
