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
  return (
    <>
      <div className="h-1/2 relative">
        <div
          className="w-20 h-20 rounded-full border-4 border-white flex items-center
                                             justify-center absolute bottom-[70px] left-[80px] text-3xl font-bold"
        >
          <Timer
            setTimeOut={setTimeOut}
            questionNumber={questionNumber}
            level={45}
            selectAnswer={selectAnswer}
            stop={stop}
          />
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
