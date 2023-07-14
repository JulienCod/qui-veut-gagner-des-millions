import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AuthApi from "../../services/authApi";

export default function FormTheme() {
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const [token, setToken] = useState();

  useEffect(()=>{
    setToken(AuthApi.getToken());
  },[])
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Créer l'objet de thème à envoyer au backend
    const newTheme = {
      name: name,
      value: value,
    };
    try {
      const response = await fetch("/api/theme/admin/ajout", {
        method: ["POST"],
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTheme),
      });
      const data = await response.json();
      if (response.ok) {
        // Réinitialiser les champs du formulaire
        setName("");
        setValue(0);
        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Le Thème a bien était créé",
          showConfirmButton: false,
          heightAuto:false,
          timer: 1500,
        });
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
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2 font-medium">
          Nom du thème :
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="value" className="block mb-2 font-medium">
          Valeur :
        </label>
        <input
          type="number"
          id="value"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md  text-black"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Créer le thème
      </button>
    </form>
  );
}
