import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-slate-950/25 backdrop-blur-md" onClick={onClose} />
      <div className={`relative max-h-[92vh] w-full overflow-hidden rounded-t-lg bg-white shadow-xl sm:mx-4 sm:rounded-lg ${sizeClasses[size]}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(92vh-56px)] overflow-y-auto px-4 py-4 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
