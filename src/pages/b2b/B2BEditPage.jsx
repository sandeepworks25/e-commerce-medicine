import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BusinessForm from '../../components/b2b/BusinessForm';
import { useToast } from '../../components/common/Toast';
import { getBusinessById, updateBusiness } from '../../redux/businessSlice';
import { useAuthStore } from '../../store/index.js';

const B2BEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user, attachBusinessProfile } = useAuthStore();
  const business = useSelector((state) => getBusinessById(state, id));

  const handleSubmit = (values) => {
    const updatedBusiness = { ...business, ...values };
    dispatch(updateBusiness(updatedBusiness));
    if (user?.businessProfile?.id === business.id) {
      attachBusinessProfile(updatedBusiness);
    }
    addToast('Business updated successfully.', 'success');
    navigate('/b2b');
  };

  if (!business) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-950">Business record not found</h1>
        <Link to="/b2b" className="btn-primary mt-5 inline-flex">Back to B2B</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-6 dark:bg-slate-950 md:py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-5">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">{business.id}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Edit Business</h1>
        </div>
        <BusinessForm initialValues={business} onSubmit={handleSubmit} submitLabel="Update Business" onCancel={() => navigate('/b2b')} />
      </div>
    </div>
  );
};

export default B2BEditPage;
