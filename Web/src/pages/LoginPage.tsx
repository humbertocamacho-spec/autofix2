import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Login</h1>
      <LoginForm onLoginSuccess={() => navigate('/home')} />
    </div>
  );
}
