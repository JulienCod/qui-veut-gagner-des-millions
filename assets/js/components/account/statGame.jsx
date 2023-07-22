import React, { useEffect, useState } from "react";
import FetchApi from "../../services/fetchApi";
import { useParams } from "react-router-dom";

export default function StatGame() {
  const { id } = useParams();
  const [games, setGames] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    getGames();
  }, []);

  const getGames = async () => {
    try {
      const response = await FetchApi(`/api/games/getAccount/${id}`, "GET");
      if (response.response.ok) {
        setGames(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Fonction pour calculer le nombre total de parties jouées
  const getTotalGames = () => games.length;

  // Fonction pour calculer le nombre total de bonnes réponses
  const getTotalCorrectAnswers = () =>
    games.reduce((total, game) => total + game.correct_answers_count, 0);

  // Fonction pour calculer le nombre total de gains obtenus
  const getTotalGains = () =>
    games.reduce((total, game) => total + game.gains, 0);

  // Fonction pour calculer le nombre total de jokers utilisés
  const getTotalUsedJokers = () =>
    games.reduce((total, game) => total + game.used_jokers_count, 0);

  // Fonction pour trouver le thème le plus utilisé
  const getMostUsedTheme = () => {
    const themesCount = {};
    games.forEach((game) => {
      const themeName = game.theme.name;
      themesCount[themeName] = (themesCount[themeName] || 0) + 1;
    });
    const mostUsedTheme = Object.keys(themesCount).reduce(
      (a, b) => (themesCount[a] > themesCount[b] ? a : b),
      null
    );
    return mostUsedTheme;
  };

  const sortedGames = games.sort((a, b) => {
    if (sortBy === "gains") {
      return sortOrder === "asc" ? a.gains - b.gains : b.gains - a.gains;
    } else if (sortBy === "used_jokers_count") {
      return sortOrder === "asc"
        ? a.used_jokers_count - b.used_jokers_count
        : b.used_jokers_count - a.used_jokers_count;
    } else if (sortBy === "correct_answers_count") {
      return sortOrder === "asc"
        ? a.correct_answers_count - b.correct_answers_count
        : b.correct_answers_count - a.correct_answers_count;
    } else if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortBy === "themeName") {
      return sortOrder === "asc"
        ? a.theme.name.localeCompare(b.theme.name)
        : b.theme.name.localeCompare(a.theme.name);
    }
    return 0;
  });

  return (
    <section className="py-8 text-gray-200 text-center">
      <h1 className="text-2xl pb-8">Statistique des parties réalisées</h1>
      <div className="flex flex-col items-start gap-2 pb-8">
        <p>Vous avez joué à <span className="text-[#DFA774]">{getTotalGames()}</span> parties</p>
        <p>Vous avez eu <span className="text-[#DFA774]">{getTotalCorrectAnswers()}</span> bonnes réponses</p>
        <p>Vous avez gagné un total de <span className="text-[#DFA774]">{getTotalGains()} €</span></p>
        <p>Vous avez utilisé <span className="text-[#DFA774]">{getTotalUsedJokers()}</span> jokers</p>
        <p>Le thème le plus utilisé est <span className="text-[#DFA774]">{getMostUsedTheme()}</span></p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border border-slate-400 bg-gray-500">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("date")}
                className="cursor-pointer bg-gray-800  py-2 px-4"
              >
                Date {sortBy === "date" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("themeName")}
                className="cursor-pointer bg-gray-800  py-2 px-4"
              >
                Thème{" "}
                {sortBy === "themeName" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("correct_answers_count")}
                className="cursor-pointer bg-gray-800  py-2 px-4"
              >
                Nombre de bonnes réponses{" "}
                {sortBy === "correct_answers_count" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("gains")}
                className="cursor-pointer bg-gray-800  py-2 px-4"
              >
                Gains {sortBy === "gains" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("used_jokers_count")}
                className="cursor-pointer bg-gray-800  py-2 px-4"
              >
                Nombre de jokers utilisés{" "}
                {sortBy === "used_jokers_count" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedGames.map((game) => (
              <tr
                key={game.id}
                className="bg-purple-900 bg-opacity-90 text-white"
              >
                <td className="py-2 px-4">
                  {new Date(game.date).toLocaleString()}
                </td>
                <td className="py-2 px-4">{game.theme.name}</td>
                <td className="py-2 px-4">{game.correct_answers_count}</td>
                <td className="py-2 px-4">{game.gains}€</td>
                <td className="py-2 px-4">{game.used_jokers_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
