import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  LocateFixed,
  LockKeyhole,
  MapPin,
  Navigation,
  PackageCheck,
  PlusCircle,
} from "lucide-react";
import {
  useCartStore,
  useAuthStore,
  usePreferencesStore,
  useOrdersStore,
} from "../store/index.js";
import { useToast } from "../components/common/Toast";
import LoadingButton from "../components/common/LoadingButton.jsx";
import Modal from "../components/common/Modal.jsx";
import {
  validateMobile,
  validatePincode,
  generateOrderNumber,
  calculateSubtotal,
  calculateDeliveryCharges,
  formatCurrency,
} from "../utils/helpers.js";
import {
  buildAreaLabel,
  readStoredLocationLabel,
  reverseGeocode,
  saveLocationLabel,
} from "../utils/location.js";
import { apiErrorMessage } from "../api/client.js";

const B2B_MIN_ORDER_QUANTITY = 10;

const createBlankAddress = (user) => ({
  fullName: user?.name || "",
  mobile: user?.mobile || "",
  houseNumber: "",
  area: "",
  landmark: "Pinned from device location",
  city: "",
  state: "",
  pincode: "",
});

const createBusinessAddress = (businessProfile, user) => ({
  fullName: businessProfile?.contactPersonName || user?.name || "",
  mobile: businessProfile?.mobileNumber || user?.mobile || "",
  houseNumber: businessProfile?.businessName || "",
  area: businessProfile?.businessAddress || "",
  landmark: businessProfile?.registrationNumber
    ? `Registration: ${businessProfile.registrationNumber}`
    : "",
  city: businessProfile?.city || "",
  state: businessProfile?.state || "",
  pincode: businessProfile?.pincode || "",
});

const isSameAddress = (firstAddress, secondAddress) => {
  if (!firstAddress || !secondAddress) return false;

  return [
    "fullName",
    "mobile",
    "houseNumber",
    "area",
    "city",
    "state",
    "pincode",
  ].every((field) => firstAddress[field] === secondAddress[field]);
};

