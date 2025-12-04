import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/login-bg-1.jpg')",
      }}
    >
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">

          <div className="md:w-1/2 bg-white relative flex items-center justify-center p-10">
            <img
              src="assets/images/Logo.jpg"
              className="w-[420px] h-auto object-contain select-none mx-auto my-auto block"
              alt="Logo"
            />
          </div>

          <div className="md:w-1/2 p-10 bg-white">
            <h4 className="text-2xl font-semibold mb-2 text-gray-900">
              Inicia sesión en tu cuenta
            </h4>

            <p className="text-gray-600 mb-6 leading-tight">
              Bienvenido de nuevo! Inicia sesión con tus datos
            </p>

            <div className="space-y-3 mb-6">
              <button className="w-full border border-[#27B9BA] text-[#27B9BA] py-2 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <i className="fa fa-google"></i> Iniciar sesión con Google
              </button>

              <button className="w-full border border-[#27B9BA] text-[#27B9BA] py-2 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <i className="fa fa-facebook-f"></i> Iniciar sesión con Facebook
              </button>
            </div>

            <LoginForm onLoginSuccess={handleLoginSuccess} />

            <p className="text-center mt-5 text-sm text-gray-700">
              No tienes una cuenta?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">Registrate </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
