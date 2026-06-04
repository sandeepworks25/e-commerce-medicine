import heroImage from '../assets/medical-hero.png';
import medicineImage from '../assets/catalog-medicines.png';
import deviceImage from '../assets/catalog-devices.png';
import careImage from '../assets/catalog-care.png';
import categoryMedicines from '../assets/category-medicines.png';
import categoryVitamins from '../assets/category-vitamins.png';
import categoryDiabetes from '../assets/category-diabetes.png';
import categoryDevices from '../assets/category-devices.png';
import categoryPersonalCare from '../assets/category-personal-care.png';
import categoryBabyCare from '../assets/category-baby-care.png';
import categoryAyurveda from '../assets/category-ayurveda.png';
import categoryFamilyCare from '../assets/category-family-care.png';

const categoryVisuals = {
  medicines: { image: categoryMedicines, accent: 'from-sky-50 to-emerald-50', icon: 'Pill' },
  'pain-relief': { image: categoryMedicines, accent: 'from-rose-50 to-sky-50', icon: 'BadgePlus' },
  'cough-cold': { image: categoryMedicines, accent: 'from-cyan-50 to-emerald-50', icon: 'ThermometerSun' },
  vitamins: { image: categoryVitamins, accent: 'from-amber-50 to-emerald-50', icon: 'Sparkles' },
  supplements: { image: categoryVitamins, accent: 'from-lime-50 to-teal-50', icon: 'Leaf' },
  ayurveda: { image: categoryAyurveda, accent: 'from-green-50 to-amber-50', icon: 'Leaf' },
  healthcare: { image: categoryDevices, accent: 'from-blue-50 to-teal-50', icon: 'HeartPulse' },
  'diabetes-care': { image: categoryDiabetes, accent: 'from-indigo-50 to-cyan-50', icon: 'Activity' },
  'heart-care': { image: categoryDevices, accent: 'from-rose-50 to-cyan-50', icon: 'HeartPulse' },
  'medical-devices': { image: categoryDevices, accent: 'from-slate-50 to-sky-50', icon: 'Stethoscope' },
  'skin-care': { image: categoryPersonalCare, accent: 'from-pink-50 to-teal-50', icon: 'Sparkles' },
  'hair-care': { image: categoryPersonalCare, accent: 'from-violet-50 to-sky-50', icon: 'Sparkles' },
  'personal-care': { image: categoryPersonalCare, accent: 'from-teal-50 to-rose-50', icon: 'ShieldCheck' },
  'women-care': { image: categoryFamilyCare, accent: 'from-pink-50 to-emerald-50', icon: 'HeartHandshake' },
  'men-care': { image: categoryFamilyCare, accent: 'from-sky-50 to-slate-50', icon: 'ShieldCheck' },
  'baby-care': { image: categoryBabyCare, accent: 'from-yellow-50 to-pink-50', icon: 'Baby' },
  'elder-care': { image: categoryFamilyCare, accent: 'from-stone-50 to-cyan-50', icon: 'HeartHandshake' },
};

export const siteBanners = {
  hero: heroImage,
  delivery: deviceImage,
  pharmacy: medicineImage,
};

export const siteBannerSlides = [
  { id: 1, image: heroImage, alt: 'Premium online pharmacy banner' },
  { id: 2, image: categoryMedicines, alt: 'Medicines and pharmacy essentials banner' },
  { id: 3, image: categoryDevices, alt: 'Home healthcare devices banner' },
  { id: 4, image: categoryPersonalCare, alt: 'Personal care healthcare products banner' },
];

export const fetchHomeBanners = async () => siteBannerSlides;

export const getCategoryVisual = (slug) => categoryVisuals[slug] || categoryVisuals.healthcare;

const productImageFor = (category) => getCategoryVisual(category).image;

const productImagesFor = (category) => {
  const primary = productImageFor(category);
  return [primary, medicineImage, deviceImage, careImage].filter((image, index, images) => images.indexOf(image) === index);
};

