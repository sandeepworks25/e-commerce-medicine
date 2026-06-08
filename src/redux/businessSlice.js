import { createSlice, nanoid } from '@reduxjs/toolkit';

export const BUSINESS_TYPES = [
  'Distributor',
  'Dealer',
  'Wholesaler',
  'Retailer',
  'Manufacturer',
  'Service Provider',
];

export const BUSINESS_STATUSES = ['Active', 'Inactive', 'Pending Approval'];

export const EMPTY_BUSINESS = {
  businessName: '',
  businessAddress: '',
  city: '',
  pincode: '',
  state: '',
  aadhaarNumber: '',
  drivingLicenseNumber: '',
  registrationNumber: '',
  contactPersonName: '',
  mobileNumber: '',
  alternateMobileNumber: '',
  emailAddress: '',
  businessType: 'Distributor',
  gstNumber: '',
  panNumber: '',
  websiteUrl: '',
  status: 'Pending Approval',
};

const today = new Date().toISOString();

export const sampleBusinesses = [
  ['B2B-1001', 'ABC Traders', 'Anil Batra', '9876543210', 'Ahmedabad', 'Gujarat', 'Distributor', 'Active'],
  ['B2B-1002', 'Sharma Distributors', 'Neha Sharma', '9123456780', 'Jaipur', 'Rajasthan', 'Distributor', 'Active'],
  ['B2B-1003', 'Gupta Wholesalers', 'Ravi Gupta', '9988776655', 'Lucknow', 'Uttar Pradesh', 'Wholesaler', 'Pending Approval'],
  ['B2B-1004', 'Tech Solutions Pvt Ltd', 'Meera Rao', '9012345678', 'Bengaluru', 'Karnataka', 'Service Provider', 'Active'],
  ['B2B-1005', 'Verma Enterprises', 'Sanjay Verma', '9345678123', 'Indore', 'Madhya Pradesh', 'Dealer', 'Inactive'],
  ['B2B-1006', 'HealthKart Retail', 'Priya Nair', '9567890123', 'Kochi', 'Kerala', 'Retailer', 'Active'],
  ['B2B-1007', 'Medline Dealers', 'Arjun Singh', '9456123780', 'Chandigarh', 'Punjab', 'Dealer', 'Pending Approval'],
  ['B2B-1008', 'CareWell Pharma', 'Kavita Joshi', '9898989898', 'Pune', 'Maharashtra', 'Manufacturer', 'Active'],
  ['B2B-1009', 'Prime Medical Supply', 'Imran Khan', '9090909090', 'Hyderabad', 'Telangana', 'Wholesaler', 'Active'],
  ['B2B-1010', 'Swasthya Retailers', 'Ritika Das', '9191919191', 'Kolkata', 'West Bengal', 'Retailer', 'Inactive'],
  ['B2B-1011', 'Nova Healthcare', 'Nitin Malhotra', '9292929292', 'Delhi', 'Delhi', 'Manufacturer', 'Active'],
  ['B2B-1012', 'Bharat Pharma Hub', 'Asha Iyer', '9393939393', 'Chennai', 'Tamil Nadu', 'Distributor', 'Pending Approval'],
  ['B2B-1013', 'Apex Surgical Mart', 'Kunal Shah', '9494949494', 'Surat', 'Gujarat', 'Dealer', 'Active'],
  ['B2B-1014', 'Metro Wellness LLP', 'Divya Menon', '9595959595', 'Mumbai', 'Maharashtra', 'Service Provider', 'Inactive'],
  ['B2B-1015', 'CurePoint Wholesale', 'Harish Patel', '9696969696', 'Vadodara', 'Gujarat', 'Wholesaler', 'Active'],
  ['B2B-1016', 'LifeCare Manufacturing', 'Pooja Sethi', '9797979797', 'Noida', 'Uttar Pradesh', 'Manufacturer', 'Pending Approval'],
  ['B2B-1017', 'Green Cross Retail', 'Sameer Kulkarni', '9887766554', 'Nagpur', 'Maharashtra', 'Retailer', 'Active'],
  ['B2B-1018', 'Zenith Medicals', 'Rohit Jain', '9776655443', 'Bhopal', 'Madhya Pradesh', 'Dealer', 'Inactive'],
  ['B2B-1019', 'MediBridge Services', 'Farah Ali', '9665544332', 'Gurugram', 'Haryana', 'Service Provider', 'Active'],
  ['B2B-1020', 'Om Sai Distributors', 'Vikas Yadav', '9554433221', 'Patna', 'Bihar', 'Distributor', 'Pending Approval'],
].map((item, index) => {
  const [id, businessName, contactPersonName, mobileNumber, city, state, businessType, status] = item;
  const sequence = String(index + 1).padStart(2, '0');

  return {
    id,
    businessName,
    businessAddress: `${12 + index}, Medical Market Road, ${city}`,
    city,
    pincode: `${380000 + index}`.slice(0, 6),
    state,
    aadhaarNumber: `4000000000${sequence}`.slice(0, 12),
    drivingLicenseNumber: `DL${state.slice(0, 2).toUpperCase()}2026${sequence}`,
    registrationNumber: `REG-2026-${sequence}`,
    contactPersonName,
    mobileNumber,
    alternateMobileNumber: '',
    emailAddress: `${businessName.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/\.$/, '')}@example.com`,
    businessType,
    gstNumber: `27ABCDE${1000 + index}F1Z${index % 9}`,
    panNumber: `ABCDE${1000 + index}F`,
    websiteUrl: index % 3 === 0 ? `https://${businessName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com` : '',
    status,
    createdAt: index < 3 ? today : new Date(Date.now() - (index + 1) * 86400000).toISOString(),
  };
});

