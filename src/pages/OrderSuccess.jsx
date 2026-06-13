import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, PackageCheck, Share2, ShoppingBag } from 'lucide-react';
import { useAuthStore, useOrdersStore } from '../store/index.js';
import { dummyProducts } from '../data/dummy.js';
import { formatCurrency } from '../utils/helpers.js';
import { useToast } from '../components/common/Toast.jsx';

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const formatDeliveryDate = (date) => new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: '2-digit',
}).format(date);

const getOrderTotal = (order) => {
  const subtotal = order.subtotal ?? (order.items || []).reduce((sum, item) => {
    const unitPrice = Number(item.price ?? item.b2bPrice ?? item.retailPrice ?? 0);
    return sum + unitPrice * Number(item.quantity || 1);
  }, 0);

  return order.totalAmount ?? Math.max(subtotal - (order.discount || 0), 0) + (order.delivery || 0) + (order.gst || 0);
};

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrdersStore();
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const order = orders.find(item => item.orderNumber === orderNumber || String(item.id) === String(orderNumber)) || orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm">
            <PackageCheck className="mx-auto text-teal-700" size={44} />
            <h1 className="mt-4 text-2xl font-bold text-slate-950">No order found</h1>
            <p className="mt-2 text-sm text-slate-500">Your confirmed order will appear here after checkout.</p>
            <Link to="/products" className="btn-primary mt-6 inline-flex">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const deliveryDate = formatDeliveryDate(addDays(order.createdAt || Date.now(), 8));
  const firstItem = order.items?.[0];
  const orderDetailPath = firstItem ? `/order-details/${order.id}/${firstItem.id}` : '/track-order';
  const suggestedProducts = dummyProducts
    .filter(product => !order.items?.some(item => item.id === product.id))
    .slice(0, 4);
  const displayName = order.businessProfile?.businessName || user?.name || 'MediCare Customer';
  const phoneNumber = order.businessProfile?.mobileNumber || user?.mobile || '';

  const handleShareOrder = async () => {
    const text = `MediCare order ${order.orderNumber} confirmed. Delivery by ${deliveryDate}. Total ${formatCurrency(getOrderTotal(order))}.`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'MediCare order confirmed', text });
      } else {
        await navigator.clipboard.writeText(text);
        addToast('Order details copied to clipboard', 'success');
      }
    } catch {
      addToast('Unable to share order details right now', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-4">
      <div className="mx-auto grid max-w-5xl gap-4 px-3 lg:grid-cols-[minmax(0,1fr)_318px]">
        <main className="space-y-2">
          <section className="relative overflow-hidden bg-white px-4 py-5 shadow-sm sm:px-5">
            <div className="relative z-10">
              <h1 className="text-xl font-extrabold text-slate-950 sm:text-2xl">Thanks for shopping with us!</h1>
              <p className="mt-7 text-sm font-semibold text-slate-950">Delivery by {deliveryDate}</p>
              <Link to={orderDetailPath} className="mt-4 inline-flex text-sm font-extrabold text-violet-700 hover:text-teal-700">
                Track & manage order
              </Link>
            </div>
            <div className="absolute bottom-0 right-0 grid h-28 w-32 place-items-center rounded-tl-full bg-emerald-50 sm:h-36 sm:w-40">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white shadow-lg sm:h-20 sm:w-20">
                <Check size={38} strokeWidth={3.5} />
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-4 shadow-sm sm:px-5">
            <p className="text-base font-extrabold text-slate-950 sm:text-lg">Delivery by {deliveryDate}</p>
          </section>

          <section className="bg-white px-3 py-3 shadow-sm sm:px-4">
            <Link to="/products" className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white hover:bg-teal-800">
              Continue Shopping
            </Link>
          </section>

          <button
            type="button"
            onClick={handleShareOrder}
            className="flex w-full items-center gap-3 bg-white px-4 py-4 text-left shadow-sm transition hover:bg-teal-50 sm:px-5"
          >
            <Share2 size={20} className="text-violet-700" />
            <span className="flex-1 text-base font-semibold text-slate-950">Send Order Details</span>
            <ChevronRight size={20} className="text-slate-950" />
          </button>

          <section className="bg-white px-4 py-5 shadow-sm sm:px-5">
            <h2 className="text-base font-extrabold text-slate-950">You might be also interested in</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {suggestedProducts.map(product => (
                <Link key={product.id} to={`/products/${product.id}`} className="rounded-lg border border-slate-200 bg-white p-3 transition hover:border-teal-300 hover:shadow-sm">
                  <img src={product.image} alt={product.name} className="mx-auto h-20 w-full object-contain" />
                  <p className="mt-3 line-clamp-1 text-sm font-bold text-slate-950">Min. {Math.max(10, Math.round(((product.mrp - product.price) / product.mrp) * 100))}% Off</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">{product.name}</p>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-3">
          <section className="bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-16 place-items-center rounded bg-violet-700 text-white">
                <ShoppingBag size={30} />
              </div>
              <div>
                <p className="font-extrabold text-slate-950">Why call? Just click!</p>
                <Link to="/account" className="mt-3 inline-flex h-9 items-center rounded bg-teal-700 px-4 text-sm font-bold text-white hover:bg-teal-800">
                  Go to My Orders
                </Link>
              </div>
            </div>
          </section>

          <section className="bg-white p-4 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-950">{displayName}</h2>
            <p className="mt-3 whitespace-pre-line text-sm font-medium leading-6 text-slate-800">{order.deliveryAddress}</p>
            {phoneNumber && <p className="mt-2 text-sm font-bold text-slate-950">Phone number: {phoneNumber}</p>}
          </section>

          <section className="bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Order Total</p>
            <p className="mt-1 text-xl font-extrabold text-slate-950">{formatCurrency(getOrderTotal(order))}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">Order ID: {order.orderNumber}</p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default OrderSuccess;
