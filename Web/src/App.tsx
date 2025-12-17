import WebRoutes from "./routes/WebRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <WebRoutes />
    </AuthProvider>
  );
}

export default App;
