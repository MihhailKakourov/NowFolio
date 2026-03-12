import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { userApi } from '../features/auth/api/userApi';
import { AuthLayout } from '../layouts/AuthLayout';
import toast from 'react-hot-toast';

interface AuthContextType {
    session: Session;
}

const SetUsername = () => {
    const { session } = useOutletContext<AuthContextType>();
    const navigate = useNavigate();

    // Предлагаем email без @domain
    const suggestedUsername = session.user.email?.split('@')[0] || '';
    const [username, setUsername] = useState(suggestedUsername);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            toast.error('Введите имя пользователя');
            return;
        }

        setLoading(true);
        try {
            // Обновляем user_metadata в Supabase
            const { error } = await supabase.auth.updateUser({
                data: { username: username.trim() }
            });

            if (error) throw error;

            // Синхронизируем slug в нашей БД
            await userApi.syncUser(session.user.email!, username.trim());

            toast.success('Имя пользователя установлено!');
            navigate('/', { replace: true });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Ошибка сохранения';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Выберите имя пользователя">
            <p className="text-gruvbox-fg4 text-center mb-6">
                Это имя будет использоваться для входа и в вашем профиле.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Имя пользователя"
                    className="input-field"
                    required
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary mt-6"
                >
                    {loading ? 'Сохранение...' : 'Продолжить'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default SetUsername;
