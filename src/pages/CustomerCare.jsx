import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Copy, FileText, Headphones, LockKeyhole, Mail, MapPin, MessageCircle, PackageCheck, Phone, Search, Send, ShieldCheck, Truck, UserPlus } from 'lucide-react';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal.jsx';
import { useAuthStore } from '../store/index.js';

const helpTopics = [
  { title: 'Order status', desc: 'Track delivery, returns, and replacement updates.', icon: PackageCheck },
  { title: 'Delivery help', desc: 'Fix address, delayed delivery, or location issues.', icon: Truck },
  { title: 'Prescription support', desc: 'Upload, verify, or update prescription details.', icon: FileText },
  { title: 'Payments & refunds', desc: 'Check payment failures, wallet, and refund status.', icon: ShieldCheck },
];

const commonIssues = [
  {
    title: 'I want to track my medicine order',
    topic: 'Order status',
    answer: 'Open Track Order to see dispatch, shipping, and delivery updates for every active order.',
    action: { label: 'Track order', path: '/track-order' },
  },
  {
    title: 'I need help with delivery address',
    topic: 'Delivery help',
    answer: 'Use the location button or checkout address form to pin your current address before placing the order.',
    action: { label: 'Go to checkout', path: '/checkout' },
  },
  {
    title: 'I have not received my refund',
    topic: 'Payments & refunds',
    answer: 'Refunds are processed to the original payment method. If the order is cancelled or returned, check order details for the refund timeline.',
    action: { label: 'View orders', path: '/account' },
  },
  {
    title: 'I want to upload a prescription',
    topic: 'Prescription support',
    answer: 'Upload a clear prescription image or PDF. Our team reviews it before prescription-only medicines are dispatched.',
    action: { label: 'Upload prescription', path: '/upload-prescription' },
  },
  {
    title: 'I received a damaged or wrong product',
    topic: 'Order status',
    answer: 'Start a support chat with your order number and product photo. We will review replacement or refund eligibility.',
    action: { label: 'Start chat', chat: true },
  },
];

