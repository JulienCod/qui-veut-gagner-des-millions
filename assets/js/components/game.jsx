import React, { useEffect, useMemo, useState } from "react";
import Board from "./gameComponents/board";
import AuthApi from "../services/authApi";
import Swal from "sweetalert2";
import FetchApi from "../services/fetchApi";

export default function Game({ setIsGameActive, isGameActive }) {
  const [start, setStart] = useState(false);
  const [timeOut, setTimeOut] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [earned, setEarned] = useState(0);
  const [readyGame, setReadyGame] = useState(false);
  const [data, setData] = useState([]);
  const [dataTheme, setDataTheme] = useState([]);
  const [isMoneyPyramidVisible, setIsMoneyPyramidVisible] = useState(true);
  const [currentAccount] = useState(
    JSON.parse(localStorage.getItem("currentAccount"))
  );
  const [usedJokersCount, setUsedJokersCount] = useState(0);
  const [choiceThemeId, setChoiceThemeId] = useState(null);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const URLGETALLACCOUNTID = `api/theme/game/getAll?accountId=${currentAccount.id}`;

  useEffect(() => {
    getDataTheme();
  }, [currentAccount]);

  const getDataTheme = async () => {
    try {
      const response = await FetchApi(URLGETALLACCOUNTID, "GET");
      if (response.response.ok) {
        setDataTheme(response.data.themes);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const choiceTheme = async (themeId) => {
    try {
      setChoiceThemeId(themeId);
      const response = await FetchApi(
        `/api/theme/game/get/${themeId}?accountId=${currentAccount.id}`,
        "GET"
      );
      if (response.response.ok) {
        setData(response.data);
        setReadyGame(true);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (timeOut) {
      gainAccount();
    }
  }, [timeOut]);

  const gainAccount = async () => {
    try {
      const earnedAmount =
        moneyPyramid.find((m) => m.id === questionNumber - 1)?.amount || 0;
      const response = await FetchApi(
        `/api/account/gain/${currentAccount.id}`,
        "POST",
        { gain: earnedAmount }
      );
      if (response.response.ok) {
        await saveGameStats(
          currentAccount.id,
          choiceThemeId,
          correctAnswerCount,
          usedJokersCount,
          earnedAmount
        );
        await Swal.fire({
          position: "center",
          icon: "success",
          title: `Vos gain d'un montant de ${earnedAmount} € ont étaient crédité sur votre compte de jeu`,
          showConfirmButton: false,
          heightAuto: false,
          timer: 3000,
        });
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
  };
  const saveGameStats = async (
    accountId,
    themeId,
    correctAnswersCount,
    usedJokersCount,
    earnedAmount
  ) => {
    try {
      const response = await FetchApi("/api/games/save", "POST", {
        accountId: accountId,
        themeId: themeId,
        correctAnswersCount: correctAnswersCount,
        usedJokersCount: usedJokersCount,
        earnedAmount: earnedAmount,
      });
      if (!response.response.ok) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const moneyPyramid = useMemo(
    () =>
      [
        { id: 1, amount: 200 },
        { id: 2, amount: 300 },
        { id: 3, amount: 500 },
        { id: 4, amount: 800 },
        { id: 5, amount: 1500, bearing: true },
        { id: 6, amount: 3000 },
        { id: 7, amount: 6000 },
        { id: 8, amount: 12000 },
        { id: 9, amount: 24000 },
        { id: 10, amount: 48000, bearing: true },
        { id: 11, amount: 72000 },
        { id: 12, amount: 100000 },
        { id: 13, amount: 150000 },
        { id: 14, amount: 300000 },
        { id: 15, amount: 1000000, bearing: true },
      ].reverse(),
    []
  );

  useEffect(() => {
    questionNumber > 1 &&
      setEarned(moneyPyramid.find((m) => m.id === questionNumber - 1).amount);
  }, [questionNumber, moneyPyramid]);

  const handleGameActiveChange = () => {
    setIsGameActive(true); // TODO : changer la valeur après changement css
    setStart(true);
  };

  useEffect(() => {
    setIsGameActive(false);
  }, [timeOut]);

  const toggleMoneyPyramid = () => {
    setIsMoneyPyramidVisible((prev) => !prev);
  };
  return (
    <section className={isGameActive? "h-[100%] flex text-gray-200" : "min-h-[calc(100vh-72px-52px)] flex text-gray-200" }>
      {start ? (
        <>
          <div className={isMoneyPyramidVisible ? "w-4/6 bg-gradient-to-b from-transparent to-black bg-no-repeat bg-cover bg-center flex flex-col" : "w-full bg-gradient-to-b from-transparent to-black bg-no-repeat bg-cover bg-center flex flex-col"}>
            {timeOut ? (
              <h1 className="relative inset-0 m-auto">
                Vous avez gagné: {earned} <strong>€</strong>
              </h1>
            ) : (
              <div className="h-[100%]">
                <Board
                  data={data}
                  questionNumber={questionNumber}
                  setQuestionNumber={setQuestionNumber}
                  setTimeOut={setTimeOut}
                  setUsedJokersCount={setUsedJokersCount}
                  setCorrectAnswerCount={setCorrectAnswerCount}
                />
              </div>
            )}
          </div>
          {isMoneyPyramidVisible ?  (
            <div className="w-2/6 bg-[#04001b] flex items-center justify-center border-l-4 border-white">
              <ul className="p-[4px] md:p-[20px] list-none w-full">
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
                    <span className="w-[15%] md:w-[30%] text-[16px] md:text-base font-thin">
                      {m.id}
                    </span>
                    <span className=" text-[16px] md:text-lg font-light">{m.amount} €</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
         { isGameActive &&
          <button
            onClick={toggleMoneyPyramid}
            className="fixed top-4 right-4 p-2 bg-blue-500 text-white rounded-md"
          >
          </button>}
        </>
      ) : (
        <div className="p-4 mx-auto">
          <div className="text-center">
            {currentAccount && (
              <h2>
                Vous êtes connecter sur le profil de {currentAccount.name}
              </h2>
            )}
            <h3 className="text-2xl p-4">Thèmes</h3>
            <div className="flex gap-4 justify-center">
              {dataTheme.map((t) => (
                <button
                  onClick={() => choiceTheme(t.id)}
                  key={t.id}
                  className={`${
                    t.actif ? "bg-[#349151] hover:bg-[#4E6095]" : "bg-gray-200 text-gray-600"
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
                className="bg-[#4E6095] hover:bg-[#349151]  text-gray-200 font-bold py-2 px-4 border-white rounded-lg focus:outline-none focus:shadow-outline"

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
