import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import B2BProductCard from '../../components/b2b/B2BProductCard';
import { dummyCategories, dummyProducts } from '../../data/dummy';
import { addB2BItem, selectB2BBusiness } from '../../redux/b2bPurchaseSlice';
import { useToast } from '../../components/common/Toast';

const B2BBuyPage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const businesses = useSelector((state) => state.business.businesses);
  const { cart, selectedBusinessId } = useSelector((state) => state.b2bPurchase);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const activeBusinesses = businesses.filter((business) => business.status === 'Active');
  const selectedBusiness = businesses.find((business) => business.id === selectedBusinessId);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const products = useMemo(() => {
    const query = search.trim().toLowerCase();

    return dummyProducts.filter((product) => {
      const matchesSearch = !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);
      const matchesCategory = !category || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, search]);

  const handleAdd = (product, quantity) => {
    dispatch(addB2BItem({ product, quantity }));
    addToast(`${quantity} units added to B2B cart`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 dark:bg-slate-950 md:py-8">
      <div className="mx-auto max-w-7xl space-y-5 px-4">
        <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">B2B Procurement</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Buy Products for Business</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Select an active business, add products in bulk, and create a purchase order for approval.
            </p>
          </div>
          <Link to="/b2b/cart" className="btn-primary inline-flex h-11 items-center justify-center gap-2">
            <ShoppingCart size={18} />
            Cart ({cartCount})
          </Link>
        </div>

        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[260px_1fr_220px]">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Buying Business</span>
            <select
              value={selectedBusinessId}
              onChange={(event) => dispatch(selectB2BBusiness(event.target.value))}
              className="input-base h-11 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Select active business</option>
              {activeBusinesses.map((business) => (
                <option key={business.id} value={business.id}>{business.businessName}</option>
              ))}
            </select>
          </label>
          <label className="relative block">
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Search Products</span>
            <Search className="pointer-events-none absolute left-3 top-[43px] text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search medicine, brand, product"
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="input-base h-11 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
              <option value="">All Categories</option>
              {dummyCategories.map((item) => (
                <option key={item.id} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>
        </div>

        {!selectedBusiness && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            Select an active registered business before checkout. You can still prepare the cart.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <B2BProductCard
              key={product.id}
              product={product}
              cartQuantity={cart.find((item) => item.id === product.id)?.quantity || 0}
              onAdd={handleAdd}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default B2BBuyPage;
