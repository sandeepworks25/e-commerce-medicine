import { Link } from 'react-router-dom';
import { BadgeCheck, LockKeyhole, Mail, MapPin, Phone, Pill, ShieldCheck, Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-10 bg-slate-950 text-white md:mt-16">
      <div className="max-w-7xl mx-auto px-3 py-8 sm:px-4 md:py-12">
        <div className="mb-8 grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {/* About */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-700">
                <Pill size={22} />
              </span>
              MediCare
            </h3>
            <p className="text-slate-400 text-sm">
              Your trusted online pharmacy for genuine medicines and healthcare products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/products" className="text-slate-400 hover:text-white transition">Shop</Link></li>
              <li><Link to="/blogs" className="text-slate-400 hover:text-white transition">Blogs</Link></li>
              <li><Link to="/about-us" className="text-slate-400 hover:text-white transition">About</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold mb-4">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-slate-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-slate-400 hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="text-slate-400 hover:text-white transition">Refund Policy</Link></li>
              <li><Link to="/faq" className="text-slate-400 hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><Phone size={16} /> +91-1234-567890</li>
              <li className="flex items-center gap-2"><Mail size={16} /> support@medicare.com</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> Mumbai, India</li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-white/10 pt-8">
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <ShieldCheck className="mx-auto mb-2 text-emerald-300" size={24} />
              <p className="text-sm text-slate-400">Genuine Medicines</p>
            </div>
            <div className="text-center">
              <Truck className="mx-auto mb-2 text-emerald-300" size={24} />
              <p className="text-sm text-slate-400">Fast Delivery</p>
            </div>
            <div className="text-center">
              <LockKeyhole className="mx-auto mb-2 text-emerald-300" size={24} />
              <p className="text-sm text-slate-400">Secure Payments</p>
            </div>
            <div className="text-center">
              <BadgeCheck className="mx-auto mb-2 text-emerald-300" size={24} />
              <p className="text-sm text-slate-400">Licensed Pharmacy</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center text-xs leading-6 text-slate-400 sm:pt-8 sm:text-sm">
            <p>© 2024 MediCare. All rights reserved. Licensed Pharmacy | Reg. No. 12345</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
