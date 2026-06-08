import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useOrdersStore } from '../store/index.js';
import { dummyProducts } from '../data/dummy.js';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CreditCard,
  HelpCircle,
  MapPin,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/helpers.js';
import Modal from '../components/common/Modal.jsx';

const getUnitPrice = (item) => Number(item?.price ?? item?.b2bPrice ?? item?.retailPrice ?? 0);

const getOrderTotal = (order) => {
  const subtotal = order.subtotal ?? (order.items || []).reduce((sum, item) => sum + getUnitPrice(item) * Number(item.quantity || 1), 0);
  return order.totalAmount ?? Math.max(subtotal - (order.discount || 0), 0) + (order.delivery || 0) + (order.gst || 0);
};

const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const formatTimelineDate = (date, options = {}) => new Intl.DateTimeFormat('en-IN', {
  weekday: Object.prototype.hasOwnProperty.call(options, 'weekday') ? options.weekday : 'short',
  day: 'numeric',
  month: 'short',
  ...options,
}).format(date);

const buildTimeline = (order) => {
  const orderedAt = order.createdAt ? new Date(order.createdAt) : new Date();
  const shippedDate = addDays(orderedAt, 7);
  const deliveryDate = addDays(orderedAt, 8);
  const status = order.status;

  return [
    {
      label: 'Order Confirmed, Today',
      modalLabel: `Order Confirmed ${formatTimelineDate(orderedAt, { year: '2-digit' })}`,
      desc: `Your Order has been placed., ${formatTimelineDate(orderedAt)}`,
      details: [
        `Your Order has been placed.`,
        formatTimelineDate(orderedAt, { hour: 'numeric', minute: '2-digit' }),
        'Seller is processing your order.',
        'Item waiting to be picked up by delivery partner.',
      ],
      completed: true,
      active: true,
    },
    {
      label: `Shipped, Expected By ${formatTimelineDate(shippedDate, { weekday: undefined })}`,
      modalLabel: `Shipped Expected By ${formatTimelineDate(shippedDate)}`,
      desc: 'Item yet to be shipped.',
      details: [
        'Item yet to be shipped.',
        `Expected by ${formatTimelineDate(shippedDate)} to noon.`,
        'Item yet to reach hub nearest to you.',
      ],
      completed: ['Shipped', 'Out For Delivery', 'Delivered'].includes(status),
      active: status === 'Shipped',
    },
    {
      label: 'Out For Delivery',
      modalLabel: 'Out For Delivery',
      desc: 'Item yet to be delivered.',
      details: ['Item yet to be delivered.'],
      completed: ['Out For Delivery', 'Delivered'].includes(status),
      active: status === 'Out For Delivery',
    },
    {
      label: `Delivery, ${formatTimelineDate(deliveryDate)} By 11 PM`,
      modalLabel: `Delivery Expected By ${formatTimelineDate(deliveryDate)}`,
      desc: `Item yet to be delivered.`,
      details: [
        'Item yet to be delivered.',
        `Expected by ${formatTimelineDate(deliveryDate)} by 11 PM.`,
      ],
      completed: status === 'Delivered',
      active: status === 'Delivered',
    },
  ];
};

