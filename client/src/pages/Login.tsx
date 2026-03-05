import { Link } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md card p-8 sm:p-10">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gruvbox-orangeLight tracking-tight">
          Вход в NowFolio
        </h1>

        <LoginForm />

        <div className="mt-8 text-center text-sm">
          <Link to="/register" className="font-medium text-gruvbox-aquaLight hover:text-gruvbox-aqua transition-colors duration-200">
            Нет аккаунта? Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;