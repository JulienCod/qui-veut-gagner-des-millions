import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import Timer from "./timer";

export default function Board({
  data,
  questionNumber,
  setQuestionNumber,
  setTimeOut,
}) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState("answer");
  const [selectAnswer, setSelectAnswer] = useState(false);
  const [letsPlay] = useSound("../sounds/play.mp3");
  const [correctAnswer] = useSound("../sounds/correct.mp3");
  const [wrongAnswer] = useSound("../sounds/wrong.mp3");
  const [wait, { stop }] = useSound("../sounds/wait.mp3");
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [callAFriendUsed, setCallAFriendUsed] = useState(false);
  const [voteOfPublicUsed, setVoteOfPublicUsed] = useState(false);

  useEffect(() => {
    letsPlay();
  }, [letsPlay]);

  useEffect(() => {
    wait();
  }, [wait, questionNumber]);

  useEffect(() => {
    setQuestion(data[questionNumber - 1]);
  }, [data, questionNumber]);

  const delay = (duration, callback) => {
    setTimeout(() => {
      callback();
    }, duration);
  };

  const handleClick = (a) => {
    setSelectedAnswer(a);
    setClassName(
      "min-w-[calc(50%-2rem)] flex-1 p-5 m-4 bg-gradient-to-b from-purple-900" +
        " to-indigo-900 border border-white rounded-lg font-light text-lg cursor-pointer transition-colors" +
        " duration-300 hover:bg-blue-500 active:bg-blue-500"
    );

    setSelectAnswer(true);
    delay(3000, () => {
      setClassName(
        a.correct
          ? "animate-correct min-w-[calc(50%-2rem)] flex-1 p-5 m-4 " +
              " bg-gradient-to-b from-[#0a0122] to-[#1b063d] border border-white rounded-lg" +
              " font-light text-lg cursor-pointer hover:bg-mediumblue"
          : "animate-wrong min-w-[calc(50%-2rem)] flex-1 p-5 m-4 " +
              " bg-gradient-to-b from-[#0a0122] to-[#1b063d] border border-white rounded-lg" +
              " font-light text-lg cursor-pointer hover:bg-mediumblue"
      );
    });

    delay(5000, () => {
      if (a.correct) {
        correctAnswer();
        stop();
        delay(1000, () => {
          setQuestionNumber((prev) => prev + 1);
          if (questionNumber === 15) {
            setTimeOut(true);
          }
          setSelectedAnswer(null);
          setSelectAnswer(false);
        });
      } else {
        wrongAnswer();
        stop();
        delay(1000, () => {
          setTimeOut(true);
        });
      }
    });
  };

  // joker 50/50
  const applyFiftyFifty = () => {
    if (question) {
      const shuffledAnswers = question.answers.sort(() => 0.5 - Math.random());
      const correctAnswerIndex = shuffledAnswers.findIndex(
        (answer) => answer.correct
      );
      const remainingAnswers = [
        shuffledAnswers[correctAnswerIndex],
        shuffledAnswers.find(
          (answer, index) => index !== correctAnswerIndex && !answer.correct
        ),
      ];
      setQuestion((prevQuestion) => ({
        ...prevQuestion,
        answers: remainingAnswers,
        fiftyFiftyUsed: true,
      }));
      setFiftyFiftyUsed(true);
    }
  };

  // joker appel à un ami
  const callAFriend = () => {
    if (question) {
      const correctAnswer = question.answers.find((answer) => answer.correct);
      const randomDelay = Math.floor(Math.random() * 3000) + 1000; // Temps aléatoire entre 1 et 4 secondes pour la réponse de l'ami
      delay(randomDelay, () => {
        setSelectedAnswer(correctAnswer);
        setSelectAnswer(true);
        delay(2000, () => {
          setSelectedAnswer(null);
          setSelectAnswer(false);
        });
      });
      setCallAFriendUsed(true);
    }
  };

  // joker vote du public
  const voteOfPublic = () => {
    if (question) {
      // sélectionne les réponses disponibles (non éliminées par le 50/50)
      const availableAnswers = question.answers.filter(
        (answer) => !answer.eliminated
      );

      // calcul le total des votes pour les réponses incorrectes
      let totalVotesIncorrect = 0;
      availableAnswers.forEach((answer) => {
        if (!answer.correct) {
          const votes = Math.floor(Math.random() * 50) + 1; // Vote aléatoire entre 1 et 50 pour les réponses incorrectes
          answer.votes = votes;
          totalVotesIncorrect += votes;
        }
      });

      // calcul le total des votes pour la bonne réponse (en attribuant un pourcentage plus élevé)
      const correctAnswer = availableAnswers.find((answer) => answer.correct);
      const votesCorrect = Math.floor(Math.random() * 100) + 50; // Vote aléatoire entre 50 et 100 pour la bonne réponse
      correctAnswer.votes = votesCorrect;

      // calcul le total des votes pour toutes les réponses
      const totalVotes = totalVotesIncorrect + votesCorrect;

      // mettre à jour le pourcentage de chaque réponse en fonction du total des votes
      availableAnswers.forEach((answer) => {
        answer.percentage = ((answer.votes / totalVotes) * 100).toFixed(1);
      });

      // défini les réponses sélectionnées (pour la mise en évidence dans l'interface utilisateur)
      setSelectedAnswer(null);
      setSelectAnswer(false);
      setVoteOfPublicUsed(true);
    }
  };

  return (
    <>
      <div className="relative h-1/2 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-auto md:flex-1 md:pr-4">
          <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center absolute bottom-[70px] left-[80px] text-3xl font-bold">
            <Timer
              setTimeOut={setTimeOut}
              questionNumber={questionNumber}
              level={45}
              selectAnswer={selectAnswer}
              stop={stop}
            />
          </div>
        </div>

        {/* Boutons jokers à droite (occupera 2/3 de l'espace en version mobile) */}
        <div className="w-full md:w-auto md:flex-1 md:flex md:justify-end md:items-center">
          <div className="flex flex-col md:flex-row md:gap-2">
            {!fiftyFiftyUsed && (
              <button
                onClick={applyFiftyFifty}
                disabled={fiftyFiftyUsed}
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                50/50
              </button>
            )}
            {!callAFriendUsed && (
              <button
                onClick={callAFriend}
                disabled={callAFriendUsed}
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 md:mt-0"
              >
                Appel à un ami
              </button>
            )}
            {!voteOfPublicUsed && (
              <button
                onClick={voteOfPublic}
                disabled={voteOfPublicUsed}
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 md:mt-0"
              >
                Vote du public
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-1/2">
        <div className="h-full flex flex-col items-center justify-around gap-5">
          <div
            className="w-80 bg-gradient-to-b  from-[#10053e] to-[#020009] text-center p-5 rounded-lg
                    border-2 border-white text-xl"
          >
            {question?.question}
          </div>
          <div className="w-full flex justify-center flex-wrap ">
            {question?.answers.map((a, index) => (
              <div
                key={index}
                className={
                  selectedAnswer === a
                    ? className
                    : "min-w-[calc(50%-2rem)] flex-1 p-5 m-4 " +
                      " bg-gradient-to-b from-[#0a0122] to-[#1b063d] border border-white rounded-lg" +
                      " font-light text-lg cursor-pointer hover:bg-mediumblue "
                }
                onClick={() => !selectedAnswer && handleClick(a)}
              >
                <span className="text-orange-500">
                  {String.fromCharCode(65 + index)}:
                </span>{" "}
                &emsp; <span>{a.answer}</span>
                {a.selected && selectAnswer && <span>&nbsp;&lt; Ami</span>}
                {a.percentage && <span>&nbsp;({a.percentage}%)</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
