const statusClass = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20',
  Inactive: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20',
  'Pending Approval': 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20',
};

const DetailRow = ({ label, value }) => (
  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-slate-100">{value || '-'}</p>
  </div>
);

const Section = ({ title, children }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  </section>
);

const BusinessDetails = ({ business }) => {
  if (!business) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <p className="text-lg font-bold text-slate-950 dark:text-white">Business record not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-teal-700 dark:text-teal-300">{business.id}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{business.businessName}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{business.registrationNumber}</p>
          </div>
          <span className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-bold ring-1 ${statusClass[business.status]}`}>
            {business.status}
          </span>
        </div>
      </div>

      <Section title="Business Information">
        <DetailRow label="Business Name" value={business.businessName} />
        <DetailRow label="Address" value={business.businessAddress} />
        <DetailRow label="City" value={business.city} />
        <DetailRow label="State" value={business.state} />
        <DetailRow label="Pincode" value={business.pincode} />
      </Section>

      <Section title="Verification Details">
        <DetailRow label="Aadhaar Number" value={business.aadhaarNumber} />
        <DetailRow label="DL Number" value={business.drivingLicenseNumber} />
        <DetailRow label="Registration Number" value={business.registrationNumber} />
      </Section>

      <Section title="Contact Details">
        <DetailRow label="Contact Person" value={business.contactPersonName} />
        <DetailRow label="Mobile" value={business.mobileNumber} />
        <DetailRow label="Email" value={business.emailAddress} />
      </Section>

      <Section title="Business Details">
        <DetailRow label="GST Number" value={business.gstNumber} />
        <DetailRow label="PAN Number" value={business.panNumber} />
        <DetailRow label="Business Type" value={business.businessType} />
        <DetailRow label="Website" value={business.websiteUrl} />
        <DetailRow label="Status" value={business.status} />
      </Section>
    </div>
  );
};

export default BusinessDetails;
