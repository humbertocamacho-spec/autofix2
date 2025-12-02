import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Registro</h1>
      <RegisterForm onRegisterSuccess={() => navigate('/login')} />
    </div>
  );
}
