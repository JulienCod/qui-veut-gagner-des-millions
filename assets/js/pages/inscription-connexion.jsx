import React, { useState } from "react";
import Swal from "sweetalert2";
import FetchApi from "../services/fetchApi";

export default function InscriptionConnexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await FetchApi(
        isRegistering ? "/api/register" : "/api/login","POST",{ "email":email, "password":password });
      if (response.response.ok) {
        // Réinitialisez les champs après la soumission réussie
        setEmail("");
        setPassword("");
        setErrorMessage("");
        await Swal.fire({
          position: "center",
          icon: "success",
          title: isRegistering
          ? "Votre inscription à bien était prise en compte"
          : "Connexion réussi",
          showConfirmButton: false,
          heightAuto:false,
          timer: 1500,
        });
        if (!isRegistering) {
          location.href="/compte";
        }
        
      } else {
        // enregistrer et afficher le message d'erreur
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        heightAuto:false,
        text: error.message,
      });
      console.error(error.message);
    }
  };
  return (
    <section className="flex flex-col items-center text-white  m-auto p-4 rounded-lg">
      <div className="bg-gray-800 p-4 max-w-sm rounded overflow-hidden shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {isRegistering ? "Inscription" : "Connexion"}
        </h2>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 text-black"
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 text-black"
              autoComplete="current-password"
              required
            />
          </div>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              className="bg-gray-500 hover:bg-gray-300 text-white hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isRegistering ? "S'inscrire" : "Se connecter"}
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className=" text-sm text-gray-400 hover:text-blue-500 focus:outline-none"
            >
              {isRegistering ? "Déjà un compte ?" : "Pas encore de compte ?"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
