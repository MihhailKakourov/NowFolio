import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

export const RegisterForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await authApi.register(formData.email, formData.password, formData.username);

            if (error) throw error;

            if (data.user) {
                toast.success('Регистрация успешна! Войдите в аккаунт.');
                navigate('/login');
            }
        } catch (error: any) {
            toast.error(error.message || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="-space-y-px rounded-md shadow-sm">
                <div>
                    <input
                        name="username"
                        type="text"
                        required
                        className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                        placeholder="Username (Slug)"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        name="email"
                        type="email"
                        required
                        className="relative block w-full border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                        placeholder="Email address"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        name="password"
                        type="password"
                        required
                        className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                        placeholder="Password"
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50"
            >
                {loading ? 'Создаем аккаунт...' : 'Зарегистрироваться'}
            </button>
        </form>
    );
};
