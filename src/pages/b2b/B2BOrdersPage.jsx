import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

const B2BOrdersPage = () => {
  const orders = useSelector((state) => state.b2bPurchase.orders);

  return (
    <div className="min-h-screen bg-slate-50 py-6 dark:bg-slate-950 md:py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">B2B Procurement</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">B2B Purchase Orders</h1>
          </div>
          <Link to="/b2b/buy" className="btn-primary inline-flex h-11 items-center justify-center gap-2">
            <ShoppingBag size={18} />
            New Purchase
          </Link>
        </div>

        {!orders.length ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-lg font-bold text-slate-950 dark:text-white">No B2B purchase orders yet</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Placed purchase orders will appear here.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  <tr>
                    {['PO Number', 'Business', 'Items', 'Total', 'Payment Terms', 'Status', 'Created'].map((column) => (
                      <th key={column} className="px-4 py-3">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="text-slate-700 dark:text-slate-200">
                      <td className="px-4 py-4 font-bold text-slate-950 dark:text-white">{order.id}</td>
                      <td className="px-4 py-4">{order.businessName}</td>
                      <td className="px-4 py-4">{order.summary.itemCount}</td>
                      <td className="px-4 py-4 font-bold">{formatCurrency(order.summary.total)}</td>
                      <td className="px-4 py-4">{order.paymentTerms}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">{formatDateTime(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default B2BOrdersPage;
