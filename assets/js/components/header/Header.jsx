import React from "react";
import AuthApi from "../../services/authApi";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

export default function Header({isGameActive, isAuthenticated})
{
    const navigate = useNavigate();
    const logout = (e) => {
        e.preventDefault();
        AuthApi.logout();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'déconnexion réussi',
            showConfirmButton: false,
            timer: 1500
        })
        navigate('/');
    }
    return (
        isGameActive ? (
            null
        ) : (
            <header className="bg-gray-800 py-4">
                <nav className="container mx-auto flex items-center justify-between">
                    <h1 className="text-white text-2xl font-bold">Qui Veut Gagner des Millions</h1>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="/">Accueil</a>
                        </li>
                        {isAuthenticated?
                        <li>
                            <button onClick={logout}>Deconnexion</button>
                        </li>
                        :
                        <li>
                            <a href="/connexion-inscription">Connexion/inscription</a>
                        </li>
                        }
                    </ul>
                </nav>
            </header>
        )
    );
}