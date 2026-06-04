import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useOrdersStore, usePrescriptionsStore, usePreferencesStore } from '../store/index.js';
import { getInitials } from '../utils/helpers.js';
import {
  Bell,
  ChevronRight,
  CreditCard,
  Gift,
  Heart,
  MapPin,
  PackageCheck,
  Power,
  Star,
  UserRound,
  WalletCards,
} from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { orders } = useOrdersStore();
  const { prescriptions } = usePrescriptionsStore();
  const { savedAddresses } = usePreferencesStore();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [firstName = '', ...restName] = (user.name || 'MediCart User').split(' ');
  const lastName = restName.join(' ');
  const avatarImage = user?.image || user?.avatar;

  const menuGroups = [
    {
      title: 'My Orders',
      icon: PackageCheck,
      items: [{ id: 'orders', label: 'Orders', count: orders.length }],
      standalone: true,
    },
    {
      title: 'Account Settings',
      icon: UserRound,
      items: [
        { id: 'profile', label: 'Profile Information' },
        { id: 'addresses', label: 'Manage Addresses', count: savedAddresses.length },
        { id: 'prescriptions', label: 'Prescription Information', count: prescriptions.length },
      ],
    },
    {
      title: 'Payments',
      icon: WalletCards,
      items: [
        { id: 'gift-cards', label: 'Gift Cards', meta: '₹0' },
        { id: 'upi', label: 'Saved UPI' },
        { id: 'cards', label: 'Saved Cards' },
      ],
    },
    {
      title: 'My Stuff',
      icon: CreditCard,
      items: [
        { id: 'coupons', label: 'My Coupons' },
        { id: 'reviews', label: 'My Reviews & Ratings' },
        { id: 'notifications', label: 'All Notifications' },
        { id: 'wishlist', label: 'My Wishlist' },
      ],
    },
  ];

  const renderContent = () => {
    if (activeTab === 'orders') {
      return (
        <div>
          <h2 className="mb-6 text-xl font-bold text-slate-950">My Orders</h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-slate-200 bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">{order.orderNumber}</p>
                      <p className="mt-1 text-sm text-slate-500">{order.createdAt}</p>
                      <p className="mt-2 text-sm text-slate-700">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No orders yet.</p>
          )}
        </div>
      );
    }

    if (activeTab === 'addresses') {
      return (
        <div>
          <h2 className="mb-6 text-xl font-bold text-slate-950">Manage Addresses</h2>
          {savedAddresses.length > 0 ? (
            <div className="space-y-4">
              {savedAddresses.map(address => (
                <div key={address.id} className="border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin size={18} className="text-blue-600" />
                    <p className="font-semibold text-slate-950">{address.fullName}</p>
                  </div>
                  <p className="text-sm leading-6 text-slate-700">
                    {address.houseNumber}, {address.area}, {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{address.mobile}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No saved addresses yet.</p>
          )}
        </div>
      );
    }

    if (activeTab === 'prescriptions') {
      return (
        <div>
          <h2 className="mb-6 text-xl font-bold text-slate-950">Prescription Information</h2>
          {prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions.map(prescription => (
                <div key={prescription.id} className="border border-slate-200 bg-white p-4">
                  <p className="font-semibold text-slate-950">{prescription.fileName}</p>
                  <p className="mt-1 text-sm text-slate-500">{prescription.uploadedAt}</p>
                  <p className="mt-2 text-sm font-semibold text-blue-600">{prescription.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No prescriptions uploaded yet.</p>
          )}
        </div>
      );
    }

    return (
      <div>
        <section>
          <div className="mb-7 flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-950">Personal Information</h2>
            <button className="text-sm font-semibold text-blue-600">Edit</button>
          </div>
          <div className="grid max-w-xl gap-3 sm:grid-cols-2">
            <input value={firstName} readOnly className="h-12 border border-slate-300 bg-slate-50 px-4 text-sm text-slate-500 outline-none" />
            <input value={lastName || ' '} readOnly className="h-12 border border-slate-300 bg-slate-50 px-4 text-sm text-slate-500 outline-none" />
          </div>
          <div className="mt-7">
            <p className="mb-4 text-sm font-semibold text-slate-950">Your Gender</p>
            <div className="flex gap-8 text-slate-500">
              <label className="inline-flex items-center gap-3">
                <input type="radio" name="gender" className="h-4 w-4 accent-blue-600" />
                Male
              </label>
              <label className="inline-flex items-center gap-3">
                <input type="radio" name="gender" className="h-4 w-4 accent-blue-600" />
                Female
              </label>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-7 flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-950">Email Address</h2>
            <button className="text-sm font-semibold text-blue-600">Edit</button>
          </div>
          <input value={user.email || ''} readOnly className="h-12 w-full max-w-xs border border-slate-300 bg-slate-50 px-4 text-sm text-slate-500 outline-none" />
        </section>

        <section className="mt-14">
          <div className="mb-7 flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-950">Mobile Number</h2>
            <button className="text-sm font-semibold text-blue-600">Edit</button>
          </div>
          <input value={user.mobile ? `+91${user.mobile}` : ''} readOnly className="h-12 w-full max-w-xs border border-slate-300 bg-slate-50 px-4 text-sm text-slate-500 outline-none" />
        </section>

        <section className="mt-14 max-w-4xl">
          <h2 className="mb-7 text-xl font-bold text-slate-950">FAQs</h2>
          {[
            ['What happens when I update my email address (or mobile number)?', 'Your login email id (or mobile number) changes, likewise. You will receive all your account related communication on your updated email address (or mobile number).'],
            ['When will my MediCart account be updated with the new email address (or mobile number)?', 'It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.'],
            ['What happens to my existing account when I update my email address (or mobile number)?', 'Updating your email address or mobile number does not invalidate your account. Your order history, saved information and personal details remain available.'],
            ['Does my seller account get affected when I update my email address?', 'MediCart uses a single account policy. Any changes will reflect in linked services as well.'],
          ].map(([question, answer]) => (
            <div key={question} className="mb-6">
              <h3 className="text-sm font-bold text-slate-950">{question}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-800">{answer}</p>
            </div>
          ))}
          <button className="mt-5 block text-sm font-bold text-blue-600">Deactivate Account</button>
          <button className="mt-7 block text-sm font-bold text-pink-600">Delete Account</button>
        </section>

        <div className="relative -mx-8 mt-10 h-28 overflow-hidden bg-yellow-300">
          <div className="absolute bottom-0 left-0 h-10 w-full bg-yellow-400" />
          <div className="absolute bottom-0 left-24 h-8 w-[60%] rounded-t-[50%] bg-orange-300/60" />
          <div className="absolute right-28 top-5 h-0 w-0 rotate-45 border-b-[30px] border-l-[48px] border-t-[30px] border-b-transparent border-l-yellow-500 border-t-transparent" />
          <span className="absolute bottom-8 left-10 h-8 w-2 rounded-full bg-green-500" />
          <span className="absolute bottom-12 left-12 h-4 w-4 rounded-full bg-red-500" />
          <span className="absolute bottom-8 right-7 h-8 w-2 rounded-full bg-green-500" />
          <span className="absolute bottom-12 right-5 h-4 w-4 rounded-full bg-red-500" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-3">
      <div className="mx-auto grid max-w-6xl gap-4 px-3 md:grid-cols-[292px_1fr]">
        <aside className="space-y-4">
          <div className="flex items-center gap-4 bg-white p-4 shadow-sm">
            {avatarImage ? (
              <img src={avatarImage} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-full bg-yellow-300 text-sm font-bold text-blue-600">
                {getInitials(user.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-xs text-slate-900">Hello,</p>
              <p className="truncate font-bold text-slate-950">{user.name}</p>
            </div>
          </div>

          <div className="bg-white shadow-sm">
            {menuGroups.map(group => {
              const GroupIcon = group.icon;
              if (group.standalone) {
                return (
                  <button
                    key={group.title}
                    onClick={() => setActiveTab('orders')}
                    className="flex w-full items-center gap-5 border-b border-slate-100 px-6 py-5 text-left text-base font-bold uppercase text-slate-500 hover:bg-slate-50"
                  >
                    <GroupIcon size={22} className="text-blue-600" />
                    <span className="flex-1">{group.title}</span>
                    <ChevronRight size={21} />
                  </button>
                );
              }

              return (
                <div key={group.title} className="border-b border-slate-100 py-4">
                  <div className="mb-3 flex items-center gap-5 px-6 text-base font-bold uppercase text-slate-500">
                    <GroupIcon size={22} className="text-blue-600" />
                    <span>{group.title}</span>
                  </div>
                  <div className="grid">
                    {group.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center justify-between px-[66px] py-3 text-left text-sm ${
                          activeTab === item.id ? 'bg-blue-50 font-bold text-blue-600' : 'text-slate-950 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.meta && <span className="text-sm font-bold text-green-600">{item.meta}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <button onClick={handleLogout} className="flex w-full items-center gap-5 px-6 py-5 text-left text-base font-bold text-slate-500 hover:bg-slate-50">
              <Power size={23} className="text-blue-600" />
              Logout
            </button>
          </div>

          <div className="bg-white p-4 text-xs shadow-sm">
            <p className="mb-3 font-bold text-slate-950">Frequently Visited:</p>
            <div className="flex gap-4 text-slate-500">
              <Link to="/track-order" className="hover:text-blue-600">Track Order</Link>
              <Link to="/faq" className="hover:text-blue-600">Help Center</Link>
            </div>
          </div>
        </aside>

        <main className="min-h-[760px] bg-white px-8 py-7 shadow-sm">
          {['gift-cards', 'upi', 'cards', 'coupons', 'reviews', 'notifications', 'wishlist'].includes(activeTab) ? (
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-950">
                {menuGroups.flatMap(group => group.items).find(item => item.id === activeTab)?.label}
              </h2>
              <div className="flex min-h-72 flex-col items-center justify-center text-center">
                {activeTab === 'wishlist' ? <Heart className="mb-4 text-blue-600" size={44} /> : activeTab === 'reviews' ? <Star className="mb-4 text-blue-600" size={44} /> : activeTab === 'notifications' ? <Bell className="mb-4 text-blue-600" size={44} /> : <Gift className="mb-4 text-blue-600" size={44} />}
                <p className="font-semibold text-slate-950">Nothing to show here yet.</p>
                <p className="mt-2 text-sm text-slate-500">Your account activity will appear here.</p>
              </div>
            </div>
          ) : renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Account;
