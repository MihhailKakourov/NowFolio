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
            const { error } = await authApi.register(formData.email, formData.password, formData.username);

            if (error) throw error;

            // syncUser не нужен здесь — ProtectedRoute сделает sync при первом входе
            toast.success('Регистрация успешна! Войдите в аккаунт.');
            navigate('/login');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Ошибка регистрации';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
            <div className="space-y-4">
                <div>
                    <input
                        name="username"
                        type="text"
                        required
                        className="input-field"
                        placeholder="Имя пользователя"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        name="email"
                        type="email"
                        required
                        className="input-field"
                        placeholder="Email адрес"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        name="password"
                        type="password"
                        required
                        className="input-field"
                        placeholder="Пароль"
                        onChange={handleChange}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-6"
            >
                {loading ? 'Создаем аккаунт...' : 'Зарегистрироваться'}
            </button>
        </form>
    );
};
