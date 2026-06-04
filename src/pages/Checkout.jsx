import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, LocateFixed, MapPin, Navigation, PackageCheck } from 'lucide-react';
import { useCartStore, useAuthStore, usePreferencesStore, useOrdersStore } from '../store/index.js';
import { useToast } from '../components/common/Toast';
import { validateMobile, validatePincode, generateOrderNumber, calculateSubtotal, calculateDeliveryCharges, formatCurrency } from '../utils/helpers.js';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const { addAddress, savedAddresses, setSelectedAddress, appliedCoupon, removeCoupon } = usePreferencesStore();
  const { createOrder } = useOrdersStore();
  const { addToast } = useToast();
  const [isLocating, setIsLocating] = useState(false);
  const [mapLocation, setMapLocation] = useState({ lat: '28.58680', lng: '77.20796' });
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    mobile: '',
    houseNumber: '',
    area: '',
    landmark: 'Pinned from device location',
    city: '',
    state: '',
    pincode: '',
  });

  const subtotal = calculateSubtotal(items);
  const discountAmount = Math.min(appliedCoupon?.discountAmount || 0, subtotal);
  const delivery = calculateDeliveryCharges(subtotal);
  const total = Math.max(subtotal - discountAmount, 0) + delivery;
  const isAddressReady = useMemo(() => (
    address.fullName.trim().length >= 2 &&
    validateMobile(address.mobile) &&
    address.houseNumber.trim() &&
    address.area.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    validatePincode(address.pincode)
  ), [address]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="mb-4 text-xl text-slate-600">Your cart is empty</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="mb-4 text-xl text-slate-600">Please login to checkout</p>
        <button onClick={() => navigate('/login?redirect=/checkout')} className="btn-primary">
          Login
        </button>
      </div>
    );
  }

  const updateAddress = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast('Current location is not supported in this browser', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMapLocation({
          lat: coords.latitude.toFixed(5),
          lng: coords.longitude.toFixed(5),
        });
        setAddress(prev => ({
          ...prev,
          area: prev.area || 'Current map location',
          city: prev.city || 'Detected nearby area',
          landmark: prev.landmark || 'Pinned from device location',
        }));
        setIsLocating(false);
        addToast('Current location pinned on map', 'success');
      },
      () => {
        setIsLocating(false);
        addToast('Please allow location access to use current location', 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handlePlaceOrder = () => {
    if (!isAddressReady) {
      addToast('Complete required address fields before placing order.', 'error');
      return;
    }

    const orderAddress = { ...address };
    addAddress(orderAddress);
    setSelectedAddress(orderAddress);

    createOrder({
      orderNumber: generateOrderNumber(),
      items,
      deliveryAddress: `${address.houseNumber}, ${address.area}, ${address.city}, ${address.state} ${address.pincode}`,
      deliverySlot: 'Standard delivery',
      paymentMethod: 'Pay on delivery',
      subtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code || null,
      gst: 0,
      delivery,
      totalAmount: total,
    });
    clearCart();
    removeCoupon();
    addToast('Order placed successfully!', 'success');
    navigate('/track-order');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-9">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-rose-500">Checkout</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-slate-950">Add delivery address</h1>
          <p className="mt-4 text-base text-slate-600">
            Add address manually or pin your current address from the map location button.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">Delivery details</h2>
                <p className="mt-1 text-sm text-slate-500">Your order will be delivered to this address.</p>
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-teal-600 px-5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 disabled:opacity-60"
              >
                <LocateFixed size={18} />
                {isLocating ? 'Locating...' : 'Use current address'}
              </button>
            </div>

            <div className="mb-6 rounded-lg bg-teal-50 px-4 py-3 text-sm font-bold text-teal-700">
              Current location pinned on map.
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">Full name</span>
                <input value={address.fullName} onChange={(event) => updateAddress('fullName', event.target.value)} placeholder="Full name" className="input-base h-12" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">Phone number</span>
                <input value={address.mobile} onChange={(event) => updateAddress('mobile', event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Phone number" className="input-base h-12" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-800">House / flat / building</span>
                <input value={address.houseNumber} onChange={(event) => updateAddress('houseNumber', event.target.value)} placeholder="House / flat / building" className="input-base h-12" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">Area / street</span>
                <input value={address.area} onChange={(event) => updateAddress('area', event.target.value)} placeholder="Current map location" className="input-base h-12" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">City</span>
                <input value={address.city} onChange={(event) => updateAddress('city', event.target.value)} placeholder="Detected nearby area" className="input-base h-12" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">State</span>
                <input value={address.state} onChange={(event) => updateAddress('state', event.target.value)} placeholder="State" className="input-base h-12" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">PIN code</span>
                <input value={address.pincode} onChange={(event) => updateAddress('pincode', event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="PIN code" className="input-base h-12" />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-800">Landmark</span>
                <input value={address.landmark} onChange={(event) => updateAddress('landmark', event.target.value)} placeholder="Pinned from device location" className="input-base h-12" />
              </label>
            </div>

            <div className="relative mt-6 h-72 overflow-hidden rounded-lg border border-teal-100 bg-teal-50">
              <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(#99f6e4_1px,transparent_1px),linear-gradient(90deg,#99f6e4_1px,transparent_1px),repeating-linear-gradient(135deg,transparent_0_90px,rgba(248,113,113,0.20)_92px,rgba(248,113,113,0.20)_98px,transparent_100px)] [background-size:36px_36px,36px_36px,180px_180px]" />
              <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-rose-500 text-white shadow-lg">
                <MapPin size={28} />
              </div>
              <div className="absolute inset-x-6 bottom-6 rounded-lg bg-white/95 px-5 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Navigation className="mt-1 text-teal-700" size={18} />
                  <div>
                    <p className="font-extrabold text-slate-950">Map location</p>
                    <p className="mt-1 text-sm text-slate-600">{mapLocation.lat}, {mapLocation.lng}</p>
                  </div>
                </div>
              </div>
            </div>

            {savedAddresses.length > 0 && (
              <p className="mt-4 text-xs text-slate-500">{savedAddresses.length} saved address{savedAddresses.length > 1 ? 'es' : ''} available in your account.</p>
            )}
          </section>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-xl font-extrabold text-slate-950">Order summary</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <span className="line-clamp-1 text-slate-600">{item.name} x {item.quantity}</span>
                  <span className="font-extrabold text-slate-950">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-slate-200" />
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-extrabold text-slate-950">{formatCurrency(subtotal)}</span>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo ({appliedCoupon.code})</span>
                  <span className="font-extrabold">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-extrabold text-slate-950">{delivery === 0 ? 'FREE' : formatCurrency(delivery)}</span>
              </div>
            </div>
            <div className="my-5 border-t border-slate-200" />
            <div className="flex justify-between text-xl font-extrabold text-slate-950">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!isAddressReady}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 font-bold text-white transition hover:bg-teal-800 disabled:bg-slate-300 disabled:text-white"
            >
              {isAddressReady ? <PackageCheck size={18} /> : <CheckCircle2 size={18} />}
              Place order
            </button>
            {!isAddressReady && (
              <p className="mt-4 text-sm text-slate-500">Complete required address fields before placing order.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
