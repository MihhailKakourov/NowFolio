import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { paymentApi } from '../features/payments/api/paymentApi';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { userApi } from '../features/auth/api/userApi';
import { supabase } from '../supabase';

interface AuthContextType {
  session: Session;
}

const Dashboard = () => {
  const { session } = useOutletContext<AuthContextType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const processedRef = useRef(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const handleStatus = async () => {
      if (!session?.user?.email) return;

      // Если мы вернулись после успешной оплаты Stripe
      if (searchParams.get('success') === 'true' && !processedRef.current) {
        processedRef.current = true;
        // Сразу убираем параметр из URL, чтобы не было повторных срабатываний
        searchParams.delete('success');
        setSearchParams(searchParams, { replace: true });

        const upgradeSuccess = await userApi.upgradeToPro(session.user.email);
        if (upgradeSuccess) {
          toast.success('Оплата прошла успешно! Теперь у вас Pro аккаунт.');
          setIsPro(true);
        } else {
          toast.error('Произошла ошибка при обновлении статуса аккаунта. Пожалуйста, обратитесь в поддержку.');
        }
        return;
      }

      // Иначе просто проверяем текущий статус (сохраняется при перезаходе)
      const currentProStatus = await userApi.getProStatus(session.user.email);
      setIsPro(currentProStatus);
    };

    handleStatus();
  }, [session, searchParams, setSearchParams]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const displayName = session.user.user_metadata?.username || session.user.email;

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gruvbox-orangeLight">Привет, {displayName}!</h1>
          <p className="mt-3 text-lg text-gruvbox-fg4">Добро пожаловать в панель управления. Это защищенная страница.</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gruvbox-bg2 text-gruvbox-fg4 font-bold py-2 px-6 rounded-lg hover:bg-gruvbox-bg3 transition-colors border border-gruvbox-bg4"
        >
          Выйти
        </button>
      </div>

      <div className="mt-8 card p-8 sm:p-10 max-w-sm border-t-4 border-t-gruvbox-blueLight hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-gruvbox-blueLight mb-2">Pro Plan</h2>
        <p className="text-gruvbox-fg4 mb-6 leading-relaxed">Получите неограниченный доступ ко всем функциям и премиум поддержке навсегда.</p>

        <p className="text-5xl font-extrabold text-gruvbox-fg0">$0 <span className="text-lg font-medium text-gruvbox-fg4">/ навсегда</span></p>

        {isPro ? (
          <button
            disabled
            className="mt-8 w-full bg-gruvbox-bg3 text-gruvbox-fg4 font-bold py-3 rounded-lg cursor-not-allowed border border-gruvbox-bg4 shadow-inner"
          >
            ✓ Активно
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            className="btn-primary mt-8 flex items-center justify-center gap-2"
          >
            Купить Pro
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;