interface ToastProps {
  message: string | null;
  type: 'error' | 'success';
  onClose?: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-error-light' : 'bg-success-light';
  const textColor =
    type === 'error' ? 'text-text-primary/80' : 'text-text-primary';

  return (
    <div
      className={`absolute left-4 right-4 top-10 ${bgColor} ${textColor} z-10 flex items-center justify-between rounded px-4 py-3 shadow-lg`}
    >
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-4 ${textColor} font-bold transition-opacity hover:opacity-70`}
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  );
}
