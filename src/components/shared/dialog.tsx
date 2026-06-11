"use client";

import { createContext, useContext, type ReactNode } from "react";

type DialogContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog>");
  }
  return context;
}

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => onOpenChange(false)}
        />

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white bg-black shadow-xl">
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-white/20 px-6 py-4">
      <h2 className="text-lg font-semibold text-white">{children}</h2>
    </div>
  );
}

export function DialogContent({ children }: { children: ReactNode }) {
  return <div className="px-6 py-4">{children}</div>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end gap-3 border-t border-white/20 px-6 py-4">
      {children}
    </div>
  );
}

type DialogButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function DialogAcceptButton({
  children,
  onClick,
  type = "button",
  disabled,
}: DialogButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-200 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function DialogCancelButton({
  children,
  onClick,
  type = "button",
  disabled,
}: DialogButtonProps) {
  const { setOpen } = useDialogContext();

  return (
    <button
      type={type}
      onClick={onClick ?? (() => setOpen(false))}
      disabled={disabled}
      className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