const ingredientsFor = (category) => {
  if (['medical-devices', 'healthcare', 'diabetes-care', 'heart-care'].includes(category)) {
    return ['Medical-grade ABS body', 'Digital sensor module', 'User manual', 'Battery-ready packaging'];
  }
  if (['skin-care', 'hair-care', 'personal-care', 'baby-care', 'women-care', 'men-care', 'elder-care'].includes(category)) {
    return ['Dermatologically tested base', 'Gentle moisturizing agents', 'Botanical extracts', 'Skin-friendly fragrance'];
  }
  if (['vitamins', 'supplements'].includes(category)) {
    return ['Essential vitamins', 'Mineral blend', 'Stabilizing excipients', 'Vegetarian capsule shell'];
  }
  if (category === 'ayurveda') {
    return ['Herbal extracts', 'Natural plant actives', 'Purified base', 'Traditional wellness blend'];
  }
  return ['Active pharmaceutical ingredient', 'Approved excipients', 'Stabilizing agents', 'Blister-safe packaging'];
};

const generatedCatalog = [
  { name: 'Paracetamol 650mg', category: 'medicines', brand: 'Cipla', description: 'Trusted fever and pain support' },
  { name: 'Omega-3 Softgels', category: 'heart-care', brand: 'Abbott', description: 'Daily heart wellness supplement' },
  { name: 'Gluco Test Strips', category: 'diabetes-care', brand: 'Dr Reddy\'s', description: 'Accurate glucose monitoring strips' },
  { name: 'Pulse Oximeter', category: 'medical-devices', brand: 'Mankind', description: 'Compact oxygen and pulse monitor' },
  { name: 'Hydrating Face Cleanser', category: 'skin-care', brand: 'Himalaya', description: 'Gentle daily skincare cleanser' },
  { name: 'Protein Nutrition Powder', category: 'supplements', brand: 'Dabur', description: 'Balanced nutrition for active days' },
  { name: 'Ayurvedic Immunity Drops', category: 'ayurveda', brand: 'Baidyanath', description: 'Herbal wellness and immunity support' },
  { name: 'Baby Moisturizing Lotion', category: 'baby-care', brand: 'Himalaya', description: 'Soft daily care for baby skin' },
  { name: 'Women Wellness Capsules', category: 'women-care', brand: 'Zydus', description: 'Everyday nutrition support for women' },
  { name: 'Men Daily Multivitamin', category: 'men-care', brand: 'Alkem', description: 'Daily wellness support for men' },
  { name: 'Elder Joint Care Tablets', category: 'elder-care', brand: 'Sun Pharma', description: 'Joint comfort and mobility support' },
  { name: 'Anti-Dandruff Shampoo', category: 'hair-care', brand: 'Dabur', description: 'Scalp care and hair cleansing formula' },
  { name: 'Digital Thermometer', category: 'healthcare', brand: 'Mankind', description: 'Fast and easy temperature readings' },
  { name: 'Nasal Relief Drops', category: 'cough-cold', brand: 'Cipla', description: 'Cold and congestion comfort support' },
  { name: 'Muscle Relief Spray', category: 'pain-relief', brand: 'Alkem', description: 'Quick topical support for muscle pain' },
];

