import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { userApi } from './../api/userApi';
import toast from 'react-hot-toast';

export const LoginForm = () => {
    const navigate = useNavigate();
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalEmail = loginIdentifier;

            // Если нет '@', то предполагаем, что ввели username и пытаемся найти email в базе
            if (!loginIdentifier.includes('@')) {
                const resolvedEmail = await userApi.findEmailByUsername(loginIdentifier);
                if (!resolvedEmail) {
                    toast.error('Пользователь с таким именем не найден');
                    setLoading(false);
                    return;
                }
                finalEmail = resolvedEmail;
            }

            const { error } = await authApi.loginWithEmail(finalEmail, password);

            if (error) {
                toast.error('Ошибка входа: ' + error.message);
            } else {
                navigate('/');
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Ошибка связи с сервером';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await authApi.loginWithGoogle();
        if (error) {
            toast.error('Ошибка входа через Google: ' + error.message);
        }
    };

    return (
        <>
            <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
                <input
                    type="text"
                    placeholder="Email или Имя пользователя"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary mt-6"
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>

            <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gruvbox-bg3"></div>
                <span className="flex-shrink mx-4 text-gruvbox-fg4 text-sm font-medium">или</span>
                <div className="flex-grow border-t border-gruvbox-bg3"></div>
            </div>

            <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full mt-2 flex items-center justify-center gap-3 bg-gruvbox-bg2 text-gruvbox-fg0 border border-gruvbox-bg3 py-3 rounded-lg font-medium hover:bg-gruvbox-bg3 transition-all duration-300 transform active:scale-[0.98] shadow-sm"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                <span>Войти через Google</span>
            </button>
        </>
    );
};
