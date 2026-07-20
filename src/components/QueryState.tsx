interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function LoadingState({ label = 'Memuat' }: { label?: string }) {
  return (
    <div className="reveal card-surface p-10 text-center text-ink-400">
      <div className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-brand-300 animate-pulse" />
        {label}…
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="reveal card-surface p-10 text-center">
      <p className="text-ink-300">Gagal memuat data.</p>
      <p className="mt-1 text-xs text-ink-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs font-medium text-brand-300 hover:text-brand-200 transition"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
