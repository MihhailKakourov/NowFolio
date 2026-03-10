import { Link } from 'react-router-dom';
import { RegisterForm } from '../features/auth/components/RegisterForm';

const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md card p-8 sm:p-10">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-gruvbox-orangeLight mb-8">
          Регистрация
        </h2>

        <RegisterForm />

        <div className="text-center text-sm mt-8">
          <Link to="/login" className="font-medium text-gruvbox-aquaLight hover:text-gruvbox-aqua transition-colors duration-200">
            Уже есть аккаунт? Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;