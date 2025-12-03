import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/login-bg-1.jpg')",
      }}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-10">
        <h4 className="text-2xl font-semibold mb-2 text-gray-900 text-center">
          Create your account
        </h4>

        <p className="text-gray-600 mb-6 text-center leading-tight">
          Enter your information to register a new account
        </p>

        <RegisterForm />

        <p className="text-center mt-5 text-sm text-gray-700">
          Already have an account?{" "}
           <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
