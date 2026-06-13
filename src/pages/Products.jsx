import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { dummyProducts, dummyCategories, dummyBrands } from '../data/dummy';
import { catalogApi } from '../api/index.js';
import ProductCard from '../components/products/ProductCard';
import Pagination from '../components/common/Pagination';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { useAuthStore } from '../store/index.js';

const Products = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState(dummyProducts);

  // Load live products; keep dummy data as fallback when backend is empty/down.
  useEffect(() => {
    catalogApi
      .products()
      .then((list) => {
        if (list.length) setProducts(list);
      })
      .catch(() => {});
  }, []);

  const categoryFilter = searchParams.get('category');
  const searchFilter = searchParams.get('search') || '';
  const activeCategory = dummyCategories.find(category => category.slug === categoryFilter);
  const hasActiveFilters = categoryFilter || selectedBrands.length > 0 || selectedRating > 0 || priceRange[0] !== 0 || priceRange[1] !== 5000 || sortBy !== 'popularity';

  const clearLocalFilters = () => {
    setSortBy('popularity');
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setSelectedRating(0);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let results = [...products];

    // Filter by category
    if (categoryFilter) {
      results = results.filter(p => p.category === categoryFilter);
    }

    // Filter by search
    if (searchFilter) {
      results = results.filter(p =>
        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    // Filter by price
    results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by brands
    if (selectedBrands.length > 0) {
      results = results.filter(p => selectedBrands.includes(p.brand));
    }

    // Filter by rating
    if (selectedRating > 0) {
      results = results.filter(p => parseFloat(p.rating) >= selectedRating);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => b.id - a.id);
        break;
      case 'rating':
        results.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      default:
        break;
    }

    return results;
  }, [products, categoryFilter, searchFilter, priceRange, selectedBrands, selectedRating, sortBy]);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_320px]">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-300">
                {activeCategory ? activeCategory.name : 'Online Pharmacy'}
              </p>
              <h1 className="text-2xl font-bold leading-tight md:text-4xl">Shop Medicines & Healthcare Products</h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-300">
                {user?.isB2B
                  ? `Wholesale pricing is active for ${user.businessProfile?.businessName || 'your business'}. Browse categories and add products to your B2B cart.`
                  : 'Browse trusted essentials, wellness products, devices, and care items with fast delivery.'}
              </p>
              {user?.isB2B && (
                <div className="mt-4 inline-flex rounded bg-emerald-400 px-3 py-1.5 text-sm font-bold text-slate-950">
                  B2B storefront active
                </div>
              )}
            </div>
            {activeCategory && (
              <img
                src={activeCategory.image}
                alt={activeCategory.name}
                className="hidden h-44 w-full rounded-lg object-cover opacity-90 shadow-xl md:block"
              />
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 py-5 sm:px-4 md:py-8">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 md:mb-6 md:gap-3">
          <Link
            to="/products"
            className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
              !categoryFilter ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
            }`}
          >
            All
          </Link>
          {dummyCategories.map(category => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                categoryFilter === category.slug ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {hasActiveFilters && (
          <div className="mb-5 flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
            <span className="text-sm font-semibold text-slate-700">Active filters:</span>
            {activeCategory && (
              <Link to="/products" className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100">
                {activeCategory.name}
                <X size={13} />
              </Link>
            )}
            {selectedBrands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrands(selectedBrands.filter(item => item !== brand))}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                {brand}
                <X size={13} />
              </button>
            ))}
            {selectedRating > 0 && (
              <button
                type="button"
                onClick={() => setSelectedRating(0)}
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                {selectedRating}★ & up
                <X size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={clearLocalFilters}
              className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Clear Filters
            </button>
            {categoryFilter && (
              <Link to="/products" className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50">
                Remove Category
              </Link>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 rounded-lg border border-slate-100 bg-white p-5 h-fit sticky top-28 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-950">
              <SlidersHorizontal size={20} />
              Filters
            </h2>
            <button
              type="button"
              onClick={clearLocalFilters}
              className="mb-5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Reset Filters
            </button>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold mb-3 text-slate-900">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full accent-teal-700"
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-teal-700"
                />
                <p className="text-sm text-slate-600">₹{priceRange[0]} - ₹{priceRange[1]}</p>
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold mb-3">Brand</h3>
              <div className="space-y-2">
                {dummyBrands.map(brand => (
                  <label key={brand.id} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand.name]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand.name));
                        }
                        setCurrentPage(1);
                      }}
                      className="rounded accent-teal-700"
                    />
                    <span className="text-sm">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-semibold mb-3">Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() => {
                        setSelectedRating(rating);
                        setCurrentPage(1);
                      }}
                      className="accent-teal-700"
                    />
                    <span className="text-sm">{rating} ★ & up ({products.filter(p => parseFloat(p.rating) >= rating).length})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm"
            >
              {showFilters ? <X size={20} /> : <Filter size={20} />}
              Filters
            </button>

            {/* Mobile Filters Drawer */}
            {showFilters && (
              <div className="lg:hidden mb-6 rounded-lg border border-slate-100 bg-white p-4 shadow-lg space-y-4">
                <button
                  type="button"
                  onClick={clearLocalFilters}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Reset Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-3"
                >
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            )}

            {/* Results Info */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
              <p className="text-sm text-slate-600">
                Showing {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="hidden w-56 rounded-lg border border-slate-200 bg-white p-2 text-sm sm:block lg:hidden"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-10 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                  {paginatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo(0, 0);
                    }}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
