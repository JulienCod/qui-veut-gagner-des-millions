import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthApi from "../../services/authApi";
import Swal from "sweetalert2";
import StatGame from "./statGame";
import FetchApi from "../../services/fetchApi";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState();
  const [viewthemes, setViewThemes] = useState(true);
  const [viewStat, setViewStat] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await FetchApi("/api/account/" + id,"GET", true);
      if (response.response.ok) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const buy = async (idTheme, name) => {
    
    Swal.fire({
      title: `Veuillez confirmer votre achat pour le thème ${name}`,
      position: "center",
      showDenyButton: true,
      confirmButtonText: "Oui, je confirme",
      denyButtonText: `Non, je change d'avis`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await FetchApi(`/api/theme/buy/${idTheme}`,"POST",true,{ profileId: profile.id });
          if (response.response.ok) {
            await Swal.fire({
              position: "center",
              icon: "success",
              title: `Le thème ${name} a été obtenu`,
              showConfirmButton: false,
              heightAuto: false,
              timer: 1500,
            });
            getProfile();
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `${response.data.message}`,
            });
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
          <div className="flex justify-around flex-wrap text-white">
            <h2 className="text-2xl font-bold">Profil de {profile.name}</h2>
            <p className="text-lg">Argent disponible : {profile.wallet} €</p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-gray-500 text-white p-4 rounded hover:bg-gray-700" onClick={() => {setViewThemes(true), setViewStat(false)}}>Voir les thèmes</button>
            <button className="bg-gray-500 text-white p-4 rounded hover:bg-gray-700" onClick={() => {setViewStat(true), setViewThemes(false)}}>Voir les statistiques</button>
          </div>

          {viewthemes && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {profile.themes.map((theme) => (
                <div
                  key={theme.id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
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
                      className={
                        profile.wallet > theme.value
                          ? `bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`
                          : `bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`
                      }
                      disabled={profile.wallet < theme.value}
                    >
                      Acheter ce thème
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {viewStat&&
          <StatGame statsData={profile} />
          }
        </div>
      )}
    </>
  );
}
