import { ShoppingCart, Heart, Search } from 'lucide-react';

const EmptyState = ({ type = 'default', title, description, actionText, onAction }) => {
  const getIcon = () => {
    switch (type) {
      case 'cart':
        return <ShoppingCart size={64} className="text-gray-300" />;
      case 'wishlist':
        return <Heart size={64} className="text-gray-300" />;
      case 'search':
        return <Search size={64} className="text-gray-300" />;
      default:
        return <ShoppingCart size={64} className="text-gray-300" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4">
        {getIcon()}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
