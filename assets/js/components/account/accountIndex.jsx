import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import FetchApi from "../../services/fetchApi";
import { useNavigate } from "react-router-dom";

export default function AccountIndex() {
  const [createAccount, setCreateAccount] = useState(false);
  const [viewAccount, setViewAccount] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [account, setAccount] = useState("");
  const [dataAccount, setDataAccount] = useState([]);
  const navigate = useNavigate();
  const cssButton ="bg-[#4E6095] hover:bg-[#C6598E]  text-gray-200 font-bold py-2 px-4 border-white rounded-lg focus:outline-none focus:shadow-outline"

  useEffect(() => {
    getDataAccount();
  }, []);

  const getDataAccount = async () => {
    try {
      const response = await FetchApi("/api/account/user", "GET");
      if (response.response.ok) {
        setDataAccount(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await FetchApi("/api/account/create", "POST", {
        account: account,
      });
      if (response.response.ok) {
        setAccount("");
        await Swal.fire({
          position: "center",
          icon: "success",
          title: `Le Profil ${response.data.account} a été créé avec succès`,
          showConfirmButton: false,
          heightAuto: false,
          timer: 1500,
        });
        await getDataAccount();
        setCreateAccount(false);
        setViewAccount(true);
      } else {
        // enregistrer et afficher le message d'erreur
        setErrorMessage(response.data.message);
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
      id: account.id,
      name: account.name,
      wallet: account.wallet,
    };
    localStorage.setItem("currentAccount", JSON.stringify(currentAccount));
    navigate("/jeu");
  };

  const deleteAccount = async (accountId) => {
    try {
      Swal.fire({
        position: "center",
        title: "Voulez vous supprimer le compte ? ",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Supprimer",
        denyButtonText: `Ne pas supprimer`,
        heightAuto: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await FetchApi(
            `/api/account/delete/${accountId}`,
            "DELETE"
          );
          if (response.response.ok) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Le compte a été supprimé avec succès",
              showConfirmButton: false,
              heightAuto: false,
              timer: 1500,
            });
            getDataAccount();
          } else {
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: response.data.message,
            });
          }
        } else if (result.isDenied) {
          Swal.fire("Le compte n'a pas été supprimé", "", "info");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="text-gray-200 py-4">
      <div>
        <h1 className="text-center text-gray-200 mb-4">Gestion des comptes utilisateurs</h1>
      </div>
      <div className="flex justify-center gap-4 pb-8">
        <button
          onClick={() => {
            displayView();
          }}
          className={cssButton}
        >
          Créer un profil utilisateur
        </button>
        <button
          onClick={() => {
            displayView();
          }}
          className={cssButton}
        >
          Gérer les profils du compte
        </button>
      </div>
      {createAccount && (
        <form onSubmit={handleSubmit} className="w-full max-w-sm m-auto">
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
              className={cssButton}
            >
              Créer un profil
            </button>
          </div>
        </form>
      )}
      {viewAccount && (
        <div className="flex flex-col s:flex-row s:flex-wrap items-center gap-4 p-4 w-full justify-center">
          {dataAccount.length === 0 && (
            <div>Vous n'avez pas encore créé de profil</div>
          )}

          {dataAccount.map((account) => (
            <div key={account.id} className="w-[200px]">
              <div className="bg-gray-200 shadow-xl rounded-lg py-3 min-w-[200px] ">
                <div className="photo-wrapper p-2">
                  <img
                    className="w-32 h-32 rounded-full mx-auto"
                    src="/images/logo/logo.webp"
                    alt="Logo qui veut gagner des millions"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
                    {account.name}
                  </h3>
                  <div className="text-center text-gray-400 text-xs font-semibold">
                    <p>Argent disponibles : {account.wallet} €</p>
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
                      onClick={() => {
                        choiceProfile(account);
                      }}
                    >
                      Jouer avec ce profil
                    </button>
                  </div>
                  <div className="text-center my-3">
                    <button
                      className="m-4 bg-red-800 p-1 text-xs text-gray-200 hover:bg-red-500 font-medium"
                      onClick={() => {
                        deleteAccount(account.id);
                      }}
                    >
                      Supprimer ce profil
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
