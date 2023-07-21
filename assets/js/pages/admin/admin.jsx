import React, { useEffect, useState } from "react";
import FormQuestionsAnswers from "../../components/admin/formQuestionsAnswers";
import FormTheme from "../../components/admin/formTheme";
import Swal from "sweetalert2";
import FetchApi from "../../services/fetchApi";

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
  useEffect(() => {
    dataTheme();
  }, []);
  // récupération des themes en base de données
  const dataTheme = async () => {
    try {
      const response = await FetchApi("/api/theme/getAll", "GET");
      if (!response.response.ok) {
        throw new Error(
          "Une erreur est survenue lors de la récupération des thèmes."
        );
      }
      setThemes(response.data.themes);
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
      const response = await FetchApi(
        `/api/theme/admin/get/${selectedTheme}`,
        "GET"
      );
      if (response.response.ok) {
        setQuestions(response.data);
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
      Swal.fire({
        position: "center",
        title: "Supprimer la question ? ",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Supprimer",
        denyButtonText: `Ne pas supprimer`,
        heightAuto: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await FetchApi(
            `/api/questions/admin/delete/${id}`,
            "DELETE"
          );
          if (response.response.ok) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Question supprimer avec succès",
              showConfirmButton: false,
              heightAuto: false,
              timer: 1500,
            });
            getDataTheme();
          } else {
            Swal.fire({
              icon: "error",
              title: "Erreur",
              text: response.data.message,
            });
          }
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (question) => {
    setModalOpen(true);
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
      const response = await FetchApi(
        `/api/questions/admin/update/${editingQuestion.id}`,
        "PUT",
        { question: editingQuestion.question, answers: editingQuestion.answers }
      );

      if (response.response.ok) {
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
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [copiedQuestion, setCopiedQuestion] = useState(null);
  useEffect(() => {
    if (copiedQuestion) {
      navigator.clipboard.writeText(copiedQuestion).then(
        () => {
          console.log("Question copiée !");
        },
        (error) => {
          console.error("Erreur lors de la copie de la question :", error);
        }
      );
      // Réinitialisez l'état de la question copiée après l'avoir copiée
      setCopiedQuestion(null);
    }
  }, [copiedQuestion]);

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
              <div key={question.id} className=" m-4">
                <div>
                  <div className="flex flex-wrap gap-2 m-2">
                    <span
                      className={
                        question.checked ? "bg-green-500" : "bg-orange-500"
                      }
                    >
                      {question.checked ? "Vérifié" : "Non vérifié"}
                    </span>
                    <h3 className="text-lg font-bold mb-2 text-white">
                      {question.question}
                    </h3>
                    <button
                    className="p-2 bg-blue-400 rounded hover:to-blue-700"
                      onClick={() => {
                        setCopiedQuestion(question.question);
                      }}
                    >
                      Copier la question
                    </button>
                  </div>
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
                      onClick={async () => {
                        await deleteQuestion(question.id);
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
