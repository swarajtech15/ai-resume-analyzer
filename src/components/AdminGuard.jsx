import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyAdmin } from "../utils/adminAuth";

function AdminGuard({ children }) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await verifyAdmin();

      setAuthenticated(valid);
      setChecking(false);
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#ffffff",
          display: "grid",
          placeItems: "center",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        Checking secure access...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminGuard;
