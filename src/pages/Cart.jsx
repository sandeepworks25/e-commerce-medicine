import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, LockKeyhole, Minus, Plus, Star, Trash2, UserPlus } from 'lucide-react';
import { useAuthStore, useCartStore, usePreferencesStore } from '../store/index.js';
import { dummyCoupons, dummyProducts } from '../data/dummy.js';
import { useToast } from '../components/common/Toast';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal.jsx';
import { formatCurrency, calculateSubtotal } from '../utils/helpers.js';
import { useState } from 'react';

const Cart = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, addToCart, removeFromCart, updateQuantity } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const { appliedCoupon, applyCoupon, removeCoupon } = usePreferencesStore();
  const { addToast } = useToast();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [couponCode, setCouponCode] = useState(appliedCoupon?.code || '');
  const [savedForLater, setSavedForLater] = useState(() => JSON.parse(localStorage.getItem('saved_for_later')) || []);
  const addedProduct = dummyProducts.find(product => product.id === Number(searchParams.get('added')));
  const subtotal = calculateSubtotal(items);
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const cartTotal = Math.max(subtotal - discountAmount, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const relatedProducts = dummyProducts
    .filter(product => !items.some(item => item.id === product.id))
    .slice(8, 13);

  const handleRemove = (productId) => {
    removeFromCart(productId);
    addToast('Product removed from cart', 'info');
  };

  const persistSavedItems = (nextItems) => {
    localStorage.setItem('saved_for_later', JSON.stringify(nextItems));
    setSavedForLater(nextItems);
  };

  const handleSaveForLater = (item) => {
    const nextItems = [
      item,
      ...savedForLater.filter(savedItem => savedItem.id !== item.id),
    ];
    persistSavedItems(nextItems);
    removeFromCart(item.id);
    addToast('Product saved for later', 'success');
  };

  const handleMoveToCart = (item) => {
    addToCart(item, item.quantity);
    persistSavedItems(savedForLater.filter(savedItem => savedItem.id !== item.id));
    addToast('Product moved back to cart', 'success');
  };

  const handleSeeMoreLikeThis = (item) => {
    navigate(`/products?category=${item.category}`);
  };

  const handleShare = async (item) => {
    const shareUrl = `${window.location.origin}/products/${item.id}`;
    const shareData = {
      title: item.name,
      text: `Check out ${item.name} on MediCare`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      addToast('Product link copied to clipboard', 'success');
    } catch {
      addToast('Unable to share this product right now', 'error');
    }
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupon = dummyCoupons.find(item => item.code === code);

    if (!coupon) {
      addToast('Invalid promo code', 'error');
      return;
    }

    if (subtotal < coupon.minAmount) {
      addToast(`Add ${formatCurrency(coupon.minAmount - subtotal)} more to use ${coupon.code}`, 'warning');
      return;
    }

    const rawDiscount = coupon.type === 'percentage'
      ? Math.round((subtotal * coupon.discount) / 100)
      : coupon.discount;
    const nextDiscount = Math.min(rawDiscount, coupon.maxDiscount || rawDiscount, subtotal);

    applyCoupon({ ...coupon, discountAmount: nextDiscount });
    setCouponCode(coupon.code);
    addToast(`${coupon.code} applied successfully`, 'success');
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    addToast('Promo code removed', 'info');
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      addToast('Move an item to cart before checkout', 'warning');
      return;
    }
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-[#eaeded]">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <EmptyState
            type="cart"
            title="Your Cart is Empty"
            description="Looks like you haven't added any products to your cart yet. Start shopping!"
            actionText="Continue Shopping"
            onAction={() => navigate('/products')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eaeded] py-3 md:py-5">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        {addedProduct && (
          <div className="mb-5 grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="flex min-h-44 items-center justify-center gap-6 bg-white px-5 py-8">
              <img src={addedProduct.image} alt={addedProduct.name} className="h-24 w-36 object-contain" />
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 fill-emerald-600 text-white" />
                <p className="text-xl font-bold text-slate-950">Added to cart</p>
              </div>
            </div>
            <div className="bg-white px-7 py-7">
              <p className="text-xl font-bold text-slate-950">
                Cart subtotal: <span className="font-extrabold">{formatCurrency(cartTotal)}</span>
              </p>
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="mt-4 h-9 w-full rounded-full bg-yellow-400 text-sm font-semibold text-slate-950 hover:bg-yellow-300"
              >
                Proceed to Buy ({itemCount} items)
              </button>
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="mt-3 h-8 w-full rounded-full border border-slate-500 text-sm font-semibold text-slate-950 hover:bg-slate-50"
              >
                Go to Cart
              </button>
              <p className="mt-5 text-sm font-medium text-slate-950">
                For best experience <Link to="/login" className="text-blue-700 hover:underline">sign in to your account</Link>
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="bg-white px-5 py-5 sm:px-8">
            <div className="flex items-end justify-between border-b border-slate-200 pb-6">
              <h1 className="text-3xl font-normal text-slate-950">Shopping Cart</h1>
              <span className="hidden text-sm text-slate-700 sm:block">Price</span>
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid gap-4 border-b border-slate-200 py-8 sm:grid-cols-[180px_1fr_110px]">
                <Link to={`/products/${item.id}`} className="flex justify-center sm:block">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-44 w-44 object-contain"
                    onError={(event) => {
                      event.currentTarget.src = item.images?.[0] || item.image;
                    }}
                  />
                </Link>

                <div className="min-w-0">
                  <Link to={`/products/${item.id}`} className="text-xl font-semibold leading-7 text-slate-950 hover:text-blue-700">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">In stock</p>
                  <p className="mt-1 text-sm text-slate-700">
                    Sold by <span className="text-blue-700">{item.brand}</span>
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-950">FREE delivery Sat, 6 Jun</p>
                  <p className="mt-1 text-sm text-slate-700">
                    Gift options not available. <span className="text-blue-700">Learn more</span>
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <div className="inline-flex h-9 items-center rounded-full border-2 border-yellow-400 bg-white">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="grid h-8 w-10 place-items-center text-slate-950"
                        aria-label="Decrease quantity"
                      >
                        {item.quantity === 1 ? <Trash2 size={17} /> : <Minus size={16} />}
                      </button>
                      <span className="min-w-9 text-center font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="grid h-8 w-10 place-items-center text-slate-950"
                        aria-label="Increase quantity"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button type="button" onClick={() => handleRemove(item.id)} className="border-l border-slate-300 pl-3 text-blue-700 hover:underline">
                      Delete
                    </button>
                    <button type="button" onClick={() => handleSaveForLater(item)} className="border-l border-slate-300 pl-3 text-blue-700 hover:underline">Save for later</button>
                    <button type="button" onClick={() => handleSeeMoreLikeThis(item)} className="border-l border-slate-300 pl-3 text-blue-700 hover:underline">See more like this</button>
                    <button type="button" onClick={() => handleShare(item)} className="border-l border-slate-300 pl-3 text-blue-700 hover:underline">Share</button>
                  </div>
                </div>

                <p className="text-right text-xl font-bold text-slate-950">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}

            <div className="py-4 text-right text-xl text-slate-950">
              Subtotal ({itemCount} items): <span className="font-bold">{formatCurrency(cartTotal)}</span>
            </div>

            {savedForLater.length > 0 && (
              <div className="mt-3 border-t border-slate-200 pt-5">
                <h2 className="text-2xl font-normal text-slate-950">Saved for later</h2>
                <p className="mt-1 text-sm text-slate-600">{savedForLater.length} item{savedForLater.length > 1 ? 's' : ''}</p>
                {savedForLater.map(item => (
                  <div key={item.id} className="grid gap-4 border-b border-slate-200 py-6 sm:grid-cols-[120px_1fr_110px]">
                    <img src={item.image} alt={item.name} className="h-28 w-28 object-contain" />
                    <div>
                      <Link to={`/products/${item.id}`} className="text-lg font-semibold text-slate-950 hover:text-blue-700">{item.name}</Link>
                      <p className="mt-1 text-sm font-semibold text-emerald-700">In stock</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        <button type="button" onClick={() => handleMoveToCart(item)} className="text-blue-700 hover:underline">Move to Cart</button>
                        <button type="button" onClick={() => persistSavedItems(savedForLater.filter(savedItem => savedItem.id !== item.id))} className="border-l border-slate-300 pl-3 text-blue-700 hover:underline">Delete</button>
                        <button type="button" onClick={() => handleSeeMoreLikeThis(item)} className="border-l border-slate-300 pl-3 text-blue-700 hover:underline">See more like this</button>
                        <button type="button" onClick={() => handleShare(item)} className="border-l border-slate-300 pl-3 text-blue-700 hover:underline">Share</button>
                      </div>
                    </div>
                    <p className="text-right text-lg font-bold text-slate-950">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div className="bg-white px-5 py-7">
              <p className="text-xl font-semibold text-slate-950">
                Subtotal ({itemCount} items): <span className="font-extrabold">{formatCurrency(cartTotal)}</span>
              </p>
              {appliedCoupon && (
                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  {appliedCoupon.code} saved {formatCurrency(discountAmount)}
                </p>
              )}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="mt-3 h-9 w-full rounded-full bg-yellow-400 text-sm font-semibold text-slate-950 hover:bg-yellow-300"
              >
                Proceed to Buy
              </button>
            </div>

            <div className="rounded-lg border border-slate-300 bg-white p-5">
              <h2 className="text-sm font-bold text-slate-950">Apply promo code</h2>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  placeholder="WELCOME20"
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
                />
                <button type="button" onClick={handleApplyCoupon} className="rounded-lg bg-slate-950 px-4 text-sm font-bold text-white hover:bg-slate-800">
                  Apply
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">Try WELCOME20 or FIRST50.</p>
              {appliedCoupon && (
                <button type="button" onClick={handleRemoveCoupon} className="mt-3 text-sm font-semibold text-blue-700 hover:underline">
                  Remove {appliedCoupon.code}
                </button>
              )}
            </div>

            <div className="rounded-lg border border-slate-300 bg-white p-5">
              <h2 className="text-sm font-bold text-slate-950">Products related to items in your cart</h2>
              <p className="mt-4 text-xs text-slate-600">Sponsored</p>
              <div className="mt-5 space-y-5">
                {relatedProducts.map(product => (
                  <Link key={product.id} to={`/products/${product.id}`} className="grid grid-cols-[86px_1fr] gap-4">
                    <img src={product.image} alt={product.name} className="h-24 w-20 object-contain" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-blue-700">{product.name}</span>
                      <span className="mt-1 flex text-orange-500">
                        {[1, 2, 3, 4].map(star => <Star key={star} size={15} className="fill-current" />)}
                        <Star size={15} />
                      </span>
                      <span className="block text-sm text-blue-700">{product.reviews} ratings</span>
                      <span className="block text-xl font-semibold text-slate-950">{formatCurrency(product.price)}</span>
                      <span className="mt-2 inline-flex rounded-full border border-slate-400 px-3 py-1 text-xs text-slate-950">See all buying options</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="Login to continue checkout"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700">
            <LockKeyhole size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-950">Secure checkout needs login</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to use saved addresses, track your order, and complete payment safely.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => navigate('/login?redirect=/checkout')}
              className="btn-primary inline-flex items-center justify-center gap-2 py-3"
            >
              <LockKeyhole size={18} />
              Login
            </button>
            <button
              onClick={() => navigate('/register?redirect=/checkout')}
              className="btn-outline inline-flex items-center justify-center gap-2 py-3"
            >
              <UserPlus size={18} />
              Create Account
            </button>
          </div>
          <button
            onClick={() => setShowLoginPrompt(false)}
            className="mt-4 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            Continue reviewing cart
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
