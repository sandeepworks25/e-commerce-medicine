import { Eye, Pencil, Trash2 } from 'lucide-react';

const statusClass = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20',
  Inactive: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20',
  'Pending Approval': 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20',
};

const formatDate = (value) => new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(new Date(value));

const BusinessTable = ({ businesses, onView, onEdit, onDelete, loading, error }) => {
  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
        <p className="text-lg font-bold text-rose-700 dark:text-rose-200">Unable to load businesses</p>
        <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{error}</p>
      </div>
    );
  }

  if (!businesses.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-lg font-bold text-slate-950 dark:text-white">No businesses found</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try clearing filters or add a new B2B business.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              {['Business ID', 'Business Name', 'Contact Person', 'Mobile', 'City', 'State', 'GST Number', 'Registration Number', 'Status', 'Created Date', 'Actions'].map((column) => (
                <th key={column} className="px-4 py-3">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {businesses.map((business) => (
              <tr key={business.id} className="text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60">
                <td className="px-4 py-4 font-bold text-slate-950 dark:text-white">{business.id}</td>
                <td className="px-4 py-4 font-semibold">{business.businessName}</td>
                <td className="px-4 py-4">{business.contactPersonName || '-'}</td>
                <td className="px-4 py-4">{business.mobileNumber}</td>
                <td className="px-4 py-4">{business.city}</td>
                <td className="px-4 py-4">{business.state}</td>
                <td className="px-4 py-4">{business.gstNumber || '-'}</td>
                <td className="px-4 py-4">{business.registrationNumber}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClass[business.status]}`}>
                    {business.status}
                  </span>
                </td>
                <td className="px-4 py-4">{formatDate(business.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onView(business)} className="rounded-lg p-2 text-slate-500 transition hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-500/10" aria-label={`View ${business.businessName}`}>
                      <Eye size={17} />
                    </button>
                    <button type="button" onClick={() => onEdit(business)} className="rounded-lg p-2 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-500/10" aria-label={`Edit ${business.businessName}`}>
                      <Pencil size={17} />
                    </button>
                    <button type="button" onClick={() => onDelete(business)} className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10" aria-label={`Delete ${business.businessName}`}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessTable;
