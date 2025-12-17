export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-10 text-center border border-gray-200">
        
        <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
          <span className="text-red-500 text-5xl font-bold">!</span>
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-3">Acceso Denegado</h1>

        <p className="text-gray-600 mb-8">No tienes permisos para acceder a esta página.</p>

        <a href="/dashboard" className="inline-block px-6 py-3 rounded-xl bg-[#27B9BA] text-white font-medium transition hover:bg-[#1fa3a4]">
          Volver al Dashboard
        </a>
      </div>
    </div>
  );
}
