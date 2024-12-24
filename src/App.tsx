import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProjectPage from "./components/project/ProjectPage";
import LandingPage from "./components/landing/LandingPage";
import ContractorDashboard from "./components/dashboard/ContractorDashboard";
import { AuthProvider } from "./lib/auth";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="h-screen w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/callback" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ContractorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:code"
            element={
              <ProtectedRoute>
                <ProjectPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
