import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { getBusinessById } from '../../redux/businessSlice';
import { placeB2BOrder, selectB2BBusiness, selectB2BCartSummary } from '../../redux/b2bPurchaseSlice';
import { formatCurrency } from '../../utils/helpers';
import { useToast } from '../../components/common/Toast';

const B2BCheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const businesses = useSelector((state) => state.business.businesses);
  const { cart, selectedBusinessId } = useSelector((state) => state.b2bPurchase);
  const selectedBusiness = useSelector((state) => getBusinessById(state, selectedBusinessId));
  const summary = useSelector(selectB2BCartSummary);
  const [paymentTerms, setPaymentTerms] = useState('Pay on delivery');
  const [notes, setNotes] = useState('');

  const activeBusinesses = useMemo(() => businesses.filter((business) => business.status === 'Active'), [businesses]);

  const handlePlaceOrder = () => {
    if (!cart.length) {
      addToast('Add products before checkout.', 'warning');
      navigate('/b2b/buy');
      return;
    }

    if (!selectedBusiness) {
      addToast('Select an active business before placing the purchase order.', 'error');
      return;
    }

    dispatch(placeB2BOrder({
      businessId: selectedBusiness.id,
      businessName: selectedBusiness.businessName,
      registrationNumber: selectedBusiness.registrationNumber,
      items: cart,
      summary,
      paymentTerms,
      notes,
    }));
    addToast('B2B purchase order created successfully.', 'success');
    navigate('/b2b/orders');
  };

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-950">No products selected for B2B checkout</h1>
        <button type="button" onClick={() => navigate('/b2b/buy')} className="btn-primary mt-5">Buy Products</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 dark:bg-slate-950 md:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-5">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">B2B Procurement</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">B2B Checkout</h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Business Buyer</h2>
              <select
                value={selectedBusinessId}
                onChange={(event) => dispatch(selectB2BBusiness(event.target.value))}
                className="input-base mt-4 h-11 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="">Select active business</option>
                {activeBusinesses.map((business) => (
                  <option key={business.id} value={business.id}>{business.businessName}</option>
                ))}
              </select>
              {selectedBusiness && (
                <div className="mt-4 rounded-lg bg-teal-50 p-4 text-sm text-teal-900 dark:bg-teal-500/10 dark:text-teal-100">
                  <p className="font-bold">{selectedBusiness.businessName}</p>
                  <p className="mt-1">{selectedBusiness.businessAddress}, {selectedBusiness.city}, {selectedBusiness.state} {selectedBusiness.pincode}</p>
                  <p className="mt-1">GST: {selectedBusiness.gstNumber || 'Not provided'}</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Payment Terms</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {['Pay on delivery', 'Net 15', 'Net 30'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setPaymentTerms(term)}
                    className={`rounded-lg border px-4 py-3 text-sm font-bold transition ${
                      paymentTerms === term
                        ? 'border-teal-700 bg-teal-50 text-teal-800 dark:border-teal-400 dark:bg-teal-500/10 dark:text-teal-100'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="Purchase order notes, expected delivery date, or special instructions"
                className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </section>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Items</span><span className="font-bold">{summary.itemCount}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold">{formatCurrency(summary.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">GST</span><span className="font-bold">{formatCurrency(summary.gst)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Delivery</span><span className="font-bold">{summary.delivery ? formatCurrency(summary.delivery) : 'Free'}</span></div>
              <div className="border-t border-slate-100 pt-3 text-base dark:border-slate-800">
                <div className="flex justify-between"><span className="font-bold">Total</span><span className="font-extrabold">{formatCurrency(summary.total)}</span></div>
              </div>
            </div>
            <button type="button" onClick={handlePlaceOrder} className="btn-primary mt-5 inline-flex h-11 w-full items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              Place Purchase Order
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default B2BCheckoutPage;
