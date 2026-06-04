# MediCare - Indian Online Pharmacy Frontend

A production-quality eCommerce frontend for an Indian medicine delivery platform built with React.js, Tailwind CSS, and Zustand.

## Project Overview

MediCare is a modern, responsive pharmacy eCommerce platform inspired by platforms like 1mg, Netmeds, and PharmEasy. It provides a seamless shopping experience for medicines and healthcare products with features like:

- **Product Browsing**: Search, filter, sort medicines and healthcare products
- **Smart Checkout**: Multi-step checkout with address management
- **User Authentication**: Mobile OTP and email-based login
- **Prescription Upload**: Upload and manage doctor's prescriptions
- **Order Tracking**: Real-time order status tracking
- **Wishlist & Cart**: Save favorites and manage shopping cart
- **Health Blogs**: Informative health and wellness articles
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Tech Stack

- **Frontend Framework**: React 18+
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Storage**: localStorage for persistence

## Getting Started

### Prerequisites
- Node.js 16+ and npm 8+

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (Header, Footer, Modal, Toast, etc.)
│   ├── home/            # Home page components
│   ├── products/        # Product listing components
│   ├── cart/            # Cart components
│   └── auth/            # Authentication components
├── pages/               # Page components (routes)
├── store/               # Zustand state management
├── data/                # Dummy data
├── utils/               # Helper functions and utilities
├── hooks/               # Custom React hooks
├── layouts/             # Layout components
├── styles/              # Global styles
├── App.jsx              # Main app with routing
└── main.jsx             # React entry point
```

## Features

### 🏠 Home Page
- Hero banner - Responsive healthcare banner with CTAs
- Search section - Medicine and product search
- Category browsing - 15+ healthcare categories
- Top-selling products - Product carousel
- Promotional banners - Offers and deals
- Why choose us - Trust indicators
- Health blogs preview
- FAQ section

### 🛍️ Product Listing & Filtering
- Advanced filters: Category, Price Range, Brand, Rating
- Sort options: Popularity, Newest, Price, Rating
- Responsive grid layout (1-4 columns based on screen size)
- Pagination with configurable items per page
- Mobile filter drawer
- Real-time filtering and sorting

### 📝 Product Detail Page
- Product gallery
- Detailed specifications
- Price comparison (MRP vs Discount)
- Prescription requirement indicator
- Stock status
- Quantity selector
- Add to cart and wishlist
- Product reviews and ratings
- Related products

### 🛒 Shopping Cart
- Add/remove items
- Update quantities
- Apply coupons (Demo: WELCOME20)
- Calculate totals with:
  - Subtotal
  - GST (5%)
  - Delivery charges
  - Order total

### 💳 Checkout (Multi-Step)
1. **Address Selection**: Select or add delivery address
2. **Delivery Slot**: Choose preferred delivery time
3. **Payment Method**: UPI, Card, Net Banking, COD
4. **Order Review**: Confirm order before placing

### 👤 User Authentication
- **Mobile OTP Login**: Phone verification flow
- **Email Login**: Email and password authentication
- **Registration**: Create new account with validation

### 📋 User Dashboard
- Profile management
- Order history and tracking
- Prescription uploads
- Saved addresses
- Account settings

### 🩺 Prescription Management
- Drag & drop file upload
- Supported formats: JPG, PNG, PDF
- File size validation (Max 5MB)
- Upload status tracking
- History of prescriptions

### 📚 Health Blogs
- Blog listing with category filter
- Detailed blog pages
- Rich content display
- Related articles suggestions
- Author and read time information

### ⚙️ State Management (Zustand)

#### Cart Store
```javascript
const { items, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCartStore();
```

#### Wishlist Store
```javascript
const { items, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
```

#### Auth Store
```javascript
const { user, isLoggedIn, login, logout, updateProfile } = useAuthStore();
```

#### Preferences Store
```javascript
const { savedAddresses, appliedCoupon, addAddress, setSelectedAddress } = usePreferencesStore();
```

#### Orders & Prescriptions Stores
```javascript
const { orders, createOrder, updateOrder } = useOrdersStore();
const { prescriptions, uploadPrescription } = usePrescriptionsStore();
```

## Data Persistence

All data is persisted in `localStorage`:
- `cart` - Shopping cart items
- `wishlist` - Wishlist products
- `auth_user` - User authentication data
- `saved_addresses` - User addresses
- `orders` - Order history
- `prescriptions` - Uploaded prescriptions
- `applied_coupon` - Active coupon

## Routes

### Public Routes
- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product detail
- `/blogs` - Blog listing
- `/blog/:slug` - Blog detail
- `/faq` - FAQ page
- `/about-us` - About page
- `/contact-us` - Contact page
- `/login` - Login page
- `/register` - Register page

### Protected Routes
- `/account` - User dashboard
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/track-order` - Order tracking
- `/upload-prescription` - Prescription upload
- `/wishlist` - Wishlist

## Demo Data

### Test Users
- Email: rajesh@example.com | Password: password123
- Email: priya@example.com | Password: password123

### Test Mobile OTP
- Number: 9876543210 | OTP: Any 4 digits

### Test Coupon Code
- Code: WELCOME20 | Discount: 20%

## Responsive Design

✅ **Mobile-first approach**
- Fixed bottom navigation
- Hamburger menu
- Mobile-optimized images
- Touch-friendly buttons
- Sticky search bar

✅ **Tablet optimization**
- App-like interface
- Drawer menus
- Optimized layouts

✅ **Desktop experience**
- Mega menu
- Multi-column layouts
- Sidebar filters
- Enhanced navigation

## Key Components

### Common Components
- `Header` - Navigation header with search
- `Footer` - Site footer with links
- `Toast` - Notification system
- `Modal` - Dialog component
- `Pagination` - Page navigation
- `Skeleton` - Loading placeholders
- `EmptyState` - Empty state UI

### Product Components
- `ProductCard` - Individual product display
- `ProductGrid` - Product list grid
- `FilterSidebar` - Filter controls
- `ProductGallery` - Image gallery

### Forms
- `AddressForm` - Address input form
- `LoginForm` - Authentication form
- `RegisterForm` - User registration

## Validation Functions

```javascript
validateEmail(email)        // Email format validation
validateMobile(mobile)      // 10-digit mobile number
validatePincode(pincode)    // 6-digit postal code
validateName(name)          // Minimum 2 characters
```

## Utility Functions

```javascript
formatCurrency(amount)         // Format as INR currency
calculateDiscountPercentage()  // Discount calculation
calculateGST(amount)           // GST calculation
calculateDeliveryCharges()     // Delivery fee logic
generateOrderNumber()          // Unique order ID generation
debounce()                     // Function debouncing
```

## SEO & Accessibility

✅ Semantic HTML structure
✅ Meta tags on all pages
✅ Image alt attributes
✅ ARIA labels
✅ Keyboard navigation
✅ Mobile viewport optimization
✅ Fast page load times
✅ Clean, descriptive URLs

## Performance Features

✅ Code splitting with lazy loading
✅ Image optimization
✅ Efficient re-renders
✅ localStorage caching
✅ Debounced filters
✅ CSS optimizations

## Testing Demo

1. **Add to Cart**: Browse products and add to cart
2. **Apply Coupon**: Use code "WELCOME20" for 20% discount
3. **Checkout**: Go through complete checkout flow
4. **Create Order**: Place an order and see order tracking
5. **Upload Prescription**: Upload prescription files

## Browser Support

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers

## Future Enhancements

- [ ] Backend API integration
- [ ] Real payment gateway
- [ ] Admin dashboard
- [ ] Doctor consultation chat
- [ ] Push notifications
- [ ] PWA support
- [ ] Performance monitoring
- [ ] Unit tests
- [ ] E2E tests
- [ ] Analytics integration

## Currency & Locale

- **Currency**: INR (₹) 
- **Language**: English
- **Date Format**: DD/MM/YYYY
- **Phone Format**: 10-digit Indian numbers
- **Target Market**: India

## Deployment Ready

✅ Production-ready code
✅ Error handling
✅ Loading states
✅ Input validation
✅ Security best practices
✅ Responsive design
✅ Accessibility compliance

## Support

For questions or issues:
- Email: support@medicare.com  
- Phone: +91-1234-567890
- Website: www.medicare.com

---

**Built with ❤️ for healthcare delivery in India**

Last Updated: June 2026
