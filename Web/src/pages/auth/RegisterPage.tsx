import { Link } from "react-router-dom";
import RegisterForm from "../../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-10">

        {/* Logo / branding */}
        <div className="text-center mb-3">
          <img
            src="../../assets/images/Logo.jpg"
            alt="Company logo"
            className="w-60 h-auto object-contain select-none mx-auto block"
          />
        </div>

        <h4 className="text-2xl font-semibold mb-2 text-gray-900 text-center">
          Create an account
        </h4>

        <p className="text-gray-600 mb-6 text-center leading-tight">
          Enter your information to create your account.
        </p>

        {/* Main registration form */}
        <RegisterForm />

        {/* Navigation back to login */}
        <p className="text-center mt-5 text-sm text-gray-700">
          I already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
