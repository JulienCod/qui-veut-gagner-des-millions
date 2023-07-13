import React, { useEffect, useState } from "react";
import AuthApi from "../../services/authApi";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function AccountIndex() {
  const [createAccount, setCreateAccount] = useState(false);
  const [viewAccount, setViewAccount] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [account, setAccount] = useState("");
  const [dataAccount, setDataAccount] = useState([]);
  const token = AuthApi.getToken();

  useEffect(() => {
    getDataAccount();
  }, []);

  const getDataAccount = async () => {
    try {
      const response = await fetch("/api/account/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDataAccount(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/account/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ account }),
      });
      const data = await response.json();
      if (response.ok) {
        setAccount("");
        await Swal.fire({
          position: "center",
          icon: "success",
          title: `Le Profil ${data.account} a été créé avec succès`,
          showConfirmButton: false,
          heightAuto: false,
          timer: 1500,
        });
      } else {
        // enregistrer et afficher le message d'erreur
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displayView = () => {
    setCreateAccount(!createAccount);
    setViewAccount(!viewAccount);
  };

  const choiceProfile = (account) => {
    const currentAccount = {
      "id": account.id,
      "name": account.name,
      "wallet": account.wallet
    }
    localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
    location.href="/jeux";
  };
  return (
    <div className="text-white">
      <div>
        <h1 className="text-center text-white">Compte Utilisateur</h1>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => {
            displayView();
          }}
          className="bg-gray-500 hover:bg-gray-300 text-white hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Créer un profil utilisateur
        </button>
        <button
          onClick={() => {
            displayView();
          }}
          className="bg-gray-500 hover:bg-gray-300 text-white hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Gérer les profils du compte
        </button>
      </div>
      {createAccount && (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="account" className="block">
              Nom du profil
            </label>
            <input
              type="text"
              id="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-500 text-black"
              required
            />
          </div>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              className="bg-gray-500 hover:bg-gray-300 text-white hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Créer un profil
            </button>
          </div>
        </form>
      )}
      {viewAccount && (
        <div className="flex gap-4 p-4 w-full justify-center">
          {dataAccount.length === 0 &&
          <div>
            Vous n'avez pas encore créé de profil
          </div>}
          
          {dataAccount.map((account) => (
            <div key={account.id} className="max-w-xs">
              <div className="bg-white shadow-xl rounded-lg py-3">
                <div className="photo-wrapper p-2">
                  <img
                    className="w-32 h-32 rounded-full mx-auto"
                    src="https://www.gravatar.com/avatar/2acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp"
                    alt="John Doe"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
                    nom : {account.name}
                  </h3>
                  <div className="text-center text-gray-400 text-xs font-semibold">
                    <p>Porte monnaie : {account.wallet} €</p>
                  </div>

                  <div className="text-center my-3">
                    <Link
                      className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                      to={`profil/${account.id}`}
                    >
                      Voir les détails du profil
                    </Link>
                  </div>
                  <div className="text-center my-3">
                    <button
                      className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                      onClick={() => {choiceProfile(account)}}
                    >
                      Jouer avec ce profil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
