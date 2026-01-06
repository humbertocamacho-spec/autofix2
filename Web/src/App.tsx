import WebRoutes from "./routes/WebRoutes";
import { AuthProvider } from "./context/AuthContext";

// App component
function App() {
  return (
    <AuthProvider>
      <WebRoutes />
    </AuthProvider>
  );
}

export default App;
