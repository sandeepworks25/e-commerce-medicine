import { Activity, Building2, Clock3, PauseCircle, Sparkles } from 'lucide-react';

const iconMap = {
  total: Building2,
  active: Activity,
  pending: Clock3,
  inactive: PauseCircle,
  today: Sparkles,
};

const toneMap = {
  total: 'bg-teal-50 text-teal-700 ring-teal-100 dark:bg-teal-500/10 dark:text-teal-200 dark:ring-teal-500/20',
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20',
  inactive: 'bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20',
  today: 'bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-500/10 dark:text-sky-200 dark:ring-sky-500/20',
};

const BusinessCard = ({ label, value, type }) => {
  const Icon = iconMap[type] || Building2;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ring-1 ${toneMap[type]}`}>
          <Icon size={22} />
        </span>
      </div>
    </div>
  );
};

export default BusinessCard;