// Dummy Products Data
export const dummyProducts = [
  {
    id: 1,
    name: 'Aspirin 500mg',
    brand: 'Cipla',
    manufacturer: 'Cipla Limited',
    category: 'pain-relief',
    price: 45,
    mrp: 60,
    rating: 4.5,
    reviews: 234,
    image: productImageFor('pain-relief'),
    description: 'Effective pain reliever and fever reducer',
    uses: ['Headache', 'Fever', 'Body Pain'],
    benefits: ['Fast acting', 'Long lasting relief'],
    sideEffects: ['Mild stomach upset', 'Dizziness'],
    directions: 'Take 1 tablet with water every 4-6 hours as needed',
    storage: 'Store in cool, dry place below 25°C',
    prescriptionRequired: false,
    stock: 50,
  },
  {
    id: 2,
    name: 'Vitamin D3 1000 IU',
    brand: 'Himalaya',
    manufacturer: 'Himalaya Wellness',
    category: 'vitamins',
    price: 299,
    mrp: 450,
    rating: 4.3,
    reviews: 567,
    image: productImageFor('vitamins'),
    description: 'Essential vitamin for bone health',
    uses: ['Bone health', 'Calcium absorption'],
    benefits: ['Strengthens bones', 'Improves immunity'],
    sideEffects: 'Generally well tolerated',
    directions: 'Take 1 capsule daily with food',
    storage: 'Store in cool, dry place',
    prescriptionRequired: false,
    stock: 100,
  },
  {
    id: 3,
    name: 'Cough Syrup',
    brand: 'Baidyanath',
    manufacturer: 'Baidyanath Ayurved Bhawan',
    category: 'cough-cold',
    price: 120,
    mrp: 160,
    rating: 4.2,
    reviews: 312,
    image: productImageFor('cough-cold'),
    description: 'Natural cough relief syrup',
    uses: ['Dry cough', 'Wet cough', 'Cold'],
    benefits: ['Natural ingredients', 'Quick relief'],
    sideEffects: 'May cause mild drowsiness',
    directions: 'Take 2 teaspoons twice daily',
    storage: 'Store at room temperature',
    prescriptionRequired: false,
    stock: 75,
  },
  {
    id: 4,
    name: 'Blood Pressure Monitor',
    brand: 'Dr. Reddy\'s',
    manufacturer: 'Dr. Reddy\'s Laboratories',
    category: 'medical-devices',
    price: 1299,
    mrp: 1799,
    rating: 4.6,
    reviews: 234,
    image: productImageFor('medical-devices'),
    description: 'Digital blood pressure monitor',
    uses: ['Blood pressure monitoring'],
    benefits: ['Accurate readings', 'Easy to use', 'Memory function'],
    sideEffects: 'None',
    directions: 'Follow instruction manual',
    storage: 'Store in dry place',
    prescriptionRequired: false,
    stock: 30,
  },
  {
    id: 5,
    name: 'Metformin 500mg',
    brand: 'Sun Pharma',
    manufacturer: 'Sun Pharmaceutical Industries',
    category: 'diabetes-care',
    price: 89,
    mrp: 120,
    rating: 4.4,
    reviews: 445,
    image: productImageFor('diabetes-care'),
    description: 'Effective diabetes management',
    uses: ['Type 2 diabetes'],
    benefits: ['Controls blood sugar'],
    sideEffects: ['Mild GI disturbance', 'Metallic taste'],
    directions: 'As per doctor\'s prescription',
    storage: 'Store in cool place',
    prescriptionRequired: true,
    stock: 200,
  },
  {
    id: 6,
    name: 'Multivitamin Tablets',
    brand: 'Dabur',
    manufacturer: 'Dabur India Limited',
    category: 'vitamins',
    price: 179,
    mrp: 250,
    rating: 4.3,
    reviews: 621,
    image: productImageFor('vitamins'),
    description: 'Complete daily nutrition',
    uses: ['General wellness', 'Energy boost'],
    benefits: ['All essential vitamins', 'Boosts immunity'],
    sideEffects: 'None',
    directions: 'Take 1 tablet daily',
    storage: 'Store in dry place',
    prescriptionRequired: false,
    stock: 150,
  },
];

// Add more products to reach a decent catalog
for (let i = 7; i <= 50; i++) {
  const brands = ['Cipla', 'Sun Pharma', 'Dr Reddy\'s', 'Abbott', 'Himalaya', 'Dabur', 'Baidyanath', 'Zydus', 'Alkem', 'Mankind'];
  const productTemplate = generatedCatalog[(i - 7) % generatedCatalog.length];
  const price = ((i * 137) % 1950) + 75;
  const mrp = price + ((i * 43) % 650) + 80;
  
  dummyProducts.push({
    id: i,
    name: `${productTemplate.name} ${Math.ceil((i - 6) / generatedCatalog.length)}`,
    brand: productTemplate.brand || brands[i % brands.length],
    manufacturer: `${productTemplate.brand || brands[i % brands.length]} Healthcare`,
    category: productTemplate.category,
    price,
    mrp,
    rating: (3.8 + ((i * 7) % 12) / 10).toFixed(1),
    reviews: ((i * 83) % 950) + 35,
    image: productImageFor(productTemplate.category),
    description: productTemplate.description,
    uses: ['Health', 'Wellness'],
    benefits: ['Quality assured', 'Trusted brand'],
    sideEffects: 'None',
    directions: 'Follow the instructions provided',
    storage: 'Store in cool, dry place',
    prescriptionRequired: i % 9 === 0,
    stock: ((i * 17) % 190) + 10,
  });
}

