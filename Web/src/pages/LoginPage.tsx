import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/login-bg-1.jpg')",
      }}
    >
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">

          <div className="md:w-1/2 bg-white flex flex-col items-center justify-center relative p-10">
            <div className="text-center my-6">
              <img src="assets/images/logo-dark.png" className="w-40 mx-auto" />
            </div>

            <img
              src="assets/images/log.png"
              className="w-80 mx-auto drop-shadow-xl"
            />
          </div>

          <div className="md:w-1/2 p-10 bg-white">
            <h4 className="text-2xl font-semibold mb-2 text-gray-900">
              Sign in your account
            </h4>

            <p className="text-gray-600 mb-6 leading-tight">
              Welcome back! Login with your data that you entered<br />
              during registration
            </p>

            <div className="space-y-3 mb-6">
              <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <i className="fa fa-google"></i> Login with Google
              </button>

              <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2">
                <i className="fa fa-facebook-f"></i> Login with Facebook
              </button>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
