import { useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { BUSINESS_STATUSES, BUSINESS_TYPES, EMPTY_BUSINESS } from '../../redux/businessSlice';

const validators = {
  businessName: (value) => {
    if (!value.trim()) return 'Business Name is required.';
    if (value.trim().length < 3) return 'Business Name must be at least 3 characters.';
    return '';
  },
  businessAddress: (value) => (!value.trim() ? 'Business Address is required.' : ''),
  city: (value) => (!value.trim() ? 'City is required.' : ''),
  state: (value) => (!value.trim() ? 'State is required.' : ''),
  pincode: (value) => (/^\d{6}$/.test(value) ? '' : 'Pincode must be exactly 6 digits.'),
  aadhaarNumber: (value) => (/^\d{12}$/.test(value) ? '' : 'Aadhaar Number must be exactly 12 digits.'),
  registrationNumber: (value) => (!value.trim() ? 'Registration Number is required.' : ''),
  mobileNumber: (value) => (/^\d{10}$/.test(value) ? '' : 'Mobile Number must be exactly 10 digits.'),
  emailAddress: (value) => (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address.'),
  gstNumber: (value) => (!value || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(value) ? '' : 'Enter a valid GST number.'),
  panNumber: (value) => (!value || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value) ? '' : 'Enter a valid PAN number.'),
};

const Field = ({ label, name, value, onChange, error, required, type = 'text', placeholder }) => (
  <label className="block">
    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
      {label} {required && <span className="text-rose-600">*</span>}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-sm font-medium outline-none transition focus:ring-2 focus:ring-teal-500/20 dark:bg-slate-950 dark:text-white ${
        error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-teal-600 dark:border-slate-700'
      }`}
    />
    {error && <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>}
  </label>
);

const Section = ({ title, children }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 className="text-base font-bold text-slate-950 dark:text-white">{title}</h2>
    <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
  </section>
);

const BusinessForm = ({ initialValues, onSubmit, submitLabel = 'Save Business', onCancel, showStatus = true }) => {
  const defaultValues = useMemo(() => ({ ...EMPTY_BUSINESS, ...initialValues }), [initialValues]);
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = Object.entries(validators).reduce((acc, [key, validator]) => {
      const message = validator(form[key] || '');
      if (message) acc[key] = message;
      return acc;
    }, {});

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue = ['aadhaarNumber', 'mobileNumber', 'alternateMobileNumber', 'pincode'].includes(name)
      ? value.replace(/\D/g, '')
      : ['gstNumber', 'panNumber'].includes(name)
        ? value.toUpperCase()
        : value;

    setForm((current) => ({ ...current, [name]: normalizedValue }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Section title="Business Information">
        <Field label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} error={errors.businessName} required />
        <Field label="Business Address" name="businessAddress" value={form.businessAddress} onChange={handleChange} error={errors.businessAddress} required />
        <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} required />
        <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} required />
        <Field label="State" name="state" value={form.state} onChange={handleChange} error={errors.state} required />
      </Section>

      <Section title="Verification Details">
        <Field label="Aadhaar Card Number" name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} error={errors.aadhaarNumber} required />
        <Field label="Driving License Number" name="drivingLicenseNumber" value={form.drivingLicenseNumber} onChange={handleChange} required />
        <Field label="Registration Number" name="registrationNumber" value={form.registrationNumber} onChange={handleChange} error={errors.registrationNumber} required />
      </Section>

      <Section title="Contact Details">
        <Field label="Contact Person Name" name="contactPersonName" value={form.contactPersonName} onChange={handleChange} />
        <Field label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} error={errors.mobileNumber} required />
        <Field label="Alternate Mobile Number" name="alternateMobileNumber" value={form.alternateMobileNumber} onChange={handleChange} />
        <Field label="Email Address" name="emailAddress" value={form.emailAddress} onChange={handleChange} error={errors.emailAddress} />
      </Section>

      <Section title="Business Details">
        <label className="block">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Business Type</span>
          <select name="businessType" value={form.businessType} onChange={handleChange} className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
            {BUSINESS_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <Field label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} error={errors.gstNumber} />
        <Field label="PAN Number" name="panNumber" value={form.panNumber} onChange={handleChange} error={errors.panNumber} />
        <Field label="Website URL" name="websiteUrl" value={form.websiteUrl} onChange={handleChange} type="url" />
        {showStatus && (
          <label className="block">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Status</span>
            <select name="status" value={form.status} onChange={handleChange} className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              {BUSINESS_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
        )}
      </Section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary h-11">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary inline-flex h-11 items-center justify-center gap-2">
          <Save size={18} />
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default BusinessForm;
