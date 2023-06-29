import '../styles/app.css';
import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Base from "./templates/Base";
import Accueil from "./pages/Accueil";
import InscriptionConnexion from "./pages/inscription-connexion";
import {AuthProvider} from "./context/AuthContext";
import AuthApi from "./services/authApi";
import Game from "./components/game";

AuthApi.isAuthenticated();

function Main() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthApi.isAuthenticated()
    );
    const [admin, setAdmin] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            let user = AuthApi.getUserRole();
            if (user === "ROLE_ADMIN") {
                setAdmin(true);
            } else {
                setAdmin(false);
            }
        }
    }, [isAuthenticated]);
    const handleGameActiveChange = (value) => {
        setIsGameActive(value);
    };

    return (
            <AuthProvider value={{ isAuthenticated, setIsAuthenticated }}> {/* Enveloppez votre application avec le AuthProvider pour rendre le contexte disponible dans toute l'application */}
        <Router>
                <Routes>
                    <Route path="/" element={<Base isAuthenticated={isAuthenticated} isGameActive={isGameActive}/>}>
                        <Route index element={<Accueil />}/>

                        {isAuthenticated && <Route path="/jeux" element={<Game onGameActiveChange={handleGameActiveChange}/>}/>}
                        <Route path="connexion-inscription" element={<InscriptionConnexion/>}/>
                    </Route>
                </Routes>
        </Router>
            </AuthProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Main/>
    </React.StrictMode>
);