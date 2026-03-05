import { Link } from 'react-router-dom';
import { RegisterForm } from '../features/auth/components/RegisterForm';

const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Регистрация
        </h2>

        <RegisterForm />

        <div className="text-center text-sm mt-4">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Уже есть аккаунт? Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;