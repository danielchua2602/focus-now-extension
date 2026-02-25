import type { ReactNode } from 'react';

import Toast from './Toast';

interface ModalBaseProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  error?: string | null;
  onErrorClose?: () => void;
}

export default function ModalBase({
  open,
  title,
  onClose,
  children,
  error,
  onErrorClose,
}: ModalBaseProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-10">
      {error && onErrorClose && (
        <Toast message={error} type="error" onClose={onErrorClose} />
      )}
      <div className="relative w-full max-w-md bg-surface p-6 shadow-md">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary transition-colors hover:text-text-primary"
          >
            ✕
          </button>
        </div>
        {/* Modal content */}
        {children}
      </div>
    </div>
  );
}
