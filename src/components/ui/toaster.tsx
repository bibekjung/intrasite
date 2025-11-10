import * as React from 'react';
import { Toast } from './toast';
import { createPortal } from 'react-dom';

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToasterContextType {
  toasts: ToastData[];
  toast: (data: Omit<ToastData, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToasterContext = React.createContext<ToasterContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error('useToast must be used within ToasterProvider');
  }
  return context;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const toast = React.useCallback((data: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastData = { ...data, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({ toasts, toast, dismiss }),
    [toasts, toast, dismiss],
  );

  return (
    <ToasterContext.Provider value={value}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className="pointer-events-none fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
            {toasts.map((toastData) => (
              <div
                key={toastData.id}
                className="pointer-events-auto mb-2 animate-in slide-in-from-top-full sm:slide-in-from-bottom-full"
              >
                <Toast {...toastData} onClose={() => dismiss(toastData.id)} />
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToasterContext.Provider>
  );
}
