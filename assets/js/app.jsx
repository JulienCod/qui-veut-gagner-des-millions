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
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import { AppProvider, useAppContext } from "./context/AppContext";
import AuthApi from "./services/authApi";
import Game from "./components/game";
import Admin from "./pages/admin/admin";
import AccountIndex from "./components/account/accountIndex";
import Profile from "./components/account/profile";

function Main() {
  const { isAuthenticated, setIsAuthenticated } = useAuthContext();
  const { admin, setAdmin } = useAppContext();
  const [isGameActive, setIsGameActive] = useState(false);

  const auth = async () => {
    const auth = await AuthApi.isAuthenticated();
    setIsAuthenticated(auth);
  };

  useEffect(() => {
    auth();
  }, []);

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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Base
              isGameActive={isGameActive}
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
            <>
              <Route path="/compte" element={<AccountIndex />} />
              <Route path="/compte/profil/:id" element={<Profile />} />
              <Route
                path="/jeu"
                element={<Game setIsGameActive={setIsGameActive} isGameActive={isGameActive} />}
              />
            </>
          ) : (
            <Route path="/jeux" element={<Navigate to="/" />} />
          )}
          <Route
            path="connexion-inscription"
            element={
              <InscriptionConnexion setIsAuthenticated={setIsAuthenticated} />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <Main />
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);
