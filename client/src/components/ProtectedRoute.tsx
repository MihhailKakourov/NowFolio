import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export const ProtectedRoute = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Получаем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Подписываемся на изменения
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
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