import { RotateCcw, Search } from 'lucide-react';
import { BUSINESS_STATUSES, BUSINESS_TYPES } from '../../redux/businessSlice';

const uniqueValues = (items, key) => [...new Set(items.map((item) => item[key]).filter(Boolean))].sort();

const BusinessFilters = ({ businesses, searchQuery, filters, onSearch, onFilter, onReset }) => {
  const states = uniqueValues(businesses, 'state');
  const cities = uniqueValues(businesses, 'city');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_repeat(4,minmax(140px,180px))_auto]">
        <label className="relative block">
          <span className="sr-only">Search businesses</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={searchQuery}
            onChange={(event) => onSearch(event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-teal-600 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-teal-400"
            placeholder="Search name, registration, mobile"
          />
        </label>

        <select value={filters.state} onChange={(event) => onFilter({ state: event.target.value })} className="input-base h-11 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
          <option value="">All States</option>
          {states.map((state) => <option key={state} value={state}>{state}</option>)}
        </select>

        <select value={filters.city} onChange={(event) => onFilter({ city: event.target.value })} className="input-base h-11 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
          <option value="">All Cities</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>

        <select value={filters.businessType} onChange={(event) => onFilter({ businessType: event.target.value })} className="input-base h-11 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
          <option value="">All Types</option>
          {BUSINESS_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>

        <select value={filters.status} onChange={(event) => onFilter({ status: event.target.value })} className="input-base h-11 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
          <option value="">All Status</option>
          {BUSINESS_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>

        <button type="button" onClick={onReset} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
          <RotateCcw size={17} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default BusinessFilters;
