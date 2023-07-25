import React, { useEffect, useState } from "react";
import FetchApi from "../../services/fetchApi";
import { useParams } from "react-router-dom";

export default function VerifUser() {
    const { token } = useParams();
  const [message, setMessage] = useState();
  useEffect(() => {
    getVerif();
  }, []);

  const getVerif = async () => {
    try {
        const response = await FetchApi(`/api/verif/${token}`, ["GET"]);
        console.log(response)
        if (response.response.ok) {
          setMessage(response.data.message);
        } else {
          setMessage(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
  };
  return (
    <>
      <h1 className="text-center text-white text-3xl p-8">Activation de votre e-mail</h1>
      {message && <p className="text-center text-white text-xl">{message}</p>}
    </>
  );
}
