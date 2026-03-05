import { useOutletContext } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { paymentApi } from '../features/payments/api/paymentApi';

interface AuthContextType {
  session: Session;
}

const Dashboard = () => {
  const { session } = useOutletContext<AuthContextType>();

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
      alert('Не удалось создать платеж');
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Привет, {session.user.email}!</h1>
      <p className="mt-2 text-gray-600">Это защищенная страница.</p>

      <div className="mt-8 border p-6 rounded-xl shadow-sm max-w-sm">
        <h2 className="text-xl font-semibold">Pro Plan</h2>
        <p className="text-3xl font-bold mt-2">$20 <span className="text-sm font-normal">/ навсегда</span></p>
        <button
          onClick={handleSubscribe}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Купить Pro
        </button>
      </div>
    </div>
  );
};

export default Dashboard;