const CustomerCare = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isLoggedIn } = useAuthStore();
  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('Order status');
  const [expandedIssue, setExpandedIssue] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { id: 1, from: 'care', text: 'Hi, I am here to help with orders, delivery, prescriptions, and refunds.' },
  ]);
  const [location, setLocation] = useState('Not selected');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const visibleIssues = useMemo(() => {
    const search = query.trim().toLowerCase();
    return commonIssues.filter(issue => {
      const matchesTopic = issue.topic === activeTopic;
      const matchesSearch = !search || `${issue.title} ${issue.answer} ${issue.topic}`.toLowerCase().includes(search);
      return matchesTopic && matchesSearch;
    });
  }, [activeTopic, query]);

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(`${label} copied`, 'success');
    } catch {
      addToast(`Unable to copy ${label.toLowerCase()}`, 'error');
    }
  };

  const handleLocation = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    if (!navigator.geolocation) {
      addToast('Location is not supported in this browser', 'error');
      return;
    }

    setLocation('Detecting...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextLocation = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
        setLocation(nextLocation);
        addToast('Service location updated', 'success');
      },
      () => {
        setLocation('Permission needed');
        addToast('Allow location access to update service location', 'warning');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const sendChatMessage = (event) => {
    event.preventDefault();
    const message = chatMessage.trim();
    if (!message) return;

    setChatLog(prev => [
      ...prev,
      { id: Date.now(), from: 'you', text: message },
      { id: Date.now() + 1, from: 'care', text: 'Thanks. A support specialist will review this and respond shortly.' },
    ]);
    setChatMessage('');
    setChatOpen(true);
  };

  const goToAuth = (path) => {
    setShowLoginPrompt(false);
    navigate(`${path}?redirect=${encodeURIComponent('/customer-care')}`);
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <section className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-teal-700">MediCare Help Center</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">24x7 Customer Care</h1>
              <p className="mt-2 text-sm text-slate-600">Get quick help with orders, medicines, prescriptions, payments, and delivery.</p>
            </div>
            <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-50 text-teal-700">
              <Headphones size={42} />
            </div>
          </div>

          <div className="relative mt-8 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for order, refund, prescription, delivery..."
              className="h-12 w-full border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[1fr_320px]">
        <main className="space-y-5">
          <section className="bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-950">What can we help you with?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {helpTopics.map(topic => (
                <button
                  key={topic.title}
                  type="button"
                  onClick={() => {
                    setActiveTopic(topic.title);
                    setExpandedIssue(0);
                  }}
                  className={`flex items-center gap-4 border p-4 text-left transition ${
                    activeTopic === topic.title ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-teal-700">
                    <topic.icon size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-slate-950">{topic.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-slate-500">{topic.desc}</span>
                  </span>
                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-950">{activeTopic}</h2>
            {visibleIssues.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-100">
                {visibleIssues.map((issue, index) => (
                  <div key={issue.title}>
                    <button
                      type="button"
                      onClick={() => setExpandedIssue(expandedIssue === index ? -1 : index)}
                      className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      {issue.title}
                      <ChevronDown size={18} className={`text-slate-400 transition ${expandedIssue === index ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedIssue === index && (
                      <div className="border-t border-slate-100 bg-slate-50 px-4 py-4">
                        <p className="text-sm leading-6 text-slate-600">{issue.answer}</p>
                        {issue.action.chat ? (
                          <button onClick={() => setChatOpen(true)} className="mt-3 text-sm font-bold text-teal-700 hover:underline">
                            {issue.action.label}
                          </button>
                        ) : (
                          <Link to={issue.action.path} className="mt-3 inline-flex text-sm font-bold text-teal-700 hover:underline">
                            {issue.action.label}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="font-semibold text-slate-950">No matching help article found.</p>
                <button onClick={() => setChatOpen(true)} className="mt-3 text-sm font-bold text-teal-700 hover:underline">
                  Start live chat
                </button>
              </div>
            )}
          </section>

          <section className="bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-950">Need help with recent activity?</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/track-order" className="flex-1 border border-slate-200 p-4 hover:bg-teal-50">
                <PackageCheck className="mb-3 text-teal-700" size={24} />
                <p className="font-bold text-slate-950">Track an order</p>
                <p className="mt-1 text-sm text-slate-500">View latest delivery and order updates.</p>
              </Link>
              <Link to="/upload-prescription" className="flex-1 border border-slate-200 p-4 hover:bg-teal-50">
                <FileText className="mb-3 text-teal-700" size={24} />
                <p className="font-bold text-slate-950">Prescription help</p>
                <p className="mt-1 text-sm text-slate-500">Upload or review prescription status.</p>
              </Link>
            </div>
          </section>
        </main>

        <aside className="space-y-5">
          <div className="bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Contact support</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <a href="tel:+911234567890" className="flex flex-1 items-center gap-3 border border-slate-200 p-3 text-sm font-semibold text-slate-800 hover:bg-teal-50">
                  <Phone size={18} className="text-teal-700" />
                  +91-1234-567890
                </a>
                <button onClick={() => handleCopy('+91-1234-567890', 'Phone number')} className="grid h-12 w-12 place-items-center border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Copy phone number">
                  <Copy size={17} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <a href="mailto:support@medicare.com" className="flex flex-1 items-center gap-3 border border-slate-200 p-3 text-sm font-semibold text-slate-800 hover:bg-teal-50">
                  <Mail size={18} className="text-teal-700" />
                  support@medicare.com
                </a>
                <button onClick={() => handleCopy('support@medicare.com', 'Email address')} className="grid h-12 w-12 place-items-center border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Copy email address">
                  <Copy size={17} />
                </button>
              </div>
              <button onClick={() => setChatOpen(true)} className="flex w-full items-center gap-3 border border-slate-200 p-3 text-left text-sm font-semibold text-slate-800 hover:bg-teal-50">
                <MessageCircle size={18} className="text-teal-700" />
                Start live chat
              </button>
            </div>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Service location</h2>
            <div className="mt-4 flex items-start gap-3 text-sm text-slate-600">
              <MapPin size={20} className="mt-0.5 shrink-0 text-teal-700" />
              <p>{location}</p>
            </div>
            <button onClick={handleLocation} className="mt-4 w-full border border-teal-700 px-4 py-2 text-sm font-bold text-teal-700 hover:bg-teal-50">
              Use current location
            </button>
          </div>
        </aside>
      </div>

      {chatOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-lg bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Headphones size={19} />
              <span className="font-bold">Live chat</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-sm font-bold text-slate-300 hover:text-white">Close</button>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {chatLog.map(message => (
              <div key={message.id} className={`max-w-[82%] rounded-lg px-3 py-2 text-sm ${message.from === 'you' ? 'ml-auto bg-teal-700 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendChatMessage} className="flex gap-2 border-t border-slate-100 p-3">
            <input value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} placeholder="Type your message" className="min-w-0 flex-1 border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600" />
            <button type="submit" className="grid h-10 w-10 place-items-center bg-teal-700 text-white hover:bg-teal-800" aria-label="Send chat message">
              <Send size={17} />
            </button>
          </form>
        </div>
      )}

      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="Login to add current location"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-teal-50 text-teal-700">
            <LockKeyhole size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-950">Please login first</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Login to save and use your current service location.
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
    </div>
  );
};

export default CustomerCare;
