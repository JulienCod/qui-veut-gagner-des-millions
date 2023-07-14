import React, { useEffect, useState } from "react";
import FormQuestionsAnswers from "../../components/admin/formQuestionsAnswers";
import FormTheme from "../../components/admin/formTheme";
import AuthApi from "../../services/authApi";
import Swal from "sweetalert2";

export default function Admin() {
  const [addTheme, setAddTheme] = useState(false);
  const [addQuestion, setAddQuestion] = useState(false);
  const [themes, setThemes] = useState([]);
  const [token] = useState(AuthApi.getToken());
  const [selectedTheme, setSelectedTheme] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    dataTheme();
  }, []);

  // récupération des themes en base de données
  const dataTheme = async () => {
    try {
      const response = await fetch("/api/theme/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Une erreur est survenue lors de la récupération des thèmes."
        );
      }

      const data = await response.json();

      setThemes(data.themes);
    } catch (error) {
      console.error(error);
    }
  };
  const theme = () => {
    setAddQuestion(false);
    setAddTheme(true);
  };

  const question = () => {
    setAddTheme(false);
    setAddQuestion(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/theme/admin/get/${selectedTheme}`,{
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if(response.ok) {
        setQuestions(data);
      }else{
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur s'est produite lors de la récupération des questions.",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className=" text-center h-full bg-blue-900 text-white">
        <h1>Administration</h1>
        <div className="flex justify-center">
          <div className="p-4">
            <button
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              onClick={theme}
            >
              Ajouter un thème
            </button>
          </div>
          <div className="p-4">
            <button
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              onClick={question}
            >
              Ajouter des questions avec des réponses
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-gray-800 p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="theme" className="font-bold mb-2">
              Thème
            </label>
            <select
              id="theme"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full px-4 py-2 border rounded text-black"
              required
            >
              <option value="">Sélectionnez un thème</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Afficher les questions
            </button>
          </div>
        </form>

        {questions.length > 0 && (
          <div className="mt-8 text-white">
            <h2 className="text-xl font-bold mb-4">Nombre de Questions : {questions.length}</h2>
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-bold mb-2">{question.question}</h3>
                <ul>
                  {question.answers.map((answer, answerIndex) => (
                    <li key={answerIndex} className={`${answer.correct? "bg-green-500 ml-4" : "bg-red-500 ml-4"}`}>
                      {answer.answer}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <button className="mr-2">Modifier</button>
                  <button>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <section className=" bg-blue-900 text-white px-4 py-10">
        {addTheme && (
          <>
            <FormTheme />
          </>
        )}
        {addQuestion && <FormQuestionsAnswers themes={themes} />}
      </section>
    </>
  );
}
