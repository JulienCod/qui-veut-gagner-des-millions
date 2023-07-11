import React, { useEffect, useMemo, useState } from "react";
import Board from "./gameComponents/board";
import AuthApi from "../services/authApi";

export default function Game({ onGameActiveChange }) {
  const [start, setStart] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [earned, setEarned] = useState("0 €");
  const [readyGame, setReadyGame] = useState(false);
  const [data, setData] = useState([]);
  const [dataTheme, setDataTheme] = useState([]);
  const [token] = useState(AuthApi.getToken());

  useEffect(() => {
    getDataTheme();
  }, []);

  const getDataTheme = async () => {
      try {
      const response = await fetch("api/theme/getAll", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDataTheme(data.themes);
        console.log(data.themes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const choiceTheme = async (themeId) => {
    try {
      const token = AuthApi.getToken();
      const response = await fetch("/api/theme/get/" + `${themeId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setData(data);
        setReadyGame(true);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const moneyPyramid = useMemo(
    () => [
      { id: 1, amount: "200 €" },
      { id: 2, amount: "300 €" },
      { id: 3, amount: "500 €" },
      { id: 4, amount: "800 €" },
      { id: 5, amount: "1500 €", bearing: true },
      { id: 6, amount: "3000 €" },
      { id: 7, amount: "6000 €" },
      { id: 8, amount: "12000 €" },
      { id: 9, amount: "24000 €" },
      { id: 10, amount: "48000 €", bearing: true },
      { id: 11, amount: "72000 €" },
      { id: 12, amount: "100000 €" },
      { id: 13, amount: "150000 €" },
      { id: 14, amount: "300000 €" },
      { id: 15, amount: "1000000 €", bearing: true },
    ].reverse(),
    []
  );

  useEffect(() => {
    questionNumber > 1 &&
      setEarned(moneyPyramid.find((m) => m.id === questionNumber - 1).amount);
  }, [questionNumber, moneyPyramid]);

  const handleGameActiveChange = () => {
    onGameActiveChange(true);
    setStart(true);
  };

  return (
    <section className="h-[100%] flex text-white">
      {start ? (
        <>
          <div className="w-3/4 bg-gradient-to-b from-transparent to-black bg-no-repeat bg-cover bg-center flex flex-col">
            {timeOut ? (
              <h1 className="relative inset-0 m-auto">Vous avez gagné: {earned}</h1>
            ) : (
              <div className="h-[100%]">
                <Board
                  data={data}
                  questionNumber={questionNumber}
                  setQuestionNumber={setQuestionNumber}
                  setTimeOut={setTimeOut}
                />
              </div>
            )}
          </div>
          <div className="w-1/4 bg-[#04001b] flex items-center justify-center border-l-4 border-white">
            <ul className="p-[20px] list-none w-full">
              {moneyPyramid.map((m) => (
                <li
                  key={m.id}
                  className={`${
                    questionNumber === m.id
                      ? "text-black bg-orange-500"
                      : m.bearing
                      ? "text-white"
                      : "text-orange-500"
                  } flex items-center p-[5px] rounded-md`}
                >
                  <span className="w-[30%] text-base font-thin">{m.id}</span>
                  <span className="text-lg font-light">{m.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="p-4 mx-auto">
          <div className="text-center">
            <h2 className="text-2xl p-4">Thèmes</h2>
            <div className="flex gap-4 justify-center">
              {dataTheme.map((t) => (
                <button
                  onClick={() => choiceTheme(t.id)}
                  key={t.id}
                  className={`${
                    t.actif ? "bg-green-500" : "bg-red-500"
                  } text-white py-2 px-4 mb-4 rounded-md`}
                  disabled={!t.actif}
                >
                  <h3>{t.name}</h3>
                </button>
              ))}
            </div>
          </div>
          {readyGame && (
            <div className="m-auto">
              <button
                onClick={handleGameActiveChange}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 m-auto"
              >
                Commencer une nouvelle partie
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
