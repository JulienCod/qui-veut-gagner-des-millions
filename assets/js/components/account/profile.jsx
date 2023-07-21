import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import StatGame from "./statGame";
import FetchApi from "../../services/fetchApi";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState();
  const [viewthemes, setViewThemes] = useState(true);
  const [viewStat, setViewStat] = useState(false);
  const cssButton ="bg-[#4E6095] hover:bg-[#C6598E]  text-gray-200 font-bold py-2 px-4 border-white rounded-lg focus:outline-none focus:shadow-outline"


  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await FetchApi("/api/account/" + id,"GET");
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
          const response = await FetchApi(`/api/theme/buy/${idTheme}`,"POST",{ profileId: profile.id });
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
          <div className="flex flex-col justify-around s:flex-row gap-4 text-white pb-4 items-center">
            <h2 className="text-2xl font-bold">Profil de {profile.name}</h2>
            <p className="text-lg">Argent disponible : {profile.wallet} €</p>
          </div>
          <div className="flex justify-center gap-4 flex-wrap ">
            <button className={cssButton} onClick={() => {setViewThemes(true), setViewStat(false)}}>Voir les thèmes</button>
            <button className={cssButton} onClick={() => {setViewStat(true), setViewThemes(false)}}>Voir les statistiques</button>
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
                          ? cssButton
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
