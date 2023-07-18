import React, { useEffect, useState } from "react";
import FormQuestionsAnswers from "../../components/admin/formQuestionsAnswers";
import FormTheme from "../../components/admin/formTheme";
import AuthApi from "../../services/authApi";
import Swal from "sweetalert2";

export default function Admin() {
  const [addTheme, setAddTheme] = useState(false);
  const [addQuestion, setAddQuestion] = useState(false);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState({
    question: "",
    answers: [],
  });
  useEffect(()=>{
    dataTheme();
  },[])
  // récupération des themes en base de données
  const dataTheme = async () => {
    try {
      const token = await AuthApi.refreshToken();
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
    getDataTheme();
  };
  
  const getDataTheme = async () => {
    try {
      const token = await AuthApi.refreshToken();
      const response = await fetch(`/api/theme/admin/get/${selectedTheme}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setQuestions(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur s'est produite lors de la récupération des questions.",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteQuestion = async (id) => {
    try {
      const token = await AuthApi.refreshToken();
      const response = await fetch(`/api/questions/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          heightAuto: false,
          timer: 1500,
        });
        getDataTheme();
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: data.message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (question) => {
    setModalOpen(true);
    console.log(question);
    setEditingQuestion({
      id: question.id,
      question: question.question,
      answers: [...question.answers],
    });
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleQuestionChange = (event) => {
    setEditingQuestion({
      ...editingQuestion,
      question: event.target.value,
    });
  };

  const handleAnswerChange = (answerIndex, event) => {
    const updatedAnswers = editingQuestion.answers.map((answer) => {
      if (answer.id === answerIndex) {
        return {
          ...answer,
          answer: event.target.value,
        };
      }
      return answer;
    });

    setEditingQuestion({
      ...editingQuestion,
      answers: updatedAnswers,
    });
  };

  const handleCorrectAnswerChange = (answerId) => {
    const updatedAnswers = editingQuestion.answers.map((answer) => {
      return {
        ...answer,
        correct: answer.id === answerId,
      };
    });
    setEditingQuestion({
      ...editingQuestion,
      answers: updatedAnswers,
    });
  };

  const saveChanges = async () => {
    try {
      const updatedQuestion = {
        id: editingQuestion.id,
        question: editingQuestion.question,
        answers: editingQuestion.answers,
      };
      const response = await fetch(
        `/api/questions/admin/update/${updatedQuestion.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedQuestion),
        }
      );

      const data = await response.json();

      if (response.ok) {
        closeModal();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Modifications enregistrées avec succès",
          showConfirmButton: false,
          heightAuto: false,
          timer: 1500,
        });
        getDataTheme();
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: data.message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="text-center h-full bg-blue-900 text-white">
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
        {questions && (
          <>
          <h2>Il y a {questions.length} questions</h2>
            {questions.map((question) => (
              <div key={question.id} className="mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    {question.question}
                  </h3>
                  <ul>
                    {question.answers.map((answer, answerIndex) => (
                      <li
                        key={answerIndex}
                        className={`${
                          answer.correct
                            ? "bg-green-500 ml-4"
                            : "bg-red-500 ml-4"
                        }`}
                      >
                        {answer.answer}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <button
                      className="mr-2"
                      onClick={() => openModal(question)}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        deleteQuestion(question.id);
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Modifier la question</h2>
            <div className="mb-4">
              <label htmlFor="question" className="font-bold mb-2">
                Question
              </label>
              <input
                id="question"
                type="text"
                value={editingQuestion.question}
                onChange={handleQuestionChange}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>
            <div className="mb-4">
              <p className="font-bold mb-2">Réponses :</p>
              {editingQuestion.answers.map((answer) => (
                <div key={answer.id} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`answer-${answer.id}`}
                    checked={answer.correct}
                    onChange={() => handleCorrectAnswerChange(answer.id)}
                  />
                  <label htmlFor={`answer-${answer.id}`} className="ml-2">
                    Réponse {answer.id} :
                  </label>
                  <input
                    type="text"
                    value={answer.answer}
                    onChange={(e) => handleAnswerChange(answer.id, e)}
                    className="ml-2 w-full px-4 py-2 border rounded text-black"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className="mr-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                onClick={saveChanges}
              >
                Enregistrer les modifications
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                onClick={closeModal}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="bg-blue-900 text-white px-4 py-10">
        {addTheme && <FormTheme />}
        {addQuestion && <FormQuestionsAnswers themes={themes} />}
      </section>
    </>
  );
}
