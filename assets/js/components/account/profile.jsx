import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthApi from "../../services/authApi";
import Swal from "sweetalert2";

export default function Profile() {
  const token = AuthApi.getToken();
  const { id } = useParams();
  const [profile, setProfile] = useState();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await fetch("/api/account/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setProfile(data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const buy = async (idTheme, value, name) => {
    // si la valeur du thème est strictement supérieur à la valeur du thème dans ce cas l'achat n'est pas possible
    if (value > profile.wallet) {
    }
    Swal.fire({
      title: `Veuillez confirmer votre achat pour le thème ${name}`,
      position: "center",
      showDenyButton: true,
      confirmButtonText: "Oui, je confirme",
      denyButtonText: `Non, je change d'avis`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/theme/buy/${idTheme}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ "profileId":profile.id }),
          });
          const data = await response.json();
          if (response.ok) {
            await Swal.fire({
              position: "center",
              icon: "success",
              title: `Le thème ${name} a été obtenu`,
              showConfirmButton: false,
              heightAuto: false,
              timer: 1500,
            });
            getProfile();
          }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${data.message}`,
              })
          }
        } catch (error) {
          console.error(error.message);
        }
      }
    });
  };
  return (
<>
  {profile && (
    <div className="p-4">
        <div className="flex justify-around flex-wrap">
            <h2 className="text-2xl font-bold">Profil de {profile.name}</h2>
            <p className="text-lg">Argent disponible : {profile.wallet} €</p>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {profile.themes.map((theme) => (
          <div key={theme.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold mb-2">{theme.name}</h3>
            <p className="text-lg mb-4">
              Prix : {theme.value} <strong>€</strong>
            </p>
            {theme.actif ? (
              <p>Vous disposez déjà de ce thème</p>
            ) : (
              <button
                onClick={() => {
                  buy(theme.id, theme.value, theme.name);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Acheter ce thème
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )}
</>


  );
}
