import { useNavigate } from 'react-router-dom';
import {  AlertCircle, ArrowRight  } from '@/components/ui/icons';
import { paths } from '../../config/paths';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6 text-xs md:text-sm">
      <AlertCircle className="w-12 h-12 text-accent animate-pulse" />
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-heading font-black text-primary dark:text-white m-0">404 — Page Not Found</h1>
        <p className="text-gray-500 font-light leading-relaxed">
          The coordinate page you are searching for does not exist or has been relocated within our database archive.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => navigate('/')}
          className="btn-primary border-none cursor-pointer text-xs"
        >
          Go Back Home
        </button>
        <button
          onClick={() => navigate(paths.customer.men)}
          className="btn-secondary border-none cursor-pointer text-xs"
        >
          Shop Collection <ArrowRight className="w-3.5 h-3.5 text-primary" />
        </button>
      </div>
    </div>
  );
}
