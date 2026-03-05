import { Link } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Вход в NowFolio</h1>

        <LoginForm />

        <div className="mt-6 text-center text-sm">
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Нет аккаунта? Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;