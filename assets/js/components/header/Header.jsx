import React from "react";
import AuthApi from "../../services/authApi";
import {Link} from "react-router-dom";
import Swal from "sweetalert2";

export default function Header({isGameActive, isAuthenticated, admin})
{
    const logout = async (e) => {
        e.preventDefault();
        await AuthApi.logout();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'déconnexion réussi',
            heightAuto:false,
            showConfirmButton: false,
            timer: 1500
        }).then(()=>{
            location.href="/";
        })

    }
    return (
        isGameActive ? (
            null
        ) : (
            <header className="bg-gray-800 py-4 text-white ">
                <nav className="container px-4 mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Qui Veut Gagner des Millions</h1>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/">Accueil</Link>
                        </li>
                        {admin &&
                        <li>
                            <Link to="/admin">Administration</Link>
                        </li>}
                        {isAuthenticated?
                            <>
                                <li>
                                    <Link to='/jeux'>Jeux</Link>
                                </li>
                                <li>
                                    <Link to='/compte'>Compte</Link>
                                </li>
                                <li>
                                    <button onClick={logout}>Deconnexion</button>
                                </li>
                            </>
                        :
                        <li>
                            <Link to="/connexion-inscription">Connexion/inscription</Link>
                        </li>
                        }
                    </ul>
                </nav>
            </header>
        )
    );
}