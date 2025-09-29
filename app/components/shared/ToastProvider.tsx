"use client";
import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

export type ToastOptions = {
  severity?: AlertColor;
  duration?: number;
};

type ToastContextValue = {
  toast: (message: string, options?: ToastOptions) => void;
};

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState<AlertColor>("info");
  const [duration, setDuration] = React.useState<number | null>(4000);

  const toast = React.useCallback((msg: string, opts?: ToastOptions) => {
    setMessage(msg);
    setSeverity(opts?.severity ?? "info");
    setDuration(typeof opts?.duration === "number" ? opts.duration : 4000);
    setOpen(true);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={duration ?? undefined}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
