import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/helpers';
import { removeB2BItem, selectB2BCartSummary, updateB2BQuantity } from '../../redux/b2bPurchaseSlice';
import EmptyState from '../../components/common/EmptyState';

const B2BCartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.b2bPurchase.cart);
  const summary = useSelector(selectB2BCartSummary);

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <EmptyState
          type="cart"
          title="B2B Cart is Empty"
          description="Add products from the B2B buying catalog to prepare a purchase order."
          actionText="Buy Products"
          onAction={() => navigate('/b2b/buy')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 dark:bg-slate-950 md:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">B2B Procurement</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">B2B Cart</h1>
          </div>
          <Link to="/b2b/buy" className="btn-outline inline-flex h-11 items-center justify-center gap-2">
            <ShoppingBag size={18} />
            Add More Products
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {cart.map((item) => (
              <div key={item.id} className="grid gap-4 border-b border-slate-100 p-4 last:border-b-0 dark:border-slate-800 sm:grid-cols-[120px_1fr_150px]">
                <img src={item.image} alt={item.name} className="h-28 w-28 rounded-lg bg-slate-50 object-contain p-2 dark:bg-slate-950" />
                <div>
                  <h2 className="font-bold text-slate-950 dark:text-white">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.brand}</p>
                  <p className="mt-2 text-sm font-bold text-teal-700 dark:text-teal-300">{formatCurrency(item.b2bPrice)} per unit</p>
                  <button type="button" onClick={() => dispatch(removeB2BItem(item.id))} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-rose-600 hover:text-rose-700">
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
                <div className="sm:text-right">
                  <div className="inline-flex h-10 items-center rounded-lg border border-slate-200 dark:border-slate-700">
                    <button type="button" onClick={() => dispatch(updateB2BQuantity({ productId: item.id, quantity: item.quantity - 1 }))} className="grid h-10 w-10 place-items-center" aria-label="Decrease quantity">
                      <Minus size={16} />
                    </button>
                    <span className="min-w-12 text-center text-sm font-bold text-slate-950 dark:text-white">{item.quantity}</span>
                    <button type="button" onClick={() => dispatch(updateB2BQuantity({ productId: item.id, quantity: item.quantity + 1 }))} className="grid h-10 w-10 place-items-center" aria-label="Increase quantity">
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="mt-3 text-lg font-extrabold text-slate-950 dark:text-white">{formatCurrency(item.b2bPrice * item.quantity)}</p>
                </div>
              </div>
            ))}
          </section>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Purchase Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Items</span><span className="font-bold">{summary.itemCount}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold">{formatCurrency(summary.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">GST 12%</span><span className="font-bold">{formatCurrency(summary.gst)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span className="font-bold">{summary.delivery ? formatCurrency(summary.delivery) : 'Free'}</span></div>
              <div className="border-t border-slate-100 pt-3 text-base dark:border-slate-800">
                <div className="flex justify-between"><span className="font-bold">Total</span><span className="font-extrabold">{formatCurrency(summary.total)}</span></div>
              </div>
            </div>
            <button type="button" onClick={() => navigate('/b2b/checkout')} className="btn-primary mt-5 h-11 w-full">
              Proceed to B2B Checkout
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default B2BCartPage;
