// Validates email format
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validates mobile number (10 digits)
export const validateMobile = (mobile) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(mobile.replace(/\D/g, ''));
};

// Validates pincode (6 digits)
export const validatePincode = (pincode) => {
  const regex = /^[0-9]{6}$/;
  return regex.test(pincode);
};

// Format currency in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Debounce function
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Generate unique ID
export const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// Truncate text
export const truncateText = (text, length) => {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};

// Calculate reading time for blogs
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format date with time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Convert slug to title
export const slugToTitle = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Convert title to slug
export const titleToSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

// Get discount percentage
export const getDiscountPercentage = (mrp, price) => {
  return Math.round(((mrp - price) / mrp) * 100);
};

// Demo wholesale pricing for approved B2B storefront users.
export const getB2BPrice = (price) => Math.max(Math.round(price * 0.82), 1);

export const getStorefrontProduct = (product, user) => {
  if (!user?.isB2B) return product;

  const retailPrice = product.retailPrice || product.price;
  const retailMrp = product.retailMrp || product.mrp;

  return {
    ...product,
    price: getB2BPrice(retailPrice),
    mrp: retailMrp,
    retailPrice,
    retailMrp,
    isB2BPrice: true,
  };
};

// Check if prescription is required
export const isPrescriptionRequired = (product) => {
  return product.prescriptionRequired === true;
};

// Get delivery days
export const getDeliveryDays = (pincode) => {
  // Simulated logic - in real app, check against delivery zones
  const ruralPincodes = ['000000'];
  if (ruralPincodes.includes(pincode)) {
    return '5-7 days';
  }
  return '1-2 days';
};

// Validate file type
export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// Validate file size
export const isValidFileSize = (file, maxSizeMB) => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
};

// Get browser storage type
export const getStorageType = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return 'localStorage';
  } catch {
    return 'memory';
  }
};

// Get initials from a user's full name for avatar fallbacks
export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

// Calculate cart subtotal
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Calculate GST (assuming 5% for most medicines, 12% for selected)
export const calculateGST = (subtotal, gstRate = 5) => {
  return Math.round((subtotal * gstRate) / 100 * 100) / 100;
};

// Calculate delivery charges
export const calculateDeliveryCharges = (subtotal) => {
  if (subtotal >= 499) {
    return 0; // Free delivery above 499
  }
  return 50; // Standard delivery charge
};

// Generate order number
export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD${timestamp}${random}`;
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
    approved: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Get status icon
export const getStatusIcon = (status) => {
  const icons = {
    pending: '⏳',
    processing: '⚙️',
    shipped: '🚚',
    delivered: '✅',
    cancelled: '❌',
    rejected: '❌',
    approved: '✅',
  };
  return icons[status] || '•';
};

// SEO utilities
export const generateMetaTags = (page) => {
  const baseTags = {
    '/': {
      title: 'Indian Online Pharmacy | Medicines & Healthcare Products',
      description: 'Order genuine medicines, healthcare products, and vitamins online with home delivery. Trusted pharmacy platform with secure payments.',
    },
    '/products': {
      title: 'Shop Medicines & Healthcare Products Online',
      description: 'Browse our wide range of medicines, health products, and vitamins. Filter by category, price, and rating.',
    },
  };
  return baseTags[page] || baseTags['/'];
};
