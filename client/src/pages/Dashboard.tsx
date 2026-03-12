import { useOutletContext, useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';
import { useProStatus } from '../features/payments/hooks/useProStatus';
import { useCheckout } from '../features/payments/hooks/useCheckout';
import { ProPlanCard } from '../features/payments/components/ProPlanCard';

interface AuthContextType {
  session: Session;
}

import { useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const { session } = useOutletContext<AuthContextType>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isPro } = useProStatus(session);
  const { handleSubscribe, isLoading: isPaymentLoading } = useCheckout(session, {
    onAlreadyPro: () => {
      queryClient.invalidateQueries({ queryKey: ['pro-status', session.user.email] });
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Вы вышли из аккаунта');
    navigate('/login');
  };

  const displayName = session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Пользователь';
  const isButtonDisabled = isPro === null || isPaymentLoading;

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gruvbox-orangeLight">Привет, {displayName}!</h1>
          <p className="mt-3 text-lg text-gruvbox-fg4">Добро пожаловать в панель управления.</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gruvbox-bg2 text-gruvbox-fg4 font-bold py-2 px-6 rounded-lg hover:bg-gruvbox-bg3 transition-colors border border-gruvbox-bg4"
        >
          Выйти
        </button>
      </div>

      <ProPlanCard
        isPro={isPro}
        isButtonDisabled={isButtonDisabled}
        isPaymentLoading={isPaymentLoading}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default Dashboard;