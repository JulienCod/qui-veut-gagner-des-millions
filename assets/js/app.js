import "../styles/app.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Base from "./templates/Base";
import Accueil from "./pages/Accueil";
import InscriptionConnexion from "./pages/inscription-connexion";
import { AuthProvider } from "./context/AuthContext";
import AuthApi from "./services/authApi";
import Game from "./components/game";
import Admin from "./pages/admin/admin";

function Main() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthApi.isAuthenticated()
  );
  const [admin, setAdmin] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    isAdmin();
  }, [isAuthenticated]);
  const isAdmin = async () => {
    if (isAuthenticated) {
      let user = await AuthApi.getUserRole();
      if (user === "ROLE_ADMIN") {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    }
  };
  const handleGameActiveChange = (value) => {
    setIsGameActive(value);
  };
  return (
    <AuthProvider value={{ isAuthenticated, setIsAuthenticated }}>
      {/* Enveloppez votre application avec le AuthProvider pour rendre le contexte disponible dans toute l'application */}
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Base
                isAuthenticated={isAuthenticated}
                isGameActive={isGameActive}
                admin={admin}
              />
            }
          >
            <Route index element={<Accueil />} />
            {admin ? (
              <Route path="/admin" element={<Admin />} />
            ) : (
              <Route path={"/admin"} element={<Navigate to="/" />} />
            )}
            {isAuthenticated ? (
              <Route
                path="/jeux"
                element={<Game onGameActiveChange={handleGameActiveChange} />}
              />
            ) : (
              <Route path={"/jeux"} element={<Navigate to="/" />} />
            )}
            <Route
              path="connexion-inscription"
              element={<InscriptionConnexion />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
