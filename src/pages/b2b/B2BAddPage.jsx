import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BusinessForm from '../../components/b2b/BusinessForm';
import { useToast } from '../../components/common/Toast';
import { addBusiness } from '../../redux/businessSlice';

const B2BAddPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = (business) => {
    dispatch(addBusiness(business));
    addToast('Business added successfully.', 'success');
    navigate('/b2b');
  };

  return (
    <div className="bg-slate-50 py-6 dark:bg-slate-950 md:py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-5">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">B2B Business</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Business Registration Form</h1>
        </div>
        <BusinessForm onSubmit={handleSubmit} submitLabel="Create Business" onCancel={() => navigate('/b2b')} />
      </div>
    </div>
  );
};

export default B2BAddPage;