const OrderDetails = () => {
  const { orderId, itemId } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrdersStore();
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const order = orders.find(item => String(item.id) === String(orderId) || item.orderNumber === orderId);
  const orderItem = order?.items?.find(item => String(item.id) === String(itemId)) || order?.items?.[0];
  const product = dummyProducts.find(item => item.id === Number(orderItem?.id));

  if (!order || !orderItem) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm">
            <PackageCheck className="mx-auto text-teal-700" size={42} />
            <h1 className="mt-4 text-2xl font-bold text-slate-950">Order details not found</h1>
            <p className="mt-2 text-sm text-slate-500">Open a product from Track Your Order to view its details.</p>
            <button type="button" onClick={() => navigate('/track-order')} className="btn-primary mt-6 inline-flex">
              Back to Track Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  const timeline = buildTimeline(order);
  const unitPrice = getUnitPrice(orderItem);
  const lineTotal = unitPrice * Number(orderItem.quantity || 1);
  const orderTotal = getOrderTotal(order);
  const isB2B = order.accountType === 'B2B';
  const buyAgainPath = orderItem?.id ? `/products/${orderItem.id}` : '/products';

  return (
    <div className="bg-slate-50 py-3 sm:py-4">
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => navigate('/track-order')} className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-600 hover:text-teal-700">
            <ArrowLeft size={18} />
            Back to orders
          </button>
          <div className="flex flex-wrap gap-2">
            {isB2B && <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">B2B Order</span>}
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">{order.status}</span>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Order ID</p>
              <h1 className="mt-1 break-all text-lg font-extrabold text-slate-950 sm:text-xl">{order.orderNumber}</h1>
              <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">Ordered on {formatDateTime(order.createdAt)}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs font-bold uppercase text-slate-400">Item Amount</p>
                <p className="mt-1 font-extrabold text-slate-950">{formatCurrency(lineTotal)}</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs font-bold uppercase text-slate-400">Qty</p>
                <p className="mt-1 font-extrabold text-slate-950">{orderItem.quantity || 1}</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs font-bold uppercase text-slate-400">Order Total</p>
                <p className="mt-1 font-extrabold text-slate-950">{formatCurrency(orderTotal)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-4">
            <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
              <div className="grid gap-3 sm:grid-cols-[84px_1fr_auto] sm:items-start">
                <img
                  src={orderItem.image || product?.image}
                  alt={orderItem.name}
                  className="h-20 w-20 rounded-lg border border-slate-100 bg-slate-50 object-contain p-2 sm:h-[84px] sm:w-[84px]"
                />
                <div className="min-w-0">
                  <h2 className="text-base font-extrabold text-slate-950 sm:text-lg">{orderItem.name}</h2>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                    {orderItem.brand && <span>Seller: {orderItem.brand}</span>}
                    <span>Qty: {orderItem.quantity || 1}</span>
                    <span>Unit price: {formatCurrency(unitPrice)}</span>
                    <span>MRP: {formatCurrency(orderItem.mrp || product?.mrp || unitPrice)}</span>
                    <span className="capitalize">Category: {orderItem.category || product?.category || '-'}</span>
                  </div>
                  {isB2B && (
                    <p className="mt-2 inline-flex rounded bg-teal-50 px-2 py-1 text-xs font-bold text-teal-800">
                      Wholesale price applied
                    </p>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold uppercase text-slate-400">Amount</p>
                  <p className="mt-1 text-lg font-extrabold text-slate-950">{formatCurrency(lineTotal)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
              <div className="relative">
                {timeline.map((status, index) => (
                  <div
                    key={status.label}
                    className={`relative flex gap-4 py-3 pl-1 pr-3 ${status.active ? 'bg-emerald-50' : ''}`}
                  >
                    <div className="relative flex w-7 justify-center">
                      {index < timeline.length - 1 && (
                        <div className={`absolute left-1/2 top-7 h-full -translate-x-1/2 border-l ${status.completed ? 'border-emerald-500' : 'border-dashed border-slate-300'}`} />
                      )}
                      <div className={`relative z-10 grid h-4 w-4 place-items-center rounded-full border-2 ${
                        status.completed ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {status.completed && <Check size={10} strokeWidth={4} />}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className={`text-sm font-semibold ${status.completed ? 'text-slate-950' : 'text-slate-500'}`}>{status.label}</h2>
                      <p className={`mt-1 text-xs font-semibold ${status.active ? 'text-slate-950' : 'text-slate-500'}`}>{status.desc}</p>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAllUpdates(true)}
                  className="mt-3 inline-flex items-center gap-1 pl-1 text-sm font-extrabold text-violet-700 hover:text-teal-700"
                >
                  See All Updates
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-950">
                <MapPin size={18} className="text-teal-700" />
                Delivery Address
              </h2>
              <p className="text-sm leading-6 text-slate-600">{order.deliveryAddress}</p>
              {order.businessProfile?.businessName && (
                <p className="mt-3 rounded-lg bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800">
                  {order.businessProfile.businessName}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-950">
                <ReceiptText size={18} className="text-teal-700" />
                Price Details
              </h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Item price</span>
                  <span className="font-bold text-slate-950">{formatCurrency(lineTotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Order subtotal</span>
                  <span className="font-bold text-slate-950">{formatCurrency(order.subtotal ?? lineTotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between gap-4 text-emerald-700">
                    <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                    <span className="font-bold">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                {order.gst > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">GST</span>
                    <span className="font-bold text-slate-950">{formatCurrency(order.gst)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Delivery</span>
                  <span className="font-bold text-slate-950">{order.delivery ? formatCurrency(order.delivery) : 'FREE'}</span>
                </div>
                <div className="border-t border-slate-100 pt-2.5">
                  <div className="flex justify-between gap-4 text-base">
                    <span className="font-extrabold text-slate-950">Total Paid</span>
                    <span className="font-extrabold text-slate-950">{formatCurrency(orderTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-950">
                <CreditCard size={18} className="text-teal-700" />
                Payment Details
              </h2>
              <p className="text-sm font-bold text-slate-950">{order.paymentMethod}</p>
              <p className="mt-1 text-sm text-slate-500">Delivery slot: {order.deliverySlot}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <Link to="/customer-care" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm hover:bg-teal-50">
                <HelpCircle size={18} />
                Need help?
              </Link>
              <Link to={buyAgainPath} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-teal-800">
                <ShieldCheck size={18} />
                Buy again
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Modal isOpen={showAllUpdates} onClose={() => setShowAllUpdates(false)} title="All Updates" size="lg">
        <div className="relative max-h-[70vh] overflow-y-auto pr-1">
          {timeline.map((status, index) => (
            <div key={status.modalLabel} className="relative flex gap-4 pb-6 last:pb-1">
              <div className="relative flex w-5 justify-center">
                {index < timeline.length - 1 && (
                  <div className={`absolute left-1/2 top-5 h-full -translate-x-1/2 border-l ${status.completed ? 'border-emerald-500' : 'border-slate-300'}`} />
                )}
                <div className={`relative z-10 mt-1 h-3 w-3 rounded-full border-2 ${
                  status.completed ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                }`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`text-sm font-semibold ${status.completed ? 'text-slate-950' : 'text-slate-500'}`}>{status.modalLabel}</h3>
                <div className="mt-2 space-y-2">
                  {status.details.map(detail => (
                    <p key={detail} className={`text-xs leading-5 ${status.completed ? 'text-slate-700' : 'text-slate-500'}`}>
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetails;
