import { Link } from 'react-router-dom';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { AuthLayout } from '../layouts/AuthLayout';

const Register = () => {
  return (
    <AuthLayout title="Регистрация">
      <RegisterForm />

      <div className="text-center text-sm mt-8">
        <Link to="/login" className="font-medium text-gruvbox-aquaLight hover:text-gruvbox-aqua transition-colors duration-200">
          Уже есть аккаунт? Войти
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;