import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Headphones, Heart, LockKeyhole, LogOut, MapPin, Menu, Pill, Search, ShoppingCart, User, UserPlus, X } from 'lucide-react';
import { useCartStore, useAuthStore } from '../../store/index.js';
import { dummyBrands, dummyCategories, dummyProducts } from '../../data/dummy.js';
import { catalogApi } from '../../api/index.js';
import { getInitials } from '../../utils/helpers.js';
import { buildAreaLabel, LOCATION_CHANGE_EVENT, readStoredLocationLabel, reverseGeocode, saveLocationLabel } from '../../utils/location.js';
import Modal from './Modal.jsx';

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const { items } = useCartStore();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(readStoredLocationLabel);
  const [loginPrompt, setLoginPrompt] = useState(null);
  const displayedLocation = isLoggedIn ? currentLocation : 'Current location';

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const avatarImage = user?.image || user?.avatar;

  // Live categories + sub-categories from backend (fallback to dummy).
  const [cats, setCats] = useState(dummyCategories);
  const [subCats, setSubCats] = useState([]);

  useEffect(() => {
    catalogApi.categories().then((list) => { if (list.length) setCats(list); }).catch(() => {});
    catalogApi.subCategories().then(setSubCats).catch(() => {});
  }, []);

  const catKey = (c) => c._id || c.id || c.slug;
  const subsByCategory = useMemo(() => {
    const map = new Map();
    subCats.forEach((s) => {
      const list = map.get(s.category) || [];
      list.push(s);
      map.set(s.category, list);
    });
    return map;
  }, [subCats]);

  const half = Math.ceil(cats.length / 2);
  const medicineCategories = cats.slice(0, half);
  const careCategories = cats.slice(half);
  const medicineMegaColumns = [
    { title: 'Medicines & Devices', items: medicineCategories },
    { title: 'Care & Wellness', items: careCategories.slice(0, 5) },
    { title: 'Family Care', items: careCategories.slice(5, 9) },
    { title: 'Popular Brands', items: dummyBrands.slice(0, 6).map(brand => ({ id: `brand-${brand.id}`, name: brand.name, slug: `search=${encodeURIComponent(brand.name)}`, isBrand: true })) },
  ];
  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return [];

    const productMatches = dummyProducts
      .filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(product => ({
        id: `product-${product.id}`,
        label: product.name,
        meta: product.brand,
        image: product.image,
        path: `/products/${product.id}`,
        type: 'Product',
      }));

    const categoryMatches = dummyCategories
      .filter(category => category.name.toLowerCase().includes(query))
      .slice(0, 3)
      .map(category => ({
        id: `category-${category.id}`,
        label: category.name,
        meta: 'Category',
        image: category.image,
        path: `/products?category=${category.slug}`,
        type: 'Category',
      }));

    const brandMatches = dummyBrands
      .filter(brand => brand.name.toLowerCase().includes(query))
      .slice(0, 3)
      .map(brand => ({
        id: `brand-${brand.id}`,
        label: brand.name,
        meta: 'Brand',
        path: `/products?search=${encodeURIComponent(brand.name)}`,
        type: 'Brand',
      }));

    return [...categoryMatches, ...brandMatches, ...productMatches].slice(0, 8);
  }, [searchQuery]);

  useEffect(() => {
    const handleLocationChange = (event) => {
      setCurrentLocation(event.detail || readStoredLocationLabel());
    };

    window.addEventListener(LOCATION_CHANGE_EVENT, handleLocationChange);
    return () => window.removeEventListener(LOCATION_CHANGE_EVENT, handleLocationChange);
  }, []);

  const runSearch = (event) => {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchFocused(false);
    setMobileMenuOpen(false);
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const goToSuggestion = (path) => {
    setSearchFocused(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  const openLoginPrompt = (prompt) => {
    setMobileMenuOpen(false);
    setLoginPrompt(prompt);
  };

  const closeLoginPrompt = () => setLoginPrompt(null);

  const goToAuth = (path) => {
    const redirect = loginPrompt?.redirect || '/';
    closeLoginPrompt();
    navigate(`${path}?redirect=${encodeURIComponent(redirect)}`);
  };

  const handleUseCurrentLocation = () => {
    if (!isLoggedIn) {
      openLoginPrompt({
        title: 'Login to add current location',
        heading: 'Please login first',
        message: 'Login to save and use your current delivery location.',
        redirect: '/',
      });
      return;
    }

    if (!navigator.geolocation) {
      setCurrentLocation('Location unavailable');
      return;
    }

    setCurrentLocation('Detecting...');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const latitude = coords.latitude.toFixed(5);
        const longitude = coords.longitude.toFixed(5);

        try {
          const locationData = await reverseGeocode(latitude, longitude);
          const locationLabel = buildAreaLabel(locationData) || 'Detected nearby area';
          setCurrentLocation(locationLabel);
          saveLocationLabel(locationLabel);
        } catch {
          setCurrentLocation('Detected nearby area');
          saveLocationLabel('Detected nearby area');
        }
      },
      () => setCurrentLocation('Location unavailable'),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleUploadPrescriptionClick = (event) => {
    if (isLoggedIn) return;

    event.preventDefault();
    openLoginPrompt({
      title: 'Login to upload prescription',
      heading: 'Please login first',
      message: 'Login to upload prescriptions and track their review status.',
      redirect: '/upload-prescription',
    });
  };

  return (
    <>
      <header className="hidden md:block bg-white shadow-sm ring-1 ring-slate-100 sticky top-0 z-40">
        <div className="bg-slate-950 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-medium">
            <span>Free delivery above ₹499</span>
            <span>Licensed pharmacy partners · Secure payments</span>
          </div>
        </div>
        <div className="border-b border-slate-100 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
            <Link to="/" className="flex shrink-0 items-center gap-2 text-2xl font-bold text-slate-950">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-700 text-white">
                <Pill size={23} />
              </span>
              <span className="leading-none">
                <span className="block">MediCare</span>
                <span className="block text-[11px] font-semibold text-teal-700">Trusted pharmacy</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="flex max-w-[155px] shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-teal-300 hover:bg-teal-50"
              title="Use current location"
            >
              <MapPin size={18} className="shrink-0 text-teal-700" />
              <span className="min-w-0">
                <span className="block text-[11px] font-bold uppercase leading-none text-slate-500">Deliver to</span>
                <span className="mt-1 block truncate text-xs font-bold text-slate-950">{displayedLocation}</span>
              </span>
            </button>

            <form onSubmit={runSearch} className="relative min-w-[300px] flex-1">
              <input
                type="text"
                placeholder="Search medicines, brands and categories"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchFocused(true);
                }}
                className="h-11 w-full rounded-none border border-slate-200 bg-slate-50 pl-4 pr-12 text-sm outline-none transition focus:border-teal-600 focus:bg-white"
              />
              <button type="submit" className="absolute right-0 top-0 grid h-11 w-12 place-items-center text-teal-700" aria-label="Search">
                <Search size={22} />
              </button>
              {searchFocused && searchSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-[70] mt-2 max-h-[70vh] overflow-hidden overflow-y-auto rounded-lg border border-slate-100 bg-white shadow-2xl">
                  <div className="border-b border-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Search Suggestions
                  </div>
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => goToSuggestion(suggestion.path)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-teal-50"
                    >
                      {suggestion.image ? (
                        <img src={suggestion.image} alt={suggestion.label} className="h-10 w-10 rounded-lg object-cover" />
                      ) : (
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                          {suggestion.label.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-950">{suggestion.label}</span>
                        <span className="block text-xs text-slate-500">{suggestion.type} · {suggestion.meta}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            <div className="flex h-full items-center gap-6 text-sm font-bold text-slate-800">
              {isLoggedIn ? (
                <div className="group relative flex h-full items-center">
                  <Link to="/account" className="inline-flex items-center gap-1 hover:text-teal-700">
                    <span className="max-w-28 truncate">{user?.name?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown size={15} className="transition group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 bg-white text-slate-800 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                    <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />
                    <Link to="/account" className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm font-semibold hover:bg-teal-50">
                      {avatarImage ? (
                        <img src={avatarImage} alt={user?.name || 'User'} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-700 text-xs font-bold text-white">
                          {getInitials(user?.name)}
                        </span>
                      )}
                      My Account
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm font-semibold hover:bg-teal-50">
                      <Heart size={18} className="text-teal-700" />
                      Wishlist
                    </Link>
                    <Link to="/customer-care" className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm font-semibold hover:bg-teal-50">
                      <Headphones size={18} className="text-teal-700" />
                      24x7 Customer Care
                    </Link>
                    <button onClick={logout} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold hover:bg-teal-50">
                      <LogOut size={18} className="text-teal-700" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group relative flex h-full items-center">
                  <Link to="/login" className="inline-flex items-center gap-2 rounded bg-teal-700 px-5 py-2 font-bold text-white hover:bg-teal-800">
                    <User size={17} />
                    Login
                    <ChevronDown size={14} className="transition group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 bg-white text-slate-800 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                    <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm">
                      <span className="font-semibold text-slate-950">New customer?</span>
                      <Link to="/register" className="font-bold text-teal-700 hover:underline">Sign Up</Link>
                    </div>
                    <Link to="/login" className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm font-semibold hover:bg-teal-50">
                      <User size={18} className="text-teal-700" />
                      My Profile
                    </Link>
                    <Link to="/customer-care" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-teal-50">
                      <Headphones size={18} className="text-teal-700" />
                      24x7 Customer Care
                    </Link>
                  </div>
                </div>
              )}
              <Link to="/b2b" className="whitespace-nowrap hover:text-teal-700">{user?.isB2B ? 'B2B Account' : 'B2B Business'}</Link>
              <Link to="/register" className="whitespace-nowrap hover:text-teal-700">Become a Seller</Link>
              <Link to="/wishlist" className="inline-flex items-center gap-2 hover:text-teal-700">
                <Heart size={20} />
                Wishlist
              </Link>
              <Link to="/cart" className="relative inline-flex items-center gap-2 hover:text-teal-700">
                <ShoppingCart size={21} />
                {cartCount > 0 && (
                  <span className="absolute -left-2 -top-3 grid h-5 min-w-5 place-items-center rounded-full border border-white bg-rose-600 px-1 text-[11px] text-white">
                    {cartCount}
                  </span>
                )}
                Cart
              </Link>
            </div>
          </div>
        </div>

        <nav className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-11 max-w-7xl items-center justify-center gap-10 px-4 text-sm font-bold text-slate-950">
            <div className="group relative">
              <Link to="/products" className="inline-flex h-11 items-center gap-1 transition hover:text-teal-700">
                Shop
                <ChevronDown size={15} />
              </Link>
              <div className="invisible absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 bg-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-2 gap-5">
                  <div className="p-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Medicines & Devices</p>
                    <div className="grid gap-3">
                      {medicineCategories.map(category => (
                        <div key={catKey(category)}>
                          <Link to={`/products?category=${category.slug}`} className="block rounded px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                            {category.name}
                          </Link>
                          {(subsByCategory.get(category.name) || []).length > 0 && (
                            <div className="flex flex-wrap gap-x-3 gap-y-1 px-3 pt-1">
                              {(subsByCategory.get(category.name) || []).map(sub => (
                                <Link key={sub._id} to={`/products?category=${category.slug}&sub=${sub.slug}`} className="text-xs font-medium text-slate-500 hover:text-teal-700">
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">Care & Wellness</p>
                    <div className="grid gap-3">
                      {careCategories.map(category => (
                        <div key={catKey(category)}>
                          <Link to={`/products?category=${category.slug}`} className="block rounded px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-white hover:text-teal-800">
                            {category.name}
                          </Link>
                          {(subsByCategory.get(category.name) || []).length > 0 && (
                            <div className="flex flex-wrap gap-x-3 gap-y-1 px-3 pt-1">
                              {(subsByCategory.get(category.name) || []).map(sub => (
                                <Link key={sub._id} to={`/products?category=${category.slug}&sub=${sub.slug}`} className="text-xs font-medium text-slate-500 hover:text-teal-700">
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="group relative">
              <Link to="/products?category=medicines" className="inline-flex h-11 items-center gap-1 transition hover:text-teal-700">
                Medicines
                <ChevronDown size={15} />
              </Link>
              <div className="invisible fixed left-1/2 top-[125px] z-50 w-[calc(100vw-9rem)] max-w-7xl -translate-x-1/2 bg-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                <div className="grid grid-cols-4 text-sm">
                  {medicineMegaColumns.map((column, index) => (
                    <div key={column.title} className={`min-h-80 p-6 ${index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
                      <p className="mb-4 font-bold text-slate-950">
                        {column.title}
                        <span className="ml-1 text-slate-400">›</span>
                      </p>
                      <div className="grid gap-3">
                        {column.items.map(item => (
                          <Link
                            key={item.id}
                            to={item.isBrand ? `/products?${item.slug}` : `/products?category=${item.slug}`}
                            className="font-medium text-slate-500 transition hover:text-teal-700"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="group relative">
              <Link to="/products?category=personal-care" className="inline-flex h-11 items-center gap-1 transition hover:text-teal-700">
                Wellness
                <ChevronDown size={15} />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-56 bg-white p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                {careCategories.slice(0, 6).map(category => (
                  <Link key={category.id} to={`/products?category=${category.slug}`} className="block rounded px-3 py-2 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-800">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/upload-prescription" onClick={handleUploadPrescriptionClick} className="transition hover:text-teal-700">
              Upload Prescription
            </Link>
            <Link to="/blogs" className="transition hover:text-teal-700">
              Health Blogs
            </Link>
            <Link to="/b2b" className="transition hover:text-teal-700">
              {user?.isB2B ? 'B2B Account' : 'B2B Business'}
            </Link>
          </div>
        </nav>
      </header>

      <header className="md:hidden bg-white shadow-sm ring-1 ring-slate-100 sticky top-0 z-40">
        <div className="bg-slate-950 px-3 py-1.5 text-center text-[11px] font-semibold text-white">
          Free delivery above ₹499
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-700"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="flex min-w-0 items-center gap-2 text-lg font-bold text-slate-950 sm:text-xl">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-700 text-white">
              <Pill size={20} />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block truncate">MediCare</span>
              <span className="block truncate text-[10px] font-semibold text-teal-700">Trusted pharmacy</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/cart" className="text-slate-700 relative" aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/wishlist" className="text-slate-700" aria-label="Wishlist">
              <Heart size={20} />
            </Link>
          </div>
        </div>

        <div className="grid gap-2 px-3 pb-3 sm:px-4">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="flex h-10 w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-left"
          >
            <MapPin size={17} className="shrink-0 text-teal-700" />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase leading-none text-slate-500">Deliver to</span>
              <span className="mt-1 block truncate text-xs font-bold text-slate-950">{displayedLocation}</span>
            </span>
          </button>

          <form onSubmit={runSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search medicines, brands and categories"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchFocused(true);
              }}
              className="h-11 w-full rounded-none border border-slate-200 bg-slate-50 pl-4 pr-12 text-sm outline-none focus:border-teal-600 focus:bg-white"
            />
            <button type="submit" className="absolute right-0 top-0 grid h-11 w-12 place-items-center text-teal-700" aria-label="Search">
              <Search size={21} />
            </button>
            {searchFocused && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-[70] mt-2 max-h-[65vh] overflow-hidden overflow-y-auto rounded-lg border border-slate-100 bg-white shadow-2xl">
                <div className="border-b border-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Search Suggestions
                </div>
                {searchSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => goToSuggestion(suggestion.path)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-teal-50"
                  >
                    {suggestion.image ? (
                      <img src={suggestion.image} alt={suggestion.label} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                        {suggestion.label.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-950">{suggestion.label}</span>
                      <span className="block text-xs text-slate-500">{suggestion.type} · {suggestion.meta}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {mobileMenuOpen && (
          <nav className="flex max-h-[calc(100vh-164px)] flex-col overflow-y-auto border-t border-slate-100 bg-white">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-100 px-4 py-3 font-bold text-slate-800 hover:bg-slate-50">
              Shop
            </Link>
            <button
              onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
              className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-left font-bold text-slate-800 hover:bg-slate-50"
            >
              Medicines
              <ChevronDown size={18} className={`transition-transform ${mobileCategoryOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCategoryOpen && (
              <div className="grid border-b border-slate-100 bg-slate-50 sm:grid-cols-2">
                {medicineMegaColumns.map((column, index) => (
                  <div key={column.title} className={`p-4 ${index % 2 === 1 ? 'bg-white/70' : ''}`}>
                    <p className="mb-3 text-sm font-bold text-slate-950">
                      {column.title}
                      <span className="ml-1 text-slate-400">›</span>
                    </p>
                    <div className="grid gap-2">
                      {column.items.map(item => (
                        <Link
                          key={item.id}
                          to={item.isBrand ? `/products?${item.slug}` : `/products?category=${item.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-800"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/products?category=personal-care" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-100 px-4 py-3 font-bold text-slate-800 hover:bg-slate-50">
              Wellness
            </Link>
            <Link to="/upload-prescription" onClick={handleUploadPrescriptionClick} className="border-b border-slate-100 px-4 py-3 font-bold text-slate-800 hover:bg-slate-50">
              Upload Prescription
            </Link>
            <Link to="/blogs" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-100 px-4 py-3 font-bold text-slate-800 hover:bg-slate-50">
              Health Blogs
            </Link>
            <Link to="/b2b" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-100 px-4 py-3 font-bold text-slate-800 hover:bg-slate-50">
              {user?.isB2B ? 'B2B Account' : 'B2B Business'}
            </Link>
            <Link to="/customer-care" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 font-bold text-slate-800 hover:bg-slate-50">
              <Headphones size={18} className="text-teal-700" />
              24x7 Customer Care
            </Link>
            {isLoggedIn && (
              <>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-slate-800 hover:bg-slate-50">
                  {avatarImage ? (
                    <img src={avatarImage} alt={user?.name || 'User'} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">
                      {getInitials(user?.name)}
                    </span>
                  )}
                  <span className="min-w-0 truncate font-semibold">{user?.name}</span>
                </Link>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-slate-700 border-b border-slate-100 hover:bg-slate-50">
                  My Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-slate-700 text-left hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-sm">
                  <span className="font-semibold text-slate-950">New customer?</span>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="font-bold text-teal-700 hover:underline">Sign Up</Link>
                </div>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 font-bold text-slate-800 hover:bg-slate-50">
                  <User size={18} className="text-teal-700" />
                  Login
                </Link>
              </>
            )}
          </nav>
        )}
      </header>

      <Modal
        isOpen={!!loginPrompt}
        onClose={closeLoginPrompt}
        title={loginPrompt?.title || 'Login required'}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700">
            <LockKeyhole size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-950">{loginPrompt?.heading || 'Please login first'}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {loginPrompt?.message || 'Login to continue.'}
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
    </>
  );
};

export default Header;
