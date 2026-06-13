import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/index.js';
import { useToast } from '../components/common/Toast';
import LoadingButton from '../components/common/LoadingButton.jsx';
import { validateEmail, validateMobile } from '../utils/helpers.js';
import { apiErrorMessage } from '../api/client.js';
import { siteBanners } from '../data/dummy.js';
import { LockKeyhole, Mail, Phone, Pill, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [loginType, setLoginType] = useState('mobile'); // mobile or email
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAction, setLoadingAction] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const { addToast } = useToast();
  const redirectTo = searchParams.get('redirect') || '/account';

  const handleMobileLogin = () => {
    if (!validateMobile(mobile)) {
      addToast('Invalid mobile number', 'error');
      return;
    }
    setLoadingAction('send-otp');
    window.setTimeout(() => {
      setShowOtp(true);
      setLoadingAction('');
      addToast('OTP sent to your mobile', 'success');
    }, 500);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      addToast('Invalid OTP', 'error');
      return;
    }
    setLoadingAction('verify-otp');
    try {
      // No OTP backend yet — treat the entered code as the account password.
      await login(mobile, otp);
      addToast('Login successful!', 'success');
      navigate(redirectTo);
    } catch (err) {
      addToast(apiErrorMessage(err, 'Login failed'), 'error');
    } finally {
      setLoadingAction('');
    }
  };

  const handleEmailLogin = async () => {
    if (!validateEmail(email)) {
      addToast('Invalid email address', 'error');
      return;
    }
    if (password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoadingAction('email-login');
    try {
      await login(email, password);
      addToast('Login successful!', 'success');
      navigate(redirectTo);
    } catch (err) {
      addToast(apiErrorMessage(err, 'Login failed'), 'error');
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-3 py-4 sm:px-4 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl sm:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden lg:block">
          <img src={siteBanners.hero} alt="MediCare pharmacy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/60 to-teal-950/30" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-600">
                <Pill />
              </span>
              MediCare
            </Link>
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-emerald-100 backdrop-blur">
                <ShieldCheck size={16} />
                Secure health account
              </div>
              <h1 className="text-4xl font-bold leading-tight">Fast medicine orders, saved addresses, and health essentials.</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-4 sm:p-10">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-6 flex items-center gap-3 text-xl font-bold text-slate-950 sm:mb-8 sm:text-2xl lg:hidden">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-700 text-white sm:h-11 sm:w-11">
                <Pill />
              </span>
              MediCare
            </Link>
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Welcome back</h1>
            <p className="mt-2 text-slate-500">Sign in to continue your healthcare order.</p>

        {/* Login Type Tabs */}
            <div className="my-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1 sm:my-8">
          <button
            onClick={() => {
              setLoginType('mobile');
              setShowOtp(false);
            }}
                className={`rounded-md px-3 py-2.5 text-sm font-semibold transition sm:px-4 sm:text-base ${
              loginType === 'mobile'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
            }`}
          >
                Mobile OTP
          </button>
          <button
            onClick={() => setLoginType('email')}
                className={`rounded-md px-3 py-2.5 text-sm font-semibold transition sm:px-4 sm:text-base ${
              loginType === 'email'
                    ? 'bg-white text-teal-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Email
          </button>
        </div>

        {/* Mobile Login */}
        {loginType === 'mobile' && (
          <div className="space-y-4">
            {!showOtp ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength="10"
                      className="input-base pl-11"
                  />
                  </div>
                </div>
                <LoadingButton
                  onClick={handleMobileLogin}
                  isLoading={loadingAction === 'send-otp'}
                  loadingText="Sending OTP..."
                  className="btn-primary inline-flex w-full items-center justify-center gap-2"
                >
                  Send OTP
                </LoadingButton>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength="4"
                    className="input-base text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-slate-500 mt-2">Check your SMS for OTP</p>
                </div>
                <LoadingButton
                  onClick={handleVerifyOtp}
                  isLoading={loadingAction === 'verify-otp'}
                  loadingText="Verifying..."
                  className="btn-primary inline-flex w-full items-center justify-center gap-2"
                >
                  Verify OTP
                </LoadingButton>
                <button
                  onClick={() => setShowOtp(false)}
                  className="btn-secondary w-full"
                >
                  Back
                </button>
              </>
            )}
          </div>
        )}

        {/* Email Login */}
        {loginType === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                  className="input-base pl-11"
              />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  className="input-base pl-11"
              />
              </div>
            </div>
            <LoadingButton
              onClick={handleEmailLogin}
              isLoading={loadingAction === 'email-login'}
              loadingText="Logging in..."
              className="btn-primary inline-flex w-full items-center justify-center gap-2"
            >
              Login
            </LoadingButton>
          </div>
        )}

        {/* Divider */}
        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-500">New to MediCare?</span>
          </div>
        </div>

        {/* Register Link */}
        <Link to={`/register${redirectTo !== '/account' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="btn-outline block w-full text-center">
          Create an Account
        </Link>

        {/* Demo Credentials */}
            <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-4 sm:mt-8">
              <p className="text-xs font-semibold text-teal-900 mb-2">Demo Credentials:</p>
              <p className="text-xs text-teal-800">Mobile: 9876543210</p>
              <p className="text-xs text-teal-800">OTP: Any 4 digits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