const getPreferredAddress = (user, savedAddresses, selectedAddress) => {
  const savedSelectedAddress = selectedAddress?.id
    ? savedAddresses.find((address) => address.id === selectedAddress.id)
    : savedAddresses.find((address) => isSameAddress(address, selectedAddress));
  const preferredAddress =
    savedSelectedAddress || savedAddresses[0] || selectedAddress;

  return {
    ...createBlankAddress(user),
    ...(preferredAddress || {}),
    fullName: preferredAddress?.fullName || user?.name || "",
  };
};

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, clearCart, updateQuantity } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const {
    addAddress,
    savedAddresses,
    selectedAddress,
    setSelectedAddress,
    appliedCoupon,
    removeCoupon,
  } = usePreferencesStore();
  const { createOrder } = useOrdersStore();
  const { addToast } = useToast();
  const [isLocating, setIsLocating] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [mapLocationLabel, setMapLocationLabel] = useState(
    readStoredLocationLabel,
  );
  const [address, setAddress] = useState(() =>
    getPreferredAddress(user, savedAddresses, selectedAddress),
  );
  const [buyNowItems, setBuyNowItems] = useState(
    () => JSON.parse(localStorage.getItem("buy_now_items")) || [],
  );
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [showB2BQuantityPrompt, setShowB2BQuantityPrompt] = useState(false);
  const isBuyNowCheckout = searchParams.get("buyNow") === "1";
  const checkoutItems = isBuyNowCheckout ? buyNowItems : items;
  const isB2B = !!user?.isB2B;
  const b2bLowQuantityItems = isB2B
    ? checkoutItems.filter(
        (item) => Number(item.quantity || 0) < B2B_MIN_ORDER_QUANTITY,
      )
    : [];
  const hasB2BQuantityIssue = b2bLowQuantityItems.length > 0;
  const registeredBusinessAddress = useMemo(
    () => createBusinessAddress(user?.businessProfile, user),
    [user],
  );

  const subtotal = calculateSubtotal(checkoutItems);
  const discountAmount = Math.min(appliedCoupon?.discountAmount || 0, subtotal);
  const delivery = calculateDeliveryCharges(subtotal);
  const total = Math.max(subtotal - discountAmount, 0) + delivery;
  const isAddressReady = useMemo(
    () =>
      address.fullName.trim().length >= 2 &&
      validateMobile(address.mobile) &&
      address.houseNumber.trim() &&
      address.area.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      validatePincode(address.pincode),
    [address],
  );
  const deliveryAddressMessage =
    savedAddresses.length > 0
      ? address.id
        ? "Saved address selected by default."
        : "New address form selected."
      : "Current location pinned on map.";
  const selectedSavedAddress = savedAddresses.find(
    (savedAddress) => savedAddress.id === address.id,
  );
  const addressDropdownLabel = selectedSavedAddress
    ? `${selectedSavedAddress.fullName} - ${selectedSavedAddress.city}, ${selectedSavedAddress.pincode}`
    : "Add new address";

  useEffect(() => {
    if (isB2B) {
      setAddress(registeredBusinessAddress);
      setMapLocationLabel(
        [
          registeredBusinessAddress.area,
          registeredBusinessAddress.city,
          registeredBusinessAddress.state,
        ]
          .filter(Boolean)
          .join(", ") || "Registered business address",
      );
    }
  }, [isB2B, registeredBusinessAddress]);

  if (checkoutItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="mb-4 text-xl text-slate-600">
          {isBuyNowCheckout
            ? "No product selected for checkout"
            : "Your cart is empty"}
        </p>
        <button onClick={() => navigate("/products")} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <p className="mb-4 text-xl text-slate-600">Please login to checkout</p>
        <Modal
          isOpen
          onClose={() =>
            navigate(
              `/login?redirect=${encodeURIComponent(isBuyNowCheckout ? "/checkout?buyNow=1" : "/checkout")}`,
            )
          }
          title="Login to continue checkout"
        >
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700">
              <LockKeyhole size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-950">
              Please login first
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Login to use your delivery address and complete checkout.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/login?redirect=${encodeURIComponent(isBuyNowCheckout ? "/checkout?buyNow=1" : "/checkout")}`,
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
                    `/register?redirect=${encodeURIComponent(isBuyNowCheckout ? "/checkout?buyNow=1" : "/checkout")}`,
                  )
                }
                className="btn-outline inline-flex items-center justify-center gap-2 py-3"
              >
                Create Account
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  const updateAddress = (field, value) => {
    if (isB2B) return;
    setAddress((prev) => {
      const nextAddress = { ...prev, [field]: value };
      delete nextAddress.id;
      return nextAddress;
    });
  };

  const handleSelectSavedAddress = (savedAddress) => {
    if (isB2B) return;
    const nextAddress = {
      ...createBlankAddress(user),
      ...savedAddress,
    };
    setAddress(nextAddress);
    setMapLocationLabel(
      [savedAddress.area, savedAddress.city, savedAddress.state]
        .filter(Boolean)
        .join(", ") || "Saved address",
    );
    setSelectedAddress(savedAddress);
    setIsAddressDropdownOpen(false);
    addToast("Saved address selected", "success");
  };

  const handleAddNewAddress = () => {
    if (isB2B) return;
    setAddress(createBlankAddress(user));
    setMapLocationLabel("New address");
    setIsAddressDropdownOpen(false);
    addToast("Add a new delivery address", "info");
  };

  const handleUseCurrentLocation = () => {
    if (isB2B) {
      addToast(
        "B2B checkout uses the address from your Business Registration Form.",
        "info",
      );
      return;
    }
    if (!navigator.geolocation) {
      addToast("Current location is not supported in this browser", "error");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const latitude = coords.latitude.toFixed(5);
        const longitude = coords.longitude.toFixed(5);

        try {
          const locationData = await reverseGeocode(latitude, longitude);
          const areaLabel =
            buildAreaLabel(locationData) || "Detected nearby area";
          const city = locationData.city || locationData.locality || "";
          const state = locationData.principalSubdivision || "";
          const pincode = locationData.postcode || "";

          setMapLocationLabel(areaLabel);
          saveLocationLabel(areaLabel);
          setAddress((prev) => ({
            ...prev,
            area: areaLabel,
            city: city || prev.city || areaLabel,
            state: state || prev.state,
            pincode: pincode || prev.pincode,
            landmark: prev.landmark || "Pinned from device location",
          }));
          addToast("Current location area added", "success");
        } catch {
          setMapLocationLabel("Detected nearby area");
          saveLocationLabel("Detected nearby area");
          setAddress((prev) => ({
            ...prev,
            area: prev.area || "Detected nearby area",
            city: prev.city || "Detected nearby area",
            landmark: prev.landmark || "Pinned from device location",
          }));
          addToast(
            "Current location pinned. Add city and PIN manually.",
            "warning",
          );
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        addToast(
          "Please allow location access to use current location",
          "error",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const handlePlaceOrder = async () => {
    if (!isAddressReady) {
      addToast(
        "Complete required address fields before placing order.",
        "error",
      );
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderAddress = { ...address };
      const savedAddress = savedAddresses.find(
        (savedAddress) =>
          savedAddress.id === orderAddress.id ||
          isSameAddress(savedAddress, orderAddress),
      );

      if (!isB2B && !savedAddress) {
        addAddress(orderAddress);
      }
      if (!isB2B) {
        setSelectedAddress(savedAddress || orderAddress);
      }

      const orderNumber = generateOrderNumber();

      await createOrder({
        items: checkoutItems.map((it) => ({
          product: it._id || it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.image,
        })),
        address: {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.houseNumber,
          line2: address.area,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        subtotal,
        discount: discountAmount,
        shipping: delivery,
        total,
        couponCode: appliedCoupon?.code || undefined,
        paymentMethod: "COD",
      });

      if (isBuyNowCheckout) {
        localStorage.removeItem("buy_now_items");
      } else {
        await clearCart();
        removeCoupon();
      }
      addToast("Order placed successfully!", "success");
      navigate("/track-order");
    } catch (err) {
      addToast(apiErrorMessage(err, "Could not place order"), "error");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-9">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-rose-500">
            {isB2B ? "B2B Checkout" : "Checkout"}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-slate-950">
            Add delivery address
          </h1>
          <p className="mt-4 text-base text-slate-600">
            {isB2B
              ? `Order will be billed to ${user.businessProfile?.businessName || "your registered business"} with B2B pricing.`
              : "Add address manually or pin your current address from the map location button."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  {isB2B ? "Business delivery details" : "Delivery details"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {isB2B
                    ? "This address comes from your Business Registration Form."
                    : "Your order will be delivered to this address."}
                </p>
              </div>
              {!isB2B && (
                <LoadingButton
                  type="button"
                  onClick={handleUseCurrentLocation}
                  isLoading={isLocating}
                  loadingText="Locating..."
                  icon={LocateFixed}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-teal-600 px-5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 disabled:opacity-60"
                >
                  Use current address
                </LoadingButton>
              )}
            </div>

            <div className="mb-6 rounded-lg bg-teal-50 px-4 py-3 text-sm font-bold text-teal-700">
              {isB2B
                ? "Registered business address selected for this B2B order."
                : deliveryAddressMessage}
            </div>

            {hasB2BQuantityIssue && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <AlertTriangle
                      className="mt-0.5 shrink-0 text-amber-700"
                      size={20}
                    />
                    <div>
                      <p className="font-bold text-amber-950">
                        B2B order quantity is too low
                      </p>
                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        You are now a B2B buyer. Each product must have at least{" "}
                        {B2B_MIN_ORDER_QUANTITY} units before checkout.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUpdateB2BMinimumQuantities}
                    className="btn-primary h-10 shrink-0 px-4 text-sm"
                  >
                    Update all to {B2B_MIN_ORDER_QUANTITY}
                  </button>
                </div>
              </div>
            )}

            {!isB2B && savedAddresses.length > 0 && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-extrabold text-slate-950">
                  Saved address
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsAddressDropdownOpen((prev) => !prev)}
                    className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-sm font-bold text-slate-950 transition hover:border-teal-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    aria-expanded={isAddressDropdownOpen}
                  >
                    <span className="min-w-0 truncate">
                      {addressDropdownLabel}
                    </span>
                    <ChevronDown
                      className={`shrink-0 text-slate-500 transition ${isAddressDropdownOpen ? "rotate-180" : ""}`}
                      size={18}
                    />
                  </button>

                  {isAddressDropdownOpen && (
                    <div className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                      <button
                        type="button"
                        onClick={handleAddNewAddress}
                        className={`flex w-full items-start justify-between gap-3 rounded-md px-3 py-3 text-left transition ${
                          address.id
                            ? "hover:bg-slate-50"
                            : "bg-teal-50 text-teal-900"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-bold">
                            Add new address
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-600">
                            Enter a fresh delivery address for this order.
                          </span>
                        </span>
                        <PlusCircle
                          className="mt-0.5 shrink-0 text-teal-700"
                          size={18}
                        />
                      </button>

                      <div className="my-2 border-t border-slate-100" />

                      {savedAddresses.map((savedAddress) => {
                        const isSelected = address.id === savedAddress.id;

                        return (
                          <button
                            key={savedAddress.id}
                            type="button"
                            onClick={() =>
                              handleSelectSavedAddress(savedAddress)
                            }
                            className={`flex w-full items-start justify-between gap-3 rounded-md px-3 py-3 text-left transition ${
                              isSelected
                                ? "bg-teal-50 text-teal-900"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <span className="min-w-0">
                              <span className="block text-sm font-bold">
                                {savedAddress.fullName}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-slate-600">
                                {savedAddress.houseNumber}, {savedAddress.area},{" "}
                                {savedAddress.city}, {savedAddress.state}{" "}
                                {savedAddress.pincode}
                              </span>
                              <span className="mt-1 block text-xs font-semibold text-slate-700">
                                {savedAddress.mobile}
                              </span>
                            </span>
                            {isSelected && (
                              <CheckCircle2
                                className="mt-0.5 shrink-0 text-teal-700"
                                size={18}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Full name
                </span>
                <input
                  value={address.fullName}
                  onChange={(event) =>
                    updateAddress("fullName", event.target.value)
                  }
                  placeholder="Full name"
                  disabled={isB2B}
                  className="input-base h-12 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Phone number
                </span>
                <input
                  value={address.mobile}
                  onChange={(event) =>
                    updateAddress(
                      "mobile",
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  placeholder="Phone number"
                  disabled={isB2B}
                  className="input-base h-12 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  House / flat / building
                </span>
                <input
                  value={address.houseNumber}
                  onChange={(event) =>
                    updateAddress("houseNumber", event.target.value)
                  }
                  placeholder="Business name / building"
                  disabled={isB2B}
                  className="input-base h-12 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Area / street
                </span>
                <input
                  value={address.area}
                  onChange={(event) =>
                    updateAddress("area", event.target.value)
                  }
                  placeholder="Registered business address"
                  disabled={isB2B}
                  className="input-base h-12 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  City
                </span>
                <input
                  value={address.city}
                  onChange={(event) =>
                    updateAddress("city", event.target.value)
                  }
                  placeholder="City"
                  disabled={isB2B}
                  className="input-base h-12 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  State
                </span>
                <input
                  value={address.state}
                  onChange={(event) =>
                    updateAddress("state", event.target.value)
                  }
                  placeholder="State"
                  disabled={isB2B}
                  className="input-base h-12 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  PIN code
                </span>
                <input
                  value={address.pincode}
                  onChange={(event) =>
                    updateAddress(
                      "pincode",
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="PIN code"
                  disabled={isB2B}
                  className="input-base h-12 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Landmark
                </span>
                <input
                  value={address.landmark}
                  onChange={(event) =>
                    updateAddress("landmark", event.target.value)
                  }
                  placeholder="Registration reference"
                  disabled={isB2B}
                  className="input-base h-12 disabled:bg-slate-50 disabled:text-slate-700"
                />
              </label>
            </div>

            <div className="relative mt-6 h-72 overflow-hidden rounded-lg border border-teal-100 bg-teal-50">
              <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(#99f6e4_1px,transparent_1px),linear-gradient(90deg,#99f6e4_1px,transparent_1px),repeating-linear-gradient(135deg,transparent_0_90px,rgba(248,113,113,0.20)_92px,rgba(248,113,113,0.20)_98px,transparent_100px)] [background-size:36px_36px,36px_36px,180px_180px]" />
              <div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-rose-500 text-white shadow-lg">
                <MapPin size={28} />
              </div>
              <div className="absolute inset-x-6 bottom-6 rounded-lg bg-white/95 px-5 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Navigation className="mt-1 text-teal-700" size={18} />
                  <div>
                    <p className="font-extrabold text-slate-950">
                      Map location
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {mapLocationLabel}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Pinned from current location
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isB2B && (
              <div className="mt-4 flex flex-col gap-3 rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-bold">Need to change this address?</span>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/b2b/edit/${user.businessProfile?.id}`)
                  }
                  className="btn-outline inline-flex h-10 items-center justify-center"
                >
                  Edit Business Registration
                </button>
              </div>
            )}

            {!isB2B && savedAddresses.length > 0 && (
              <p className="mt-4 text-xs text-slate-500">
                {savedAddresses.length} saved address
                {savedAddresses.length > 1 ? "es" : ""} available in your
                account.
              </p>
            )}
          </section>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-6 text-xl font-extrabold text-slate-950">
              Order summary
            </h2>
            {isB2B && (
              <div className="mb-5 rounded-lg bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">
                B2B buyer: {user.businessProfile?.businessName || user.name}
              </div>
            )}
            <div className="space-y-4">
              {checkoutItems.map((item) => (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="line-clamp-1 text-slate-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-extrabold text-slate-950">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                  {isB2B && item.quantity < B2B_MIN_ORDER_QUANTITY && (
                    <p className="mt-1 text-xs font-bold text-amber-700">
                      Minimum B2B qty: {B2B_MIN_ORDER_QUANTITY}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-slate-200" />
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>{isB2B ? "B2B subtotal" : "Subtotal"}</span>
                <span className="font-extrabold text-slate-950">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo ({appliedCoupon.code})</span>
                  <span className="font-extrabold">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-extrabold text-slate-950">
                  {delivery === 0 ? "FREE" : formatCurrency(delivery)}
                </span>
              </div>
            </div>
            <div className="my-5 border-t border-slate-200" />
            <div className="flex justify-between text-xl font-extrabold text-slate-950">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <LoadingButton
              type="button"
              onClick={handlePlaceOrder}
              disabled={!isAddressReady}
              isLoading={isPlacingOrder}
              loadingText="Placing order..."
              icon={isAddressReady ? PackageCheck : CheckCircle2}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 font-bold text-white transition hover:bg-teal-800 disabled:bg-slate-300 disabled:text-white"
            >
              {isB2B ? "Place B2B order" : "Place order"}
            </LoadingButton>
            {hasB2BQuantityIssue && (
              <p className="mt-4 text-sm font-semibold text-amber-700">
                Increase {b2bLowQuantityItems.length} product
                {b2bLowQuantityItems.length > 1 ? "s" : ""} to{" "}
                {B2B_MIN_ORDER_QUANTITY}+ units for B2B checkout.
              </p>
            )}
            {!isAddressReady && (
              <p className="mt-4 text-sm text-slate-500">
                Complete required address fields before placing order.
              </p>
            )}
          </aside>
        </div>
      </div>

      <Modal
        isOpen={showB2BQuantityPrompt}
        onClose={() => setShowB2BQuantityPrompt(false)}
        title="B2B minimum quantity required"
      >
        <div>
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-50 text-amber-700">
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-center text-xl font-bold text-slate-950">
            You cannot checkout with this quantity
          </h3>
          <p className="mt-2 text-center text-sm leading-6 text-slate-500">
            Your account is B2B now. B2B orders require at least{" "}
            {B2B_MIN_ORDER_QUANTITY} units for every product.
          </p>
          <div className="mt-5 space-y-3">
            {b2bLowQuantityItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-950">
                    {item.name}
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-amber-700">
                    Current qty: {item.quantity}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-bold text-slate-950">
                  Need {B2B_MIN_ORDER_QUANTITY}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleUpdateB2BMinimumQuantities}
              className="btn-primary h-11"
            >
              Update all to {B2B_MIN_ORDER_QUANTITY}
            </button>
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="btn-outline h-11"
            >
              Review cart
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;
