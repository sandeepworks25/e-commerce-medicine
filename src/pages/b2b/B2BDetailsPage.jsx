import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import BusinessDetails from '../../components/b2b/BusinessDetails';
import { getBusinessById } from '../../redux/businessSlice';

const B2BDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const business = useSelector((state) => getBusinessById(state, id));

  return (
    <div className="bg-slate-50 py-6 dark:bg-slate-950 md:py-8">
      <div className="mx-auto max-w-7xl space-y-5 px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => navigate('/b2b')} className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300">
            <ArrowLeft size={18} />
            Back to B2B
          </button>
          {business && (
            <Link to={`/b2b/edit/${business.id}`} className="btn-primary inline-flex h-11 items-center justify-center gap-2">
              <Pencil size={17} />
              Edit Business
            </Link>
          )}
        </div>
        <BusinessDetails business={business} />
      </div>
    </div>
  );
};

export default B2BDetailsPage;
