import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../../components/LoginForm";

// Login page responsible for user authentication entry
export default function LoginPage() {

  // Used to redirect the user after successful authentication
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    // Full-screen container with background image
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/login-bg-1.jpg')",
      }}
    >
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">

          {/* Left section: branding/logo */}
          <div className="md:w-1/2 flex items-center justify-center p-10">
            <img
              src="assets/images/Logo.jpg"
              className="w-[420px] h-auto object-contain select-none"
              alt="Company logo"
            />
          </div>

          {/* Right section: login content */}
          <div className="md:w-1/2 p-10">

            <h4 className="text-2xl font-semibold mb-2 text-gray-900">
              Login with your account
            </h4>

            <p className="text-gray-600 mb-6">
              Welcome back! Please enter your email and password to access your account.
            </p>

            {/* Social login actions (UI only) */}
            <div className="space-y-3 mb-6">
              <button className="w-full border border-[#27B9BA] text-[#27B9BA] py-2 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <i className="fa fa-google"></i> Login with Google
              </button>

              <button className="w-full border border-[#27B9BA] text-[#27B9BA] py-2 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <i className="fa fa-facebook-f"></i> Login with Facebook
              </button>
            </div>

            {/* Main login form */}
            <LoginForm onLoginSuccess={handleLoginSuccess} />

            {/* Redirect to registration */}
            <p className="text-center mt-5 text-sm text-gray-700"> Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline"> Register</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