const loadBusinesses = () => {
  if (typeof window === 'undefined') return sampleBusinesses;

  try {
    const stored = window.localStorage.getItem('b2b_businesses');
    return stored ? JSON.parse(stored) : sampleBusinesses;
  } catch {
    return sampleBusinesses;
  }
};

const initialState = {
  businesses: loadBusinesses(),
  searchQuery: '',
  filters: {
    state: '',
    city: '',
    businessType: '',
    status: '',
  },
  error: null,
};

const makeBusinessId = (count) => `B2B-${String(1001 + count).padStart(4, '0')}`;

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    addBusiness: {
      reducer: (state, action) => {
        state.businesses.unshift(action.payload);
      },
      prepare: (business) => ({
        payload: {
          ...business,
          id: makeBusinessId(Date.now() % 9000),
          clientId: nanoid(),
          createdAt: new Date().toISOString(),
        },
      }),
    },
    updateBusiness: (state, action) => {
      const index = state.businesses.findIndex((business) => business.id === action.payload.id);
      if (index !== -1) {
        state.businesses[index] = {
          ...state.businesses[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteBusiness: (state, action) => {
      state.businesses = state.businesses.filter((business) => business.id !== action.payload);
    },
    searchBusinesses: (state, action) => {
      state.searchQuery = action.payload;
    },
    filterBusinesses: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetBusinessFilters: (state) => {
      state.searchQuery = '';
      state.filters = initialState.filters;
    },
  },
});

export const {
  addBusiness,
  updateBusiness,
  deleteBusiness,
  searchBusinesses,
  filterBusinesses,
  resetBusinessFilters,
} = businessSlice.actions;

export const getBusinessById = (state, id) =>
  state.business.businesses.find((business) => business.id === id);

export const selectFilteredBusinesses = (state) => {
  const query = state.business.searchQuery.trim().toLowerCase();
  const filters = state.business.filters;

  return state.business.businesses.filter((business) => {
    const matchesQuery = !query ||
      business.businessName.toLowerCase().includes(query) ||
      business.registrationNumber.toLowerCase().includes(query) ||
      business.mobileNumber.includes(query);

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return business[key] === value;
    });

    return matchesQuery && matchesFilters;
  });
};

export const selectBusinessSummary = (state) => {
  const businesses = state.business.businesses;
  const todayKey = new Date().toISOString().slice(0, 10);

  return {
    total: businesses.length,
    active: businesses.filter((business) => business.status === 'Active').length,
    pending: businesses.filter((business) => business.status === 'Pending Approval').length,
    inactive: businesses.filter((business) => business.status === 'Inactive').length,
    today: businesses.filter((business) => business.createdAt?.slice(0, 10) === todayKey).length,
  };
};

export default businessSlice.reducer;
