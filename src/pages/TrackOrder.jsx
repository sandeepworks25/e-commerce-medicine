import { useOrdersStore } from '../store/index.js';
import { dummyProducts } from '../data/dummy.js';
import { Check, Clock, CreditCard, MapPin, PackageCheck, ReceiptText, ShoppingBag, Truck } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/helpers.js';
import { Link } from 'react-router-dom';

const getUnitPrice = (item) => Number(item.price ?? item.b2bPrice ?? item.retailPrice ?? 0);

const getLineTotal = (item) => getUnitPrice(item) * Number(item.quantity || 1);

const TrackOrder = () => {
  const { orders } = useOrdersStore();
  const latestOrder = orders[0];

  const statuses = [
    { label: 'Order Placed', desc: 'We received your order', icon: ShoppingBag, completed: true },
    { label: 'Processing', desc: 'Pharmacy is verifying items', icon: Clock, completed: latestOrder?.status !== 'Order Placed' },
    { label: 'Packed', desc: 'Your package is ready', icon: PackageCheck, completed: ['Packed', 'Shipped', 'Out For Delivery', 'Delivered'].includes(latestOrder?.status) },
    { label: 'Shipped', desc: 'Package left the pharmacy', icon: Truck, completed: ['Shipped', 'Out For Delivery', 'Delivered'].includes(latestOrder?.status) },
    { label: 'Out For Delivery', desc: 'Delivery partner is on the way', icon: MapPin, completed: ['Out For Delivery', 'Delivered'].includes(latestOrder?.status) },
    { label: 'Delivered', desc: 'Order delivered successfully', icon: Check, completed: latestOrder?.status === 'Delivered' },
  ];

  if (!latestOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-3 text-center sm:px-4">
          <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
            <PackageCheck className="mx-auto mb-4 text-teal-700" size={42} />
            <p className="text-xl font-semibold text-slate-950">No active orders to track</p>
            <p className="mt-2 text-slate-500">Your latest order status will appear here after checkout.</p>
          </div>
        </div>
      </div>
    );
  }

  const orderItems = latestOrder.items || [];
  const itemsSubtotal = latestOrder.subtotal ?? orderItems.reduce((sum, item) => sum + getLineTotal(item), 0);
  const discount = latestOrder.discount || 0;
  const delivery = latestOrder.delivery || 0;
  const gst = latestOrder.gst || 0;
  const payableAmount = latestOrder.totalAmount ?? Math.max(itemsSubtotal - discount, 0) + delivery + gst;
  const totalQuantity = orderItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const isB2B = latestOrder.accountType === 'B2B';

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-slate-950 md:text-3xl">Track Your Order</h1>
          <p className="mt-2 text-slate-500">Live status and delivery details for your latest order.</p>
        </div>

        <div className="mb-6 rounded-lg border border-slate-100 bg-white p-4 shadow-sm sm:p-6 md:mb-8">
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Order ID</p>
              <p className="font-bold text-slate-950">{latestOrder.orderNumber}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isB2B && (
                <span className="w-fit rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white">
                  B2B Order
                </span>
              )}
              <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
                {latestOrder.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div>
              <p className="text-slate-500 text-sm">Total Amount</p>
              <p className="font-semibold text-slate-950">{formatCurrency(payableAmount)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Items</p>
              <p className="font-semibold text-slate-950">{totalQuantity} item{totalQuantity > 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Payment</p>
              <p className="font-semibold capitalize text-slate-950">{latestOrder.paymentMethod}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Ordered On</p>
              <p className="font-semibold text-slate-950">{formatDateTime(latestOrder.createdAt)}</p>
            </div>
          </div>
          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-950">
              <MapPin size={17} className="text-teal-700" />
              Delivery Address
            </p>
            <p className="text-sm text-slate-600">{latestOrder.deliveryAddress}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Timeline */}
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-4 sm:p-6">
          <h2 className="mb-5 text-lg font-bold text-slate-950 sm:mb-6">Delivery Timeline</h2>
          <div className="space-y-5 sm:space-y-7">
            {statuses.map((status, index) => (
              <div key={index} className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full font-bold transition sm:h-11 sm:w-11 ${
                      status.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {status.completed ? <Check size={19} /> : <status.icon size={19} />}
                  </div>
                  {index < statuses.length - 1 && (
                    <div
                      className={`w-1 h-12 rounded-full transition ${
                        status.completed ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
                <div className="pb-6">
                  <h3 className={`font-semibold mb-1 ${status.completed ? 'text-slate-950' : 'text-slate-500'}`}>
                    {status.label}
                  </h3>
                  <p className="text-sm text-slate-500">{status.desc}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{status.completed ? 'Completed' : 'Pending'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-5">
          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-bold text-lg text-slate-950">Order Items</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {orderItems.length} product{orderItems.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-4">
              {orderItems.map((item, i) => {
                const product = dummyProducts.find(product => product.id === item.id);
                const unitPrice = getUnitPrice(item);
                const lineTotal = getLineTotal(item);

                return (
                  <Link
                    key={`${item.id}-${i}`}
                    to={`/order-details/${latestOrder.id}/${item.id}`}
                    className="grid gap-3 border-b border-slate-100 pb-4 transition last:border-b-0 hover:bg-teal-50/50 sm:grid-cols-[72px_1fr_auto] sm:items-start sm:gap-4"
                  >
                    <img
                      src={item.image || product?.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg border border-slate-100 bg-slate-50 object-contain p-1 sm:h-[72px] sm:w-[72px]"
                    />
                    <div className="min-w-0">
                      <p className="font-bold leading-6 text-slate-950">{item.name}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span>Qty: {item.quantity}</span>
                        <span>Unit: {formatCurrency(unitPrice)}</span>
                        {item.brand && <span>{item.brand}</span>}
                      </div>
                      {isB2B && (
                        <p className="mt-2 w-fit rounded bg-teal-50 px-2 py-1 text-xs font-bold text-teal-800">
                          Wholesale price applied
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-slate-500">Amount</p>
                      <p className="text-base font-extrabold text-slate-950">{formatCurrency(lineTotal)}</p>
                      <p className="mt-1 text-xs font-bold text-teal-700">View details</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-4 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-950">
              <ReceiptText size={20} className="text-teal-700" />
              Price Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-950">{formatCurrency(itemsSubtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between gap-4 text-emerald-700">
                  <span>Discount{latestOrder.couponCode ? ` (${latestOrder.couponCode})` : ''}</span>
                  <span className="font-bold">-{formatCurrency(discount)}</span>
                </div>
              )}
              {gst > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">GST</span>
                  <span className="font-bold text-slate-950">{formatCurrency(gst)}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Delivery</span>
                <span className="font-bold text-slate-950">{delivery === 0 ? 'FREE' : formatCurrency(delivery)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <div className="flex justify-between gap-4 text-lg">
                  <span className="font-extrabold text-slate-950">Total Paid</span>
                  <span className="font-extrabold text-slate-950">{formatCurrency(payableAmount)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-slate-50 p-4">
              <p className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-950">
                <CreditCard size={17} className="text-teal-700" />
                Payment Details
              </p>
              <p className="text-sm text-slate-600">{latestOrder.paymentMethod}</p>
              <p className="mt-1 text-xs text-slate-500">Delivery slot: {latestOrder.deliverySlot}</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
