import React, { useState } from "react";
import FetchApi from "../../services/fetchApi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function OubliPass() {
    const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const savePass = async () => {
    try {
        const response = await FetchApi(`/api/oubli-pass/${token}`, ["POST"], {password: password});
        console.log(response)
        if (response.response.ok) {
          Swal.fire({
            title: "Changement de mot de passe",
            icon:"success",
            text: response.data.message,
            timer: 2500,
            heightAuto: false,
            showConfirmButton: false,
            position:"center"
          })
          navigate('/connexion-inscription');
        } else {
          Swal.fire({
            title: "Changement de mot de passe",
            icon:"error",
            text: response.data.message,
            timer: 2500,
            heightAuto: false,
            showConfirmButton: false,
            position:"center"
          })
          navigate('/');
        }
    } catch (error) {
        console.error(error);
    }
  };
  return (
    <section>
      <div className="fixed inset-0 text-gray-200 flex items-center justify-center z-10 bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Veuillez saisir un nouveau mot de passe</h2>
            <form className="mb-4">
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
          </form>
            <div className="flex gap-4 justify-center">
              <button
              type="button"
                className="bg-gray-500 hover:bg-gray-300 text-white hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={savePass}
              >
                enregistrer votre nouveau mot de passe
              </button>
            </div>
          </div>
        </div>
    </section>
  );
}
