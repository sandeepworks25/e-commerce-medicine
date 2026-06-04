/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed inset-x-3 top-24 z-[100] space-y-3 sm:inset-x-auto sm:right-4 sm:top-4 sm:w-96">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      case 'error':
        return 'bg-rose-50 text-rose-800 border border-rose-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border border-amber-200';
      default:
        return 'bg-sky-50 text-sky-800 border border-sky-200';
    }
  };

  return (
    <div className={`${getStyles()} flex w-full items-start gap-3 rounded-lg p-4 shadow-xl shadow-slate-900/10 ring-1 ring-white/80`}>
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <p className="flex-1 text-sm font-semibold leading-5">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded-md p-1 text-current/60 hover:bg-white/60 hover:text-current"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
