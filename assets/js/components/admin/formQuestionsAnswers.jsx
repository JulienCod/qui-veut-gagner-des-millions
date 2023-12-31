import React, { useState } from "react";
import Swal from "sweetalert2";
import FetchApi from "../../services/fetchApi";

export default function FormQuestionsAnswers({ themes }) {
  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: [
        { answer: "", correct: false },
        { answer: "", correct: false },
        { answer: "", correct: false },
        { answer: "", correct: false },
      ],
      theme: "",
    },
  ]);

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        question: "",
        answers: [
          { answer: "", correct: false },
          { answer: "", correct: false },
          { answer: "", correct: false },
          { answer: "", correct: false },
        ],
        theme: "",
      },
    ]);
  };

  const handleChangeQuestion = (index, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].question = value;
      return updatedQuestions;
    });
  };

  const handleChangeAnswer = (questionIndex, answerIndex, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].answers[answerIndex].answer = value;
      return updatedQuestions;
    });
  };

  const handleChangeCorrectAnswer = (questionIndex, answerIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].answers.forEach((answer, index) => {
        answer.correct = index === answerIndex;
      });
      return updatedQuestions;
    });
  };

  const handleChangeTheme = (questionIndex, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].theme = value;
      return updatedQuestions;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await FetchApi(
        "/api/questions/admin/ajout",
        "POST",
        questions
      );
      if (response.response.ok) {
        setQuestions([]);
        await Swal.fire({
          position: "center",
          icon: "success",
          title: "Les questions et réponses ont bien été envoyées",
          showConfirmButton: false,
          heightAuto: false,
          timer: 1500,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        heightAuto: false,
        text: error.message,
      });
      console.error(error.message);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="pb-[4rem]">
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="my-6 ">
            <label
              htmlFor={`question-${questionIndex}`}
              className="font-bold mb-2"
            >
              Question {questionIndex + 1}
            </label>
            <input
              type="text"
              id={`question-${questionIndex}`}
              value={question.question}
              onChange={(e) =>
                handleChangeQuestion(questionIndex, e.target.value)
              }
              className="w-full px-4 py-2 border rounded text-black"
              placeholder="Entrez votre question"
              required
            />
            <div className="mt-4">
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={`answer-${questionIndex}-${answerIndex}`}
                    name={`correct-answer-${questionIndex}`}
                    checked={answer.correct}
                    onChange={() =>
                      handleChangeCorrectAnswer(questionIndex, answerIndex)
                    }
                    className="mr-2"
                  />
                  <input
                    type="text"
                    id={`answer-${questionIndex}-${answerIndex}`}
                    value={answer.answer}
                    onChange={(e) =>
                      handleChangeAnswer(
                        questionIndex,
                        answerIndex,
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border rounded text-black"
                    placeholder={`Réponse ${answerIndex + 1}`}
                    required
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label htmlFor={`theme-${questionIndex}`} className="font-bold mb-2">
                Thème
              </label>
              <select
                id={`theme-${questionIndex}`}
                value={question.theme}
                onChange={(e) => handleChangeTheme(questionIndex, e.target.value)}
                className="w-full px-4 py-2 border rounded text-black"
                required
              >
                <option value="">Sélectionnez un thème</option>
                {themes.map((theme) => (
                  <option className="text-black" key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter une question
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};
