import React, { useState } from "react";
import FormQuestionsAnswers from "../../components/admin/formQuestionsAnswers";
import FormTheme from "../../components/admin/formTheme";

export default function Admin() {
  const [addTheme, setAddTheme] = useState(false);
  const [addQuestion, setAddQuestion] = useState(false);

  const theme = () => {
    setAddQuestion(false);
    setAddTheme(true);
  };

  const question = () => {
    setAddTheme(false);
    setAddQuestion(true);
  };

  return (
    <>
      <div className=" text-center h-full bg-blue-900 text-white">
        <h1>Administration</h1>
        <div className="flex justify-center">
          <div className="p-4">
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={theme}>Ajouter un thème</button>
          </div>
          <div className="p-4">
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={question}>
              Ajouter des questions avec des réponses
            </button>
          </div>
        </div>
      </div>
      <section className=" bg-blue-900 text-white px-4 py-10">
        {addTheme && (
          <>
            <FormTheme />
          </>
        )}
        {addQuestion && <FormQuestionsAnswers />}
      </section>
    </>
  );
}
