import { useNavigate } from 'react-router-dom';
import { useWishlistStore, useCartStore } from '../store/index.js';
import { useToast } from '../components/common/Toast';
import EmptyState from '../components/common/EmptyState';
import ProductCard from '../components/products/ProductCard';

const Wishlist = () => {
  const navigate = useNavigate();
  const { items, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { addToast } = useToast();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    addToast('Moved to cart', 'success');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 py-8 sm:px-4 sm:py-12">
          <EmptyState
            type="wishlist"
            title="Your Wishlist is Empty"
            description="Save your favorite products to the wishlist and review them later"
            actionText="Continue Shopping"
            onAction={() => navigate('/products')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-5 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <h1 className="mb-5 text-2xl font-bold md:mb-8 md:text-3xl">My Wishlist</h1>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {items.map(product => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => handleMoveToCart(product)}
                className="mt-2 w-full btn-primary text-center text-xs sm:text-sm"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
