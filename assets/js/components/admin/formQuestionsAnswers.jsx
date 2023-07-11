import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import AuthApi from "../../services/authApi";

export default function FormQuestionsAnswers(){
    const [questions, setQuestions] = useState([
        { question: '', answers: ['', '', '', ''], correctAnswer: 0, theme: '' },
    ]);

    const [themes,setThemes] = useState([]);
    const [token] = useState(AuthApi.getToken());


    useEffect(()=>{
        dataTheme();
    },[]);
    // récupération des themes en base de données
    const dataTheme = async ()=>{
        try {
            const response = await fetch("/api/theme/getAll", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,

                },
            });

            if (!response.ok) {
                throw new Error("Une erreur est survenue lors de la récupération des thèmes.");
            }

            const data = await response.json();

            setThemes(data.themes);

            // Traitez les données ici selon vos besoins
        } catch (error) {
            console.error(error);
        }
    }
    const addQuestion = () => {
        setQuestions((prevQuestions) => [
            ...prevQuestions,
            { question: '', answers: ['', '', '', ''], correctAnswer: 0, theme: '' },
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
            updatedQuestions[questionIndex].answers[answerIndex] = value;
            return updatedQuestions;
        });
    };

    const handleChangeCorrectAnswer = (questionIndex, answerIndex) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[questionIndex].correctAnswer = answerIndex;
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
            const response = await fetch('/api/questions/ajout', {
                method: ["POST"],
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(questions)
            })
            const data = await response.json();
            if (response.ok){
                setQuestions([]);
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Les questions et réponses ont bien étaient envoyé',
                    showConfirmButton: false,
                    heightAuto:false,
                    timer: 1500
                })
            }
            // Envoyer les questions et réponses au serveur
            console.log(questions);
        }catch (error){
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                heightAuto:false,
                text: error.message
            })
            console.error(error.message);
        }
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="pb-[4rem]">
                {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="my-6 ">
                        <label htmlFor={`question-${questionIndex}`} className="font-bold mb-2">
                            Question {questionIndex + 1}
                        </label>
                        <input
                            type="text"
                            id={`question-${questionIndex}`}
                            value={question.question}
                            onChange={(e) => handleChangeQuestion(questionIndex, e.target.value)}
                            className="w-full px-4 py-2 border rounded"
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
                                        checked={question.correctAnswer === answerIndex}
                                        onChange={() => handleChangeCorrectAnswer(questionIndex, answerIndex)}
                                        className="mr-2"
                                    />
                                    <input
                                        type="text"
                                        id={`answer-${questionIndex}-${answerIndex}`}
                                        value={answer}
                                        onChange={(e) => handleChangeAnswer(questionIndex, answerIndex, e.target.value)}
                                        className="w-full px-4 py-2 border rounded"
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
                                className="w-full px-4 py-2 border rounded"
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