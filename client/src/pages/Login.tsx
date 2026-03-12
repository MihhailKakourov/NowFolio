import { Link } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { AuthLayout } from '../layouts/AuthLayout';

const Login = () => {
  return (
    <AuthLayout title="Вход в NowFolio">
      <LoginForm />

      <div className="mt-8 text-center text-sm">
        <Link to="/register" className="font-medium text-gruvbox-aquaLight hover:text-gruvbox-aqua transition-colors duration-200">
          Нет аккаунта? Зарегистрироваться
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;