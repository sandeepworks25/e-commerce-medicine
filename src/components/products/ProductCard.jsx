import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { useAuthStore, useCartStore, useWishlistStore } from '../../store/index.js';
import { useToast } from '../common/Toast.jsx';
import LoadingButton from '../common/LoadingButton.jsx';
import { formatCurrency, getDiscountPercentage, getStorefrontProduct } from '../../utils/helpers.js';

const ProductCard = ({ product }) => {
  const { items, addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addToast } = useToast();
  const [loadingAction, setLoadingAction] = useState('');
  const [b2bQuantity, setB2BQuantity] = useState(10);
  const storefrontProduct = getStorefrontProduct(product, user);
  const inWishlist = isInWishlist(storefrontProduct.id);
  const cartItem = items.find(item => item.id === storefrontProduct.id);
  const cartQuantity = cartItem?.quantity || 0;

  const discount = getDiscountPercentage(storefrontProduct.mrp, storefrontProduct.price);
  const isBestSeller = Number(storefrontProduct.rating) >= 4.4 || Number(storefrontProduct.reviews) > 500;
  const maxQuantity = Math.max(storefrontProduct.stock || 1, 1);
  const selectedQuantity = storefrontProduct.isB2BPrice ? b2bQuantity : 1;

  const updateB2BQuantity = (value) => {
    const nextValue = Math.min(Math.max(Number(value) || 1, 1), maxQuantity);
    setB2BQuantity(nextValue);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    setLoadingAction('wishlist');
    window.setTimeout(() => {
      if (inWishlist) {
        removeFromWishlist(storefrontProduct.id);
      } else {
        addToWishlist(storefrontProduct);
      }
      setLoadingAction('');
    }, 300);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    setLoadingAction('cart');
    window.setTimeout(() => {
      addToCart(storefrontProduct, selectedQuantity);
      addToast(`${storefrontProduct.name} added to cart`, 'success');
      setLoadingAction('');
    }, 300);
  };

  return (
    <Link to={`/products/${storefrontProduct.id}`} className="block h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg">
        {/* Product Image */}
        <div className="relative aspect-[1.08/1] overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50">
          <img
            src={storefrontProduct.image}
            alt={storefrontProduct.name}
            onError={(event) => {
              event.currentTarget.src = storefrontProduct.images?.[0] || storefrontProduct.image;
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
            {storefrontProduct.isB2BPrice && (
              <span className="rounded bg-slate-950 px-1.5 py-1 text-[10px] font-bold uppercase leading-none text-white shadow-sm sm:px-2 sm:text-[11px]">
                B2B
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
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-teal-700 sm:text-xs">{storefrontProduct.brand}</p>
          <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-slate-950  sm:text-sm">
            {storefrontProduct.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500 sm:text-xs">{storefrontProduct.description}</p>

          <div className="mt-auto flex items-center justify-between gap-1 pt-2 sm:gap-2">
            <div className="flex min-w-0 items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400 sm:h-3.5 sm:w-3.5" />
              <span className="text-[11px] font-semibold text-slate-900 sm:text-xs">{storefrontProduct.rating}</span>
              <span className="hidden text-xs text-slate-500 sm:inline">({storefrontProduct.reviews})</span>
            </div>
            <div className="flex shrink-0 items-baseline gap-1 sm:gap-1.5">
              <span className="text-sm font-bold text-slate-950 sm:text-lg">
                {formatCurrency(storefrontProduct.price)}
              </span>
              <span className="hidden text-xs text-slate-400 line-through sm:inline">
                {formatCurrency(storefrontProduct.mrp)}
              </span>
            </div>
          </div>

          {storefrontProduct.isB2BPrice && (
            <div className="mt-2 rounded-lg border border-teal-100 bg-teal-50 p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase text-teal-800">B2B Qty</span>
                <div className="inline-flex h-8 items-center overflow-hidden rounded-md border border-teal-200 bg-white">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      updateB2BQuantity(b2bQuantity - 1);
                    }}
                    className="grid h-8 w-8 place-items-center text-teal-800"
                    aria-label="Decrease B2B quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    value={b2bQuantity}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onChange={(event) => updateB2BQuantity(event.target.value)}
                    className="h-8 w-10 border-x border-teal-100 text-center text-xs font-bold text-slate-950 outline-none"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      updateB2BQuantity(b2bQuantity + 1);
                    }}
                    className="grid h-8 w-8 place-items-center text-teal-800"
                    aria-label="Increase B2B quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2 text-[11px] font-semibold text-teal-900">
                <span>Line price</span>
                <span>{formatCurrency(storefrontProduct.price * b2bQuantity)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-2 flex gap-1.5 sm:mt-2.5 sm:gap-2">
            <LoadingButton
              onClick={handleAddToCart}
              isLoading={loadingAction === 'cart'}
              loadingText="Adding..."
              icon={ShoppingCart}
              className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-teal-700 text-xs font-semibold text-white transition hover:bg-teal-800 sm:h-9 sm:text-sm"
            >
              {cartQuantity > 0 ? `Add (${cartQuantity})` : storefrontProduct.isB2BPrice ? 'Add B2B' : 'Add'}
            </LoadingButton>
            <button
              onClick={handleWishlist}
              disabled={loadingAction === 'wishlist'}
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
