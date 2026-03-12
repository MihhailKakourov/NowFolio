import { useEffect, useState, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { userApi } from '../features/auth/api/userApi';

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 часа
const LOGIN_TIMESTAMP_KEY = 'nowfolio_login_at';

/** Проверяет, не истекла ли сессия (>24ч с момента логина) */
const isSessionExpired = (): boolean => {
  const loginAt = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
  if (!loginAt) return false;
  return Date.now() - parseInt(loginAt, 10) > SESSION_MAX_AGE_MS;
};

export const ProtectedRoute = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  const syncInProgress = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        // Автоматический разлогин если сессия старше 24 часов
        if (session && isSessionExpired()) {
          localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
          await supabase.auth.signOut();
          setSession(null);
          return;
        }

        setSession(session);

        if (session?.user?.email && syncInProgress.current !== session.access_token) {
          syncInProgress.current = session.access_token;
          userApi.syncUser(
            session.user.email,
            session.user.user_metadata?.username
          ).catch(err => console.error('Background sync failed:', err))
            .finally(() => { syncInProgress.current = null; });
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(timeout);
        }
      }
    };

    initializeSession();

    // Подписываемся на изменения
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Сохраняем время логина
      if (event === 'SIGNED_IN') {
        localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
      }

      setSession(session);

      // Синхронизируем при логине или обновлении токена
      if (session?.user?.email && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        if (syncInProgress.current === session.access_token) return;
        syncInProgress.current = session.access_token;

        userApi.syncUser(
          session.user.email,
          session.user.user_metadata?.username
        ).catch(err => console.error('Auth state change sync error:', err))
          .finally(() => { syncInProgress.current = null; });
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="flex justify-center mt-20">Загрузка...</div>;
  }

  // Если нет сессии — редирект на логин
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Если нет username — редирект на выбор имени (кроме самой страницы /set-username)
  const hasUsername = !!session.user.user_metadata?.username;
  if (!hasUsername && location.pathname !== '/set-username') {
    return <Navigate to="/set-username" replace />;
  }

  // Передаем сессию в контекст Outlet
  return <Outlet context={{ session }} />;
};