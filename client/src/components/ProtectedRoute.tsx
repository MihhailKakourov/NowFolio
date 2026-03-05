import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { userApi } from '../features/auth/api/userApi';

export const ProtectedRoute = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Получаем текущую сессию
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);

      // Синхронизируем юзера с нашей базой данных
      if (session?.user?.email) {
        await userApi.syncUser(
          session.user.email,
          session.user.user_metadata?.username
        );
      }

      setLoading(false);
    });

    // Подписываемся на изменения
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        await userApi.syncUser(
          session.user.email,
          session.user.user_metadata?.username
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center mt-20">Загрузка...</div>;
  }

  // Если нет сессии — редирект
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Передаем сессию в контекст Outlet, чтобы дочерние страницы могли её использовать
  return <Outlet context={{ session }} />;
};