import { useEffect } from 'react';
import { useOrdersStore } from '../store/index.js';
import { dummyProducts } from '../data/dummy.js';
import { Check, Clock, MapPin, PackageCheck, ShoppingBag, Truck } from 'lucide-react';
import { formatCurrency } from '../utils/helpers.js';

const TrackOrder = () => {
  const { orders, fetchOrders } = useOrdersStore();
  const latestOrder = orders[0];

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
            <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
              {latestOrder.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div>
              <p className="text-slate-500 text-sm">Total Amount</p>
              <p className="font-semibold text-slate-950">{formatCurrency(latestOrder.totalAmount)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Delivery Slot</p>
              <p className="font-semibold text-slate-950">{latestOrder.deliverySlot}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Payment</p>
              <p className="font-semibold capitalize text-slate-950">{latestOrder.paymentMethod}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Estimated Delivery</p>
              <p className="font-semibold text-slate-950">1-2 days</p>
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

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
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
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-4 sm:p-6">
          <h2 className="font-bold text-lg mb-4 text-slate-950">Order Items</h2>
          <div className="space-y-4">
            {latestOrder.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-b-0 sm:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={item.image || dummyProducts.find(product => product.id === item.id)?.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-lg border border-slate-100 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-semibold text-slate-950 sm:text-base">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
