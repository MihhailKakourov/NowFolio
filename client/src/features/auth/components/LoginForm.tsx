import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

export const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await authApi.loginWithEmail(email, password);

        if (error) {
            toast.error('Ошибка входа: ' + error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    const handleGoogleLogin = async () => {
        await authApi.loginWithGoogle();
    };

    return (
        <>
            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
            </form>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">или</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
                onClick={handleGoogleLogin}
                className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 bg-white py-2 rounded-md hover:bg-gray-50 transition"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                <span>Войти через Google</span>
            </button>
        </>
    );
};
