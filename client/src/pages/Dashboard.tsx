import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { paymentApi } from '../features/payments/api/paymentApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface AuthContextType {
  session: Session;
}

const Dashboard = () => {
  const { session } = useOutletContext<AuthContextType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Оплата прошла успешно! Теперь у вас Pro аккаунт.');
      setIsPro(true);
      searchParams.delete('success');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSubscribe = async () => {
    try {
      const response = await paymentApi.createCheckoutSession(
        session.user.email || '',
        session.user.id
      );

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Не удалось создать платеж');
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Привет, {session.user.email}!</h1>
      <p className="mt-2 text-gray-600">Это защищенная страница.</p>

      <div className="mt-8 border p-6 rounded-xl shadow-sm max-w-sm">
        <h2 className="text-xl font-semibold">Pro Plan</h2>
        <p className="text-3xl font-bold mt-2">$0 <span className="text-sm font-normal">/ навсегда</span></p>
        {isPro ? (
          <button
            disabled
            className="mt-4 w-full bg-gray-400 text-white py-2 rounded-md cursor-not-allowed"
          >
            Уже куплено
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Купить Pro
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;