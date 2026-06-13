import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { dummyProducts, dummyReviews } from "../data/dummy";
import { catalogApi } from "../api/index.js";
import ProductCard from "../components/products/ProductCard";
import Modal from "../components/common/Modal.jsx";
import LoadingButton from "../components/common/LoadingButton.jsx";
import {
  useAuthStore,
  useCartStore,
  useWishlistStore,
} from "../store/index.js";
import { useToast } from "../components/common/Toast";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  Heart,
  LockKeyhole,
  Mail,
  MessageSquarePlus,
  Minus,
  PackageCheck,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Smartphone,
  Truck,
  UserPlus,
  X,
} from "lucide-react";
import {
  formatCurrency,
  getDiscountPercentage,
  getStorefrontProduct,
} from "../utils/helpers.js";

const B2B_MIN_ORDER_QUANTITY = 10;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState(dummyProducts);
  const product = allProducts.find((p) => String(p.id) === String(id));
  const [activeImage, setActiveImage] = useState(product?.image);

  // Load live catalog; fall back to dummy data when backend is empty/down.
  useEffect(() => {
    catalogApi
      .products()
      .then((list) => {
        if (list.length) setAllProducts(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (product?.image) setActiveImage(product.image);
  }, [product?.id]);
  const [activeTab, setActiveTab] = useState("description");
  const [newReviews, setNewReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    content: "",
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptType, setLoginPromptType] = useState("review");
  const [loadingAction, setLoadingAction] = useState("");
  const { items, addToCart } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const { addToast } = useToast();
  const storefrontProduct = product
    ? getStorefrontProduct(product, user)
    : null;
  const inWishlist = storefrontProduct && isInWishlist(storefrontProduct.id);
  const cartQuantity =
    items.find((item) => item.id === storefrontProduct?.id)?.quantity || 0;
  const minQuantity = storefrontProduct?.isB2BPrice
    ? B2B_MIN_ORDER_QUANTITY
    : 1;
  const defaultQuantity =
    cartQuantity > 0 ? Math.max(cartQuantity, minQuantity) : minQuantity;
  const [quantityByProduct, setQuantityByProduct] = useState({});
  const quantity = quantityByProduct[storefrontProduct?.id] ?? defaultQuantity;
  const setProductQuantity = (nextQuantity) => {
    setQuantityByProduct((prev) => ({
      ...prev,
      [storefrontProduct.id]:
        typeof nextQuantity === "function"
          ? nextQuantity(quantity)
          : nextQuantity,
    }));
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const discount = getDiscountPercentage(
    storefrontProduct.mrp,
    storefrontProduct.price,
  );
  const reviews = [
    ...dummyReviews.filter((r) => r.productId === product.id),
    ...newReviews,
  ];
  const sideEffects = Array.isArray(product.sideEffects)
    ? product.sideEffects
    : [product.sideEffects];
  const galleryImages = product.images?.length
    ? product.images
    : [product.image];
  const selectedImage = activeImage || galleryImages[0];
  const relatedProducts = allProducts
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 4);
  const isBestSeller =
    Number(product.rating) >= 4.4 || Number(product.reviews) > 500;

  const handleImageStep = (direction) => {
    const currentIndex = Math.max(0, galleryImages.indexOf(selectedImage));
    const nextIndex =
      (currentIndex + direction + galleryImages.length) % galleryImages.length;
    setActiveImage(galleryImages[nextIndex]);
  };

  const handleAddToCart = () => {
    setLoadingAction("cart");
    if (cartQuantity > 0) {
      window.setTimeout(() => {
        navigate("/cart");
      }, 300);
      return;
    }

    window.setTimeout(() => {
      addToCart(storefrontProduct, quantity);
      setLoadingAction("");
      addToast(`${storefrontProduct.name} added to cart!`, "success");
    }, 300);
  };

  const handleBuyNow = () => {
    setLoadingAction("buy-now");
    localStorage.setItem(
      "buy_now_items",
      JSON.stringify([{ ...storefrontProduct, quantity }]),
    );

    if (!isLoggedIn) {
      setLoadingAction("");
      setLoginPromptType("buy-now");
      setShowLoginPrompt(true);
      return;
    }

    window.setTimeout(() => {
      addToast(`${storefrontProduct.name} is ready for checkout`, "success");
      navigate("/checkout?buyNow=1");
    }, 400);
  };

  const handleWishlist = () => {
    setLoadingAction("wishlist");
    window.setTimeout(() => {
      if (inWishlist) {
        removeFromWishlist(storefrontProduct.id);
        addToast("Removed from wishlist", "info");
      } else {
        addToWishlist(storefrontProduct);
        addToast("Added to wishlist", "success");
      }
      setLoadingAction("");
    }, 300);
  };

  const shareUrl = `${window.location.origin}/products/${storefrontProduct.id}`;
  const shareText = `Check out ${storefrontProduct.name} on MediCare`;
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareText = encodeURIComponent(shareText);
  const encodedShareMessage = encodeURIComponent(`${shareText} ${shareUrl}`);

  const handleCopyShareLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      addToast("Product link copied to clipboard", "success");
    } catch {
      addToast("Unable to copy product link", "error");
    }
  };

  const handleShareOption = async (type) => {
    const shareTargets = {
      whatsapp: `https://wa.me/?text=${encodedShareMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
      messenger: `fb-messenger://share/?link=${encodedShareUrl}`,
      gmail: `mailto:?subject=${encodedShareText}&body=${encodedShareMessage}`,
      sms: `sms:?&body=${encodedShareMessage}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
    };

    if (type === "copy") {
      await handleCopyShareLink();
      setShowSharePanel(false);
      return;
    }

    if (type === "native" && navigator.share) {
      try {
        await navigator.share({
          title: storefrontProduct.name,
          text: shareText,
          url: shareUrl,
        });
        setShowSharePanel(false);
      } catch {
        addToast("Unable to share this product right now", "error");
      }
      return;
    }

    const targetUrl = shareTargets[type];
    if (!targetUrl) return;

    if (type === "gmail" || type === "sms" || type === "messenger") {
      window.open(targetUrl, "_self");
    } else {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }

    setShowSharePanel(false);
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();
    if (!reviewForm.title.trim() || !reviewForm.content.trim()) {
      addToast("Please add review title and details", "error");
      return;
    }

    setLoadingAction("review");
    window.setTimeout(() => {
      setNewReviews((prev) => [
        ...prev,
        {
          id: Date.now(),
          productId: product.id,
          rating: Number(reviewForm.rating),
          title: reviewForm.title.trim(),
          content: reviewForm.content.trim(),
          helpfulCount: 0,
        },
      ]);
      setReviewForm({ rating: 5, title: "", content: "" });
      setActiveTab("reviews");
      setShowReviewModal(false);
      setLoadingAction("");
      addToast("Review added successfully", "success");
    }, 500);
  };

  const handleOpenReview = () => {
    setActiveTab("reviews");
    if (!isLoggedIn) {
      setLoginPromptType("review");
      setShowLoginPrompt(true);
      return;
    }
    setShowReviewModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4 text-sm">
          <button
            onClick={() => navigate("/")}
            className="text-teal-700 hover:underline"
          >
            Home
          </button>
          <span className="mx-2 text-slate-400">/</span>
          <button
            onClick={() => navigate("/products")}
            className="text-teal-700 hover:underline"
          >
            Products
          </button>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-5 sm:px-4 md:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-8 mb-8 md:mb-10">
          {/* Product Image */}
          <div className="flex items-start">
            <div className="grid w-full gap-3 md:grid-cols-[88px_1fr]">
              <div className="order-2 flex gap-2 overflow-x-auto pb-1 md:order-1 md:flex-col md:overflow-visible md:pb-0">
                {galleryImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    onMouseEnter={() => setActiveImage(image)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white p-1 transition sm:h-20 sm:w-20 ${
                      selectedImage === image
                        ? "border-teal-600 ring-2 ring-teal-100"
                        : "border-slate-200 hover:border-teal-300"
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      onError={(event) => {
                        event.currentTarget.src = product.image;
                      }}
                      className="h-full w-full rounded-md object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="order-1 overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm md:order-2">
                <div className="relative cursor-zoom-in bg-gradient-to-br from-slate-50 to-teal-50">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.src =
                        galleryImages.find(
                          (image) => image !== selectedImage,
                        ) || product.image;
                    }}
                    className="h-72 w-full object-cover transition duration-500 hover:scale-105 sm:h-80 md:h-[34rem]"
                  />
                  <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                    {discount > 0 && (
                      <span className="rounded bg-rose-600 px-3 py-1.5 text-xs font-bold uppercase text-white shadow-sm">
                        {discount}% off
                      </span>
                    )}
                    {isBestSeller && (
                      <span className="rounded bg-amber-400 px-3 py-1.5 text-xs font-bold uppercase text-slate-950 shadow-sm">
                        Best seller
                      </span>
                    )}
                  </div>
                  <div className="absolute right-3 top-3 flex flex-col gap-3 sm:right-4 sm:top-4">
                    <button
                      type="button"
                      onClick={handleWishlist}
                      disabled={loadingAction === "wishlist"}
                      className={`grid h-11 w-11 place-items-center rounded-lg bg-white/95 shadow-sm ring-1 ring-slate-200/80 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 sm:h-12 sm:w-12 ${
                        inWishlist ? "text-rose-600" : "text-slate-800"
                      }`}
                      aria-label={
                        inWishlist ? "Remove from wishlist" : "Add to wishlist"
                      }
                    >
                      <Heart
                        size={23}
                        fill={inWishlist ? "currentColor" : "none"}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSharePanel(true)}
                      className="grid h-11 w-11 place-items-center rounded-lg bg-white/95 text-slate-800 shadow-sm ring-1 ring-slate-200/80 transition hover:bg-white sm:h-12 sm:w-12"
                      aria-label="Share product"
                    >
                      <Share2 size={23} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleImageStep(-1)}
                    className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow hover:bg-white sm:left-3 sm:h-10 sm:w-10"
                    aria-label="Previous product image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageStep(1)}
                    className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow hover:bg-white sm:right-3 sm:h-10 sm:w-10"
                    aria-label="Next product image"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-teal-800 shadow-sm backdrop-blur">
                    <ShieldCheck size={16} />
                    Genuine product
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase text-teal-800">
                  {product.brand}
                </span>
                {isBestSeller && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-800">
                    Best seller
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950 md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                Manufacturer: {product.manufacturer}
              </p>
              <p className="mt-4 text-base leading-7 text-slate-700">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-3 mb-4 sm:gap-4">
                <div className="flex items-center gap-1">
                  <Star className="fill-amber-400 text-amber-400" size={22} />
                  <span className="text-xl font-bold text-slate-950">
                    {product.rating}
                  </span>
                  <span className="text-sm text-slate-500 sm:text-base">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenReview}
                  className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
                >
                  <MessageSquarePlus size={16} />
                  Rate
                </button>
              </div>

              {/* Price Section */}
              <div className="mb-5 border-y border-slate-100 py-5">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-2xl font-bold text-slate-950 sm:text-3xl">
                    {formatCurrency(storefrontProduct.price)}
                  </span>
                  <span className="text-lg text-slate-400 line-through">
                    {formatCurrency(storefrontProduct.mrp)}
                  </span>
                  {discount > 0 && (
                    <span className="rounded bg-rose-600 px-2 py-1 text-sm font-bold text-white">
                      Save {discount}%
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {storefrontProduct.isB2BPrice
                    ? "B2B wholesale price, inclusive of all taxes"
                    : "Inclusive of all taxes"}
                </p>
              </div>

              {/* Prescription Warning */}
              {product.prescriptionRequired && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    ⚕️ This medicine requires a valid doctor's prescription
                    before delivery.
                  </p>
                </div>
              )}

              {/* Stock Status */}
              <p className="mb-5 text-sm">
                <span
                  className={
                    product.stock > 0
                      ? "font-semibold text-emerald-700"
                      : "font-semibold text-rose-600"
                  }
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock} available)`
                    : "Out of Stock"}
                </span>
              </p>

              {/* Quantity Selector */}
              <div className="mb-5 flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="text-sm font-semibold text-slate-700">
                  Quantity
                </span>
                <div className="flex items-center overflow-hidden rounded-full border border-slate-200">
                  <button
                    onClick={() =>
                      setProductQuantity(Math.max(minQuantity, quantity - 1))
                    }
                    className="grid h-10 w-10 place-items-center text-slate-600 hover:bg-slate-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-12 border-l border-r border-slate-200 px-4 py-2 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setProductQuantity(quantity + 1)}
                    className="grid h-10 w-10 place-items-center text-slate-600 hover:bg-slate-100"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {storefrontProduct.isB2BPrice && (
                  <p className="text-sm font-bold text-amber-700">
                    B2B minimum order quantity is {B2B_MIN_ORDER_QUANTITY}{" "}
                    units.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-3">
                <LoadingButton
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  isLoading={loadingAction === "cart"}
                  loadingText={
                    cartQuantity > 0 ? "Opening cart..." : "Adding..."
                  }
                  icon={ShoppingCart}
                  className="btn-primary flex min-h-12 items-center justify-center gap-2 whitespace-nowrap px-4 py-3 text-sm disabled:opacity-50 sm:text-base"
                >
                  {cartQuantity > 0 ? "Go to Cart" : "Add to Cart"}
                </LoadingButton>
                <LoadingButton
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  isLoading={loadingAction === "buy-now"}
                  loadingText="Preparing..."
                  icon={LockKeyhole}
                  className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-yellow-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-300 disabled:opacity-50 sm:text-base"
                >
                  Buy Now
                </LoadingButton>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-100 bg-white p-4">
                  <PackageCheck className="mb-2 text-teal-700" size={20} />
                  <p className="text-sm font-semibold text-slate-950">
                    Authentic product
                  </p>
                  <p className="text-xs text-slate-500">
                    Verified healthcare supply
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white p-4">
                  <Truck className="mb-2 text-teal-700" size={20} />
                  <p className="text-sm font-semibold text-slate-950">
                    Fast delivery
                  </p>
                  <p className="text-xs text-slate-500">
                    Quick dispatch for in-stock items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 rounded-lg border border-slate-100 bg-white shadow-sm md:mb-12">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-2 pt-2 sm:px-3 sm:pt-3">
            {[
              { id: "description", label: "Description" },
              {
                id: "reviews",
                label: `Reviews (${reviews.length || product.reviews})`,
              },
              { id: "benefits", label: "Key Benefits" },
              { id: "ingredients", label: "Ingredients" },
              { id: "uses", label: "Uses" },
              { id: "side-effects", label: "Side Effects" },
              { id: "directions", label: "Direction & Storage" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 border-b-2 px-3 py-3 text-xs font-bold transition sm:px-4 sm:text-sm ${
                  activeTab === tab.id
                    ? "border-teal-700 text-teal-800"
                    : "border-transparent text-slate-500 hover:text-slate-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-5 md:p-8">
            {activeTab === "description" && (
              <div className="max-w-4xl">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-950 sm:text-2xl">
                  <FileText className="text-teal-700" size={24} />
                  Product Description
                </h2>
                <p className="leading-7 text-slate-700">
                  {product.longDescription || product.description}
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                      Customer Reviews
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Share your experience and help other customers choose
                      better.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenReview}
                    className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3"
                  >
                    <MessageSquarePlus size={18} />
                    Add Review
                  </button>
                </div>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h4 className="font-semibold text-slate-950">
                            {review.title}
                          </h4>
                          <span className="text-amber-500">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">
                          {review.content}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {review.helpfulCount} found this helpful
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">No detailed reviews yet.</p>
                )}
              </div>
            )}

            {activeTab === "benefits" && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {product.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
                  >
                    <BadgeCheck size={16} className="text-emerald-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "ingredients" && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {(product.ingredients || []).map((ingredient) => (
                  <li
                    key={ingredient}
                    className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
                  >
                    <BadgeCheck size={16} className="text-emerald-600" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "uses" && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {product.uses.map((use) => (
                  <li
                    key={use}
                    className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
                  >
                    {use}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "side-effects" && (
              <ul className="space-y-3">
                {sideEffects.map((effect) => (
                  <li
                    key={effect}
                    className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"
                  >
                    {effect}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "directions" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 font-semibold text-slate-950">
                    Directions
                  </h3>
                  <p className="text-sm leading-6 text-slate-700">
                    {product.directions}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 font-semibold text-slate-950">Storage</h3>
                  <p className="text-sm leading-6 text-slate-700">
                    {product.storage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mb-10 md:mb-12">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  Related Products
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  More options from the same health category.
                </p>
              </div>
              <Link
                to={`/products?category=${product.category}`}
                className="hidden rounded-lg border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 sm:inline-flex"
              >
                View Category
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {showSharePanel && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center lg:items-stretch lg:justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55"
            onClick={() => setShowSharePanel(false)}
            aria-label="Close share panel"
          />
          <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-lg bg-white shadow-2xl sm:max-w-lg sm:rounded-lg lg:h-full lg:max-h-none lg:w-[31rem] lg:rounded-none">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
              <button
                type="button"
                onClick={() => setShowSharePanel(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100"
                aria-label="Close share panel"
              >
                <X size={22} />
              </button>
              <h2 className="text-base font-bold text-slate-900">Share</h2>
            </div>

            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-12 w-12 shrink-0 rounded-md border border-slate-200 bg-white object-cover"
                onError={(event) => {
                  event.currentTarget.src = product.image;
                }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {storefrontProduct.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-3 gap-y-6 overflow-y-auto px-4 py-5 sm:grid-cols-4 lg:grid-cols-3">
              {[
                {
                  id: "copy",
                  label: "Copy Link",
                  icon: Copy,
                  className: "bg-violet-600 text-white",
                },
                {
                  id: "whatsapp",
                  label: "Whatsapp",
                  icon: MessageSquarePlus,
                  className: "bg-emerald-500 text-white",
                },
                {
                  id: "facebook",
                  label: "Facebook",
                  textIcon: "f",
                  className: "bg-indigo-600 text-white",
                },
                {
                  id: "messenger",
                  label: "Messenger",
                  icon: MessageSquarePlus,
                  className: "bg-blue-600 text-white",
                },
                {
                  id: "gmail",
                  label: "Gmail",
                  icon: Mail,
                  className: "bg-red-500 text-white",
                },
                {
                  id: "sms",
                  label: "SMS",
                  icon: Smartphone,
                  className: "bg-purple-600 text-white",
                },
                {
                  id: "linkedin",
                  label: "LinkedIn",
                  textIcon: "in",
                  className: "bg-sky-700 text-white",
                },
                ...(navigator.share
                  ? [
                      {
                        id: "native",
                        label: "More",
                        icon: Share2,
                        className: "bg-slate-800 text-white",
                      },
                    ]
                  : []),
              ].map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleShareOption(option.id)}
                    className="flex min-w-0 flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-full shadow-sm ${option.className}`}
                    >
                      {Icon ? (
                        <Icon size={24} />
                      ) : (
                        <span className="text-3xl font-black leading-none">
                          {option.textIcon}
                        </span>
                      )}
                    </span>
                    <span className="max-w-full break-words text-xs font-medium leading-4 text-slate-600">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Add customer review"
        size="lg"
      >
        <form onSubmit={handleSubmitReview} className="space-y-5">
          <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
            <p className="font-semibold text-slate-950">{product.name}</p>
            <p className="mt-1 text-sm text-slate-600">
              Rate this product and share your experience.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setReviewForm({ ...reviewForm, rating })}
                  className="rounded-full p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  aria-label={`${rating} star rating`}
                >
                  <Star
                    size={32}
                    className={
                      rating <= Number(reviewForm.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-600">
                {reviewForm.rating}/5
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Review Title
            </label>
            <input
              type="text"
              value={reviewForm.title}
              onChange={(event) =>
                setReviewForm({ ...reviewForm, title: event.target.value })
              }
              placeholder="Example: Very useful product"
              className="input-base"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Your Review
            </label>
            <textarea
              value={reviewForm.content}
              onChange={(event) =>
                setReviewForm({ ...reviewForm, content: event.target.value })
              }
              placeholder="Share what you liked, quality, packaging, delivery, or usage experience"
              rows="4"
              className="input-base"
            />
          </div>

          <LoadingButton
            type="submit"
            isLoading={loadingAction === "review"}
            loadingText="Submitting..."
            icon={MessageSquarePlus}
            className="btn-primary inline-flex w-full items-center justify-center gap-2 py-3"
          >
            Submit Review
          </LoadingButton>
        </form>
      </Modal>

      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title={
          loginPromptType === "buy-now"
            ? "Login to buy now"
            : "Login to add review"
        }
      >
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700">
            <LockKeyhole size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-950">
            Please login first
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {loginPromptType === "buy-now"
              ? "Login to continue checkout for this product."
              : "Login to add a verified customer rating and review for this product."}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/login?redirect=${encodeURIComponent(loginPromptType === "buy-now" ? "/checkout?buyNow=1" : `/products/${product.id}`)}`,
                )
              }
              className="btn-primary inline-flex items-center justify-center gap-2 py-3"
            >
              <LockKeyhole size={18} />
              Login
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/register?redirect=${encodeURIComponent(loginPromptType === "buy-now" ? "/checkout?buyNow=1" : `/products/${product.id}`)}`,
                )
              }
              className="btn-outline inline-flex items-center justify-center gap-2 py-3"
            >
              <UserPlus size={18} />
              Create Account
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;
