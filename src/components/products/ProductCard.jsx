import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { useCartStore, useWishlistStore } from '../../store/index.js';
import { useToast } from '../common/Toast.jsx';
import { formatCurrency, getDiscountPercentage } from '../../utils/helpers.js';

const ProductCard = ({ product }) => {
  const { items, addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToast();
  const inWishlist = isInWishlist(product.id);
  const cartItem = items.find(item => item.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  const discount = getDiscountPercentage(product.mrp, product.price);
  const isBestSeller = Number(product.rating) >= 4.4 || Number(product.reviews) > 500;

  const handleWishlist = (e) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="block h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg">
        {/* Product Image */}
        <div className="relative aspect-[1.08/1] overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50">
          <img
            src={product.image}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src = product.images?.[0] || product.image;
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5">
            {discount > 0 && (
              <span className="rounded bg-rose-600 px-1.5 py-1 text-[10px] font-bold uppercase leading-none text-white shadow-sm sm:px-2 sm:text-[11px]">
                {discount}% off
              </span>
            )}
            {isBestSeller && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-400 px-1.5 py-1 text-[10px] font-bold uppercase leading-none text-slate-950 shadow-sm sm:px-2 sm:text-[11px]">
                <TrendingUp size={11} />
                Seller
              </span>
            )}
          </div>
          {discount > 0 && (
            <div className="absolute bottom-2 right-2 hidden items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-teal-800 shadow-sm backdrop-blur sm:inline-flex">
              <ShieldCheck size={12} />
              Genuine
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-1 flex-col p-2 sm:p-2.5">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-teal-700 sm:text-xs">{product.brand}</p>
          <h3 className="mt-1 line-clamp-2 min-h-8 text-xs font-semibold leading-snug text-slate-950 sm:min-h-9 sm:text-sm">
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500 sm:text-xs">{product.description}</p>

          <div className="mt-auto flex items-center justify-between gap-1 pt-2 sm:gap-2">
            <div className="flex min-w-0 items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400 sm:h-3.5 sm:w-3.5" />
              <span className="text-[11px] font-semibold text-slate-900 sm:text-xs">{product.rating}</span>
              <span className="hidden text-xs text-slate-500 sm:inline">({product.reviews})</span>
            </div>
            <div className="flex shrink-0 items-baseline gap-1 sm:gap-1.5">
              <span className="text-sm font-bold text-slate-950 sm:text-lg">
                {formatCurrency(product.price)}
              </span>
              <span className="hidden text-xs text-slate-400 line-through sm:inline">
                {formatCurrency(product.mrp)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 flex gap-1.5 sm:mt-2.5 sm:gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, 1);
                addToast(`${product.name} added to cart`, 'success');
              }}
              className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-teal-700 text-xs font-semibold text-white transition hover:bg-teal-800 sm:h-9 sm:text-sm"
            >
              <ShoppingCart size={14} className="sm:h-4 sm:w-4" />
              {cartQuantity > 0 ? `Add (${cartQuantity})` : 'Add'}
            </button>
            <button
              onClick={handleWishlist}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`grid h-8 w-8 place-items-center rounded-lg border text-sm transition sm:h-9 sm:w-10 ${
                inWishlist
                  ? 'border-rose-500 bg-rose-50 text-rose-600'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