dummyProducts.forEach((product) => {
  product.image = productImageFor(product.category);
  product.images = productImagesFor(product.category);
  product.ingredients = ingredientsFor(product.category);
  product.longDescription = `${product.description}. This product is sourced from trusted healthcare partners and packed for safe home delivery. Check directions, storage, and prescription requirements before use.`;
});

// Dummy Categories
export const dummyCategories = [
  { id: 1, name: 'Medicines', slug: 'medicines' },
  { id: 2, name: 'Healthcare', slug: 'healthcare' },
  { id: 3, name: 'Diabetes Care', slug: 'diabetes-care' },
  { id: 4, name: 'Heart Care', slug: 'heart-care' },
  { id: 5, name: 'Women Care', slug: 'women-care' },
  { id: 6, name: 'Men Care', slug: 'men-care' },
  { id: 7, name: 'Baby Care', slug: 'baby-care' },
  { id: 8, name: 'Elder Care', slug: 'elder-care' },
  { id: 9, name: 'Skin Care', slug: 'skin-care' },
  { id: 10, name: 'Hair Care', slug: 'hair-care' },
  { id: 11, name: 'Vitamins', slug: 'vitamins' },
  { id: 12, name: 'Supplements', slug: 'supplements' },
  { id: 13, name: 'Ayurveda', slug: 'ayurveda' },
  { id: 14, name: 'Personal Care', slug: 'personal-care' },
  { id: 15, name: 'Medical Devices', slug: 'medical-devices' },
].map((category) => ({
  ...category,
  ...getCategoryVisual(category.slug),
}));

// Dummy Brands
export const dummyBrands = [
  { id: 1, name: 'Cipla', logo: '🏥' },
  { id: 2, name: 'Sun Pharma', logo: '🌞' },
  { id: 3, name: 'Dr Reddy\'s', logo: '🔴' },
  { id: 4, name: 'Abbott', logo: 'A' },
  { id: 5, name: 'Mankind', logo: 'M' },
  { id: 6, name: 'Himalaya', logo: '⛰️' },
  { id: 7, name: 'Dabur', logo: 'D' },
  { id: 8, name: 'Baidyanath', logo: 'B' },
  { id: 9, name: 'Zydus', logo: 'Z' },
  { id: 10, name: 'Alkem', logo: 'A' },
];

// Dummy Users
export const dummyUsers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    mobile: '9876543210',
    password: 'password123',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    mobile: '9876543211',
    password: 'password123',
  },
];

// Dummy Orders
export const dummyOrders = [
  {
    id: 1,
    userId: 1,
    orderNumber: 'ORD1704067200000123',
    items: [
      { id: 1, name: 'Aspirin 500mg', price: 45, quantity: 2 },
      { id: 2, name: 'Vitamin D3 1000 IU', price: 299, quantity: 1 },
    ],
    totalAmount: 389,
    status: 'Delivered',
    deliveryAddress: '123 Main St, Mumbai, MH 400001',
    createdAt: '2024-01-01',
    deliveredAt: '2024-01-03',
  },
  {
    id: 2,
    userId: 1,
    orderNumber: 'ORD1704153600000456',
    items: [
      { id: 3, name: 'Cough Syrup', price: 120, quantity: 1 },
    ],
    totalAmount: 120,
    status: 'Processing',
    deliveryAddress: '123 Main St, Mumbai, MH 400001',
    createdAt: '2024-01-02',
    deliveredAt: null,
  },
];

// Dummy Prescriptions
export const dummyPrescriptions = [
  {
    id: 1,
    userId: 1,
    fileName: 'prescription_1.pdf',
    fileType: 'application/pdf',
    uploadedAt: '2024-01-01',
    status: 'Approved',
  },
];

