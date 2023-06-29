import React, {useState} from "react";
import TokenStorage from "../services/localstorage";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
export default function InscriptionConnexion(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Effectuez ici votre logique de connexion ou d'inscription avec les données email et password
            const response = await fetch(isRegistering? "/api/register" : "/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                // Enregistrement du token en local storage
                TokenStorage.saveToken(data.token);
                // Réinitialisez les champs après la soumission réussie
                setEmail("");
                setPassword("");
                setErrorMessage("");
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: isRegistering?'Votre inscription à bien était prise en compte':'Connexion réussi',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate('/jeux');
            } else {
                // enregistrer et afficher le message d'erreur
                setErrorMessage(data.message);
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message
            })
            console.error(error.message);
        }
    };
    return (
        <section className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">{isRegistering ? 'Inscription' : 'Connexion'}</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {isRegistering ? 'S\'inscrire' : 'Se connecter'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {isRegistering ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
                    </button>
                </div>
            </form>
        </section>
    );
}