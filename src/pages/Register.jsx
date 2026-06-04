import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/index.js';
import { useToast } from '../components/common/Toast';
import { validateEmail, validateMobile } from '../utils/helpers.js';
import { siteBanners } from '../data/dummy.js';
import { LockKeyhole, Mail, Phone, Pill, ShieldCheck, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const { addToast } = useToast();
  const redirectTo = searchParams.get('redirect') || '/account';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = () => {
    // Validation
    if (formData.name.length < 2) {
      addToast('Name must be at least 2 characters', 'error');
      return;
    }
    if (!validateEmail(formData.email)) {
      addToast('Invalid email address', 'error');
      return;
    }
    if (!validateMobile(formData.mobile)) {
      addToast('Invalid mobile number', 'error');
      return;
    }
    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    const user = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
    };

    login(user);
    addToast('Registration successful!', 'success');
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-3 py-4 sm:px-4 sm:py-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex items-center justify-center p-4 sm:p-10">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-950 sm:mb-8 sm:text-2xl lg:hidden">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-700 text-white sm:h-11 sm:w-11">
                <Pill />
              </span>
              MediCare
            </Link>
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Create Account</h1>
            <p className="mb-6 mt-2 text-sm text-slate-500 sm:mb-8 sm:text-base">Save addresses, track orders, and reorder health essentials faster.</p>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
                className="input-base pl-11"
            />
            </div>
            {formData.name && formData.name.length < 2 && (
              <p className="text-xs text-danger-600 mt-1">Minimum 2 characters required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
                className="input-base pl-11"
            />
            </div>
            {formData.email && !validateEmail(formData.email) && (
              <p className="text-xs text-danger-600 mt-1">Invalid email format</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="tel"
              name="mobile"
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChange={(e) => handleChange({
                  target: { name: 'mobile', value: e.target.value.replace(/\D/g, '').slice(0, 10) }
              })}
              maxLength="10"
                className="input-base pl-11"
            />
            </div>
            {formData.mobile && !validateMobile(formData.mobile) && (
              <p className="text-xs text-danger-600 mt-1">Invalid mobile number</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
                className="input-base pl-11"
            />
            </div>
            {formData.password && formData.password.length < 6 && (
              <p className="text-xs text-danger-600 mt-1">Minimum 6 characters required</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
                className="input-base pl-11"
            />
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-danger-600 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1 accent-teal-700" defaultChecked />
            <span className="text-xs text-slate-600">
              I agree to the <a href="#" className="text-primary-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
            </span>
          </label>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="btn-primary w-full"
          >
            Create Account
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-500">Already have an account?</span>
          </div>
        </div>

        {/* Login Link */}
        <Link to={`/login${redirectTo !== '/account' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="btn-outline block w-full text-center">
          Sign In
        </Link>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <img src={siteBanners.hero} alt="MediCare account benefits" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/55 to-teal-950/30" />
          <div className="relative flex h-full min-h-[760px] flex-col justify-between p-10 text-white">
            <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-600">
                <Pill />
              </span>
              MediCare
            </Link>
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-emerald-100 backdrop-blur">
                <ShieldCheck size={16} />
                Trusted healthcare delivery
              </div>
              <h2 className="text-4xl font-bold leading-tight">A cleaner way to manage medicine orders for your family.</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
