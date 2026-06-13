import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Building2, CheckCircle2, LockKeyhole, Pencil, ShoppingCart } from 'lucide-react';
import BusinessForm from '../../components/b2b/BusinessForm';
import BusinessDetails from '../../components/b2b/BusinessDetails';
import { addBusiness } from '../../redux/businessSlice';
import { useAuthStore } from '../../store/index.js';
import { useToast } from '../../components/common/Toast';

const B2BPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoggedIn, attachBusinessProfile } = useAuthStore();
  const { addToast } = useToast();
  const business = user?.businessProfile;

  const handleSubmit = (form) => {
    const businessPayload = {
      ...form,
      status: 'Active',
      contactPersonName: form.contactPersonName || user?.name || '',
      mobileNumber: form.mobileNumber || user?.mobile || '',
      emailAddress: form.emailAddress || user?.email || '',
    };
    const action = dispatch(addBusiness(businessPayload));

    attachBusinessProfile(action.payload);
    addToast('Business registration submitted. B2B storefront is active.', 'success');
    navigate('/products');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">B2B website account</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-slate-950">Register your business and shop from the same storefront.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Login first, submit the Business Registration Form, then continue to categories, products, wishlist, cart, and checkout with B2B pricing.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/login?redirect=/b2b" className="btn-primary inline-flex items-center justify-center gap-2 py-3">
                <LockKeyhole size={18} />
                Login for B2B
              </Link>
              <Link to="/register?redirect=/b2b" className="btn-outline inline-flex items-center justify-center gap-2 py-3">
                Create account
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-teal-50 text-teal-700">
              <Building2 size={28} />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-slate-950">Business Registration Form</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The form opens after login so the business profile can be linked with your website account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (business) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                  <CheckCircle2 size={17} />
                  B2B storefront active
                </div>
                <h1 className="mt-4 text-3xl font-extrabold text-slate-950">Business Registration Form Details</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Your B2B account is connected to the website. Checkout will use the registered business address below for B2B orders.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to={`/b2b/edit/${business.id}`} className="btn-outline inline-flex items-center justify-center gap-2 py-3">
                  <Pencil size={18} />
                  Edit Details
                </Link>
                <Link to="/cart" className="btn-primary inline-flex items-center justify-center gap-2 py-3">
                  <ShoppingCart size={18} />
                  Open B2B cart
                </Link>
              </div>
            </div>
          </div>

          <BusinessDetails business={business} />

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link to="/products" className="rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-950 shadow-sm hover:border-teal-300 hover:bg-teal-50">
              Shop B2B products
            </Link>
            <Link to="/wishlist" className="rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-950 shadow-sm hover:border-teal-300 hover:bg-teal-50">
              View wishlist
            </Link>
            <Link to="/checkout" className="rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-950 shadow-sm hover:border-teal-300 hover:bg-teal-50">
              Continue checkout
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">B2B website account</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Business Registration Form</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Submit your business details once. After submission, the website storefront will show B2B pricing across categories, products, wishlist, cart, and checkout.
          </p>
        </div>

        <BusinessForm
          initialValues={{
            contactPersonName: user?.name || '',
            mobileNumber: user?.mobile || '',
            emailAddress: user?.email || '',
          }}
          onSubmit={handleSubmit}
          submitLabel="Submit and shop B2B"
          showStatus={false}
        />
      </div>
    </div>
  );
};

export default B2BPage;