// Dummy Reviews
export const dummyReviews = [
  {
    id: 1,
    productId: 1,
    userId: 1,
    rating: 5,
    title: 'Excellent Medicine',
    content: 'Very effective and fast acting. Highly recommended.',
    helpfulCount: 45,
  },
  {
    id: 2,
    productId: 1,
    userId: 2,
    rating: 4,
    title: 'Good Quality',
    content: 'Works well. Good value for money.',
    helpfulCount: 23,
  },
];

// Dummy Blogs
export const dummyBlogs = [
  {
    id: 1,
    title: 'Managing Diabetes in Daily Life',
    slug: 'managing-diabetes-daily-life',
    category: 'Diabetes',
    image: productImageFor('diabetes-care'),
    excerpt: 'Learn practical tips and strategies for managing diabetes effectively in your daily routine.',
    content: `
      Diabetes management requires a comprehensive approach combining diet, exercise, medication, and regular monitoring.
      Here are key strategies that can help you manage diabetes effectively:
      
      1. **Regular Blood Sugar Monitoring**: Check your blood sugar levels as recommended by your doctor.
      2. **Balanced Diet**: Include whole grains, vegetables, and lean proteins in your diet.
      3. **Regular Exercise**: Aim for 150 minutes of moderate physical activity weekly.
      4. **Medication Compliance**: Take your prescribed medications on time.
      5. **Stress Management**: Practice yoga and meditation to reduce stress.
      
      Remember, every individual's diabetes management plan is unique. Consult with your healthcare provider for a personalized approach.
    `,
    author: 'Dr. Amit Patel',
    publishedAt: '2024-01-01',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Heart Health: Prevention is Better Than Cure',
    slug: 'heart-health-prevention',
    category: 'Heart Health',
    image: productImageFor('heart-care'),
    excerpt: 'Discover essential tips to maintain heart health and prevent cardiovascular diseases.',
    content: `
      Heart disease is one of the leading causes of death. Prevention starts with understanding the risk factors.
      Here are scientifically proven ways to keep your heart healthy:
      
      1. **Regular Checkups**: Monitor your blood pressure and cholesterol levels regularly.
      2. **Healthy Diet**: Reduce salt and saturated fat intake.
      3. **Physical Activity**: Exercise regularly to strengthen your heart.
      4. **Quit Smoking**: Smoking damages blood vessels.
      5. **Manage Stress**: Chronic stress affects heart health.
      
      Consult a cardiologist for personalized advice based on your health profile.
    `,
    author: 'Dr. Sanjay Sharma',
    publishedAt: '2024-01-02',
    readTime: '6 min read',
  },
];

// Dummy Coupons
export const dummyCoupons = [
  {
    id: 1,
    code: 'WELCOME20',
    discount: 20,
    type: 'percentage',
    minAmount: 500,
    maxDiscount: 200,
    validTill: '2024-12-31',
  },
  {
    id: 2,
    code: 'FIRST50',
    discount: 50,
    type: 'fixed',
    minAmount: 200,
    maxDiscount: 50,
    validTill: '2024-12-31',
  },
];

// Dummy Addresses
export const dummyAddresses = [
  {
    id: 1,
    fullName: 'Rajesh Kumar',
    mobile: '9876543210',
    houseNumber: '123',
    area: 'Bandra',
    landmark: 'Near Market',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isDefault: true,
  },
];

// Dummy FAQ
export const dummyFAQs = [
  {
    id: 1,
    question: 'How do I place an order?',
    answer: 'Simply browse products, add them to cart, and proceed to checkout. Fill in your delivery address and payment details to complete the order.',
  },
  {
    id: 2,
    question: 'Do I need a prescription for all medicines?',
    answer: 'No, only schedule H and H1 medicines as per government regulations. We clearly mark products requiring prescriptions.',
  },
  {
    id: 3,
    question: 'What is your delivery time?',
    answer: 'We offer 1-2 days delivery in major cities and 5-7 days in other areas. Check during checkout for your exact delivery time.',
  },
  {
    id: 4,
    question: 'Is my payment secure?',
    answer: 'Yes, we use industry-standard SSL encryption and partner with trusted payment gateways for secure transactions.',
  },
  {
    id: 5,
    question: 'Can I return a product?',
    answer: 'Medicines cannot be returned due to safety reasons. For other products, we offer 7-day returns if unused and in original packaging.',
  },
];
