import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dummyProducts, dummyCategories, dummyBlogs, dummyFAQs, fetchHomeBanners, siteBanners } from '../data/dummy';
import { catalogApi, assetUrl } from '../api/index.js';
import ProductCard from '../components/products/ProductCard';
import BlogCard from '../components/home/BlogCard';
import Modal from '../components/common/Modal.jsx';
import { useAuthStore } from '../store/index.js';
import {
  BadgeCheck,
  ChevronDown,
  HeartPulse,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Stethoscope,
  Truck,
  UserPlus,
  Zap,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [products, setProducts] = useState(dummyProducts);
  const [categories, setCategories] = useState(dummyCategories);
  const topProducts = products.slice(0, 8);
  const featuredBlogs = dummyBlogs.slice(0, 3);

  useEffect(() => {
    catalogApi
      .products()
      .then((list) => {
        if (list.length) setProducts(list);
      })
      .catch(() => {});
    catalogApi
      .categories()
      .then((list) => {
        if (list.length) setCategories(list);
      })
      .catch(() => {});
  }, []);

  const [activeFAQ, setActiveFAQ] = useState(0);
  const [bannerSlides, setBannerSlides] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [showPrescriptionLoginPrompt, setShowPrescriptionLoginPrompt] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchHomeBanners().then((slides) => {
      if (isMounted) {
        setBannerSlides(slides);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (bannerSlides.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % bannerSlides.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [bannerSlides.length]);

  const handleUploadPrescriptionClick = () => {
    if (isLoggedIn) {
      navigate('/upload-prescription');
      return;
    }

    setShowPrescriptionLoginPrompt(true);
  };

  const goToAuth = (path) => {
    setShowPrescriptionLoginPrompt(false);
    navigate(`${path}?redirect=${encodeURIComponent('/upload-prescription')}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner Carousel */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-4 md:pt-6">
          <div className="relative min-h-[430px] overflow-hidden rounded-lg bg-slate-950 shadow-2xl shadow-slate-900/15 sm:min-h-0">
            <div className="absolute inset-0 sm:relative sm:aspect-[16/7] md:aspect-[16/5]">
              {(bannerSlides.length ? bannerSlides : [{ id: 'fallback', image: siteBanners.hero, alt: 'Healthcare banner' }]).map((slide, index) => (
                <img
                  key={slide.id}
                  src={slide.image}
                  alt={slide.alt}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    index === activeBanner ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/10 sm:bg-gradient-to-r sm:from-slate-950/85 sm:via-slate-950/35 sm:to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex max-w-xl flex-col justify-end px-4 pb-12 pt-20 text-white sm:inset-y-0 sm:left-0 sm:right-auto sm:justify-center sm:px-8 sm:pb-0 sm:pt-0 md:px-10">
              <span className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur sm:mb-3 sm:text-xs">
                <HeartPulse size={14} />
                Premium pharmacy care
              </span>
              <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl md:text-5xl">Genuine healthcare, delivered with confidence</h1>
              <p className="mt-2 max-w-md text-xs leading-5 text-slate-100 sm:mt-3 sm:text-base sm:leading-6">
                Shop medicines, wellness essentials, and health devices from trusted pharmacy partners.
              </p>
              <div className="mt-4 flex flex-col gap-2 min-[420px]:flex-row sm:mt-5 sm:flex-wrap sm:gap-3">
                <Link to="/products" className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-xs font-bold text-slate-950 hover:bg-slate-100 sm:h-11 sm:px-5 sm:text-sm">
                  Shop medicines
                </Link>
                <button
                  type="button"
                  onClick={handleUploadPrescriptionClick}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/40 px-4 text-xs font-bold text-white hover:bg-white/10 sm:h-11 sm:px-5 sm:text-sm"
                >
                  Upload prescription
                </button>
              </div>
            </div>
            {bannerSlides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:gap-2">
                {bannerSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveBanner(index)}
                    className={`h-2 rounded-full transition-all sm:h-2.5 ${
                      index === activeBanner ? 'w-6 bg-white sm:w-8' : 'w-2 bg-white/60 sm:w-2.5'
                    }`}
                    aria-label={`Show banner ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Modal
        isOpen={showPrescriptionLoginPrompt}
        onClose={() => setShowPrescriptionLoginPrompt(false)}
        title="Login to upload prescription"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700">
            <LockKeyhole size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-950">Please login first</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Login to upload prescriptions and track their review status.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => goToAuth('/login')}
              className="btn-primary inline-flex items-center justify-center gap-2 py-3"
            >
              <LockKeyhole size={18} />
              Login
            </button>
            <button
              type="button"
              onClick={() => goToAuth('/register')}
              className="btn-outline inline-flex items-center justify-center gap-2 py-3"
            >
              <UserPlus size={18} />
              Create Account
            </button>
          </div>
        </div>
      </Modal>

      {/* Trust Strip */}
      <section className="bg-white pb-6 pt-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 gap-2 rounded-lg border border-slate-100 bg-white p-2 shadow-sm sm:grid-cols-2 sm:gap-3 sm:p-3 md:grid-cols-4">
            {[
              { icon: ShieldCheck, title: 'Genuine Medicines', desc: 'Verified suppliers' },
              { icon: Zap, title: 'Fast Delivery', desc: '1-2 days in cities' },
              { icon: BadgeCheck, title: 'Secure Payments', desc: 'Trusted checkout' },
              { icon: Stethoscope, title: 'Licensed Pharmacy', desc: 'Certified partners' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-3 sm:py-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700 sm:h-10 sm:w-10">
                  <item.icon size={20} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold leading-tight text-slate-950">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 py-9 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="mb-5 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-500">Medicine Categories</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">Shop by category</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Tap a category to open matching medicines, similar to a quick grocery-style category shelf.
              </p>
            </div>
            <Link to="/products" className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800">
              Open medicine page
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8">
            {categories.map(category => (
              <Link
                key={category._id || category.id}
                to={`/products?category=${category.slug}`}
                className="group text-center"
              >
                <span className="block rounded-lg bg-indigo-50 p-2 transition group-hover:-translate-y-0.5 group-hover:bg-teal-50">
                  <img
                    src={category._id ? assetUrl(category.image) : category.image}
                    alt={category.name}
                    className="h-[82px] w-full rounded-md object-cover shadow-sm sm:h-[92px]"
                  />
                </span>
                <span className="mt-2 block text-sm font-bold leading-tight text-slate-950">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="mb-5 flex items-end justify-between gap-4 sm:mb-7">
            <div>
              <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">Top Selling Products</h2>
              <p className="mt-1 text-sm text-slate-500">Carefully picked essentials for everyday health.</p>
            </div>
            <Link to="/products" className="hidden sm:inline-flex btn-outline">Explore</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
            {topProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-slate-950 py-8 text-white md:py-14">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
              <img src={siteBanners.delivery} alt="Fast healthcare delivery" className="h-36 w-full object-cover opacity-80 sm:h-44" />
              <div className="p-4 sm:p-6">
                <Truck className="mb-3 text-emerald-300" />
                <h3 className="text-xl font-semibold mb-2">Free Delivery</h3>
                <p className="text-slate-300">On orders above ₹499</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
              <img src={siteBanners.pharmacy} alt="Genuine medicines" className="h-36 w-full object-cover opacity-80 sm:h-44" />
              <div className="p-4 sm:p-6">
                <PackageCheck className="mb-3 text-amber-200" />
                <h3 className="text-xl font-semibold mb-2">Genuine Medicines</h3>
                <p className="text-slate-300">100% authentic and licensed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Preview */}
      <section className="bg-gray-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <h2 className="mb-5 text-xl font-bold sm:mb-8 sm:text-2xl">Health Blogs</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {featuredBlogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/blogs" className="btn-outline">
              View All Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-700">Help Center</p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">Frequently Asked Questions</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Quick answers for ordering medicines, prescriptions, delivery, and returns.</p>
            </div>
            <Link to="/customer-care" className="inline-flex h-11 items-center rounded-lg border border-teal-700 px-5 text-sm font-bold text-teal-700 hover:bg-teal-50">
              24x7 support
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-[320px_1fr]">
            <div className="rounded-lg bg-slate-950 p-6 text-white">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-500/20 text-teal-200">
                <Stethoscope size={26} />
              </div>
              <h3 className="mt-5 text-xl font-bold">Need help choosing care?</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">Our support team can guide you with order, prescription, and delivery questions any time.</p>
              <Link to="/customer-care" className="mt-6 inline-flex text-sm font-bold text-teal-200 hover:text-white">
                Contact customer care
              </Link>
            </div>
            <div className="space-y-3">
            {dummyFAQs.slice(0, 5).map((faq, i) => (
              <div
                key={faq.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-teal-50 sm:px-5"
                >
                  <h3 className="text-sm font-bold text-slate-950 sm:text-base">{faq.question}</h3>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-teal-700 transition-transform ${activeFAQ === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeFAQ === i && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 sm:px-5">
                    <p className="text-sm leading-6 text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
