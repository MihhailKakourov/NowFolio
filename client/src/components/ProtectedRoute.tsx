import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { userApi } from '../features/auth/api/userApi';

export const ProtectedRoute = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session?.user?.email) {
          await userApi.syncUser(
            session.user.email,
            session.user.user_metadata?.username
          );
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Подписываемся на изменения
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        try {
          await userApi.syncUser(
            session.user.email,
            session.user.user_metadata?.username
          );
        } catch (error) {
          console.error('Auth state change sync error:', error);
        }
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