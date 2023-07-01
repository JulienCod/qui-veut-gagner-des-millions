import React, {useEffect, useMemo, useState} from "react";
import Board from "./gameComponents/board";


export default function Game ({ onGameActiveChange }){
    const [start, setStart] = useState(false);
    const [timeOut, setTimeOut] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [earned, setEarned] = useState("0 €");
    const data = [
        {
            id: 1,
            question: "Quelle est la capitale de la France ?",
            answers: [
                {
                    id: 1,
                    text: "Paris",
                    correct: true,
                },
                {
                    id: 2,
                    text: "Londres",
                    correct: false,
                },
                {
                    id: 3,
                    text: "Rome",
                    correct: false,
                },
                {
                    id: 4,
                    text: "Berlin",
                    correct: false,
                },
            ],
        },
        {
            id: 2,
            question: "Qui a peint la Joconde ?",
            answers: [
                {
                    id: 5,
                    text: "Leonardo da Vinci",
                    correct: true,
                },
                {
                    id: 6,
                    text: "Pablo Picasso",
                    correct: false,
                },
                {
                    id: 7,
                    text: "Vincent van Gogh",
                    correct: false,
                },
                {
                    id: 8,
                    text: "Michel-Ange",
                    correct: false,
                },
            ],
        },
        {
            id: 3,
            question: "Quel est l'animal le plus rapide du monde ?",
            answers: [
                {
                    id: 9,
                    text: "Tigre",
                    correct: false,
                },
                {
                    id: 10,
                    text: "Gazelle",
                    correct: false,
                },
                {
                    id: 11,
                    text: "Lion",
                    correct: false,
                },
                {
                    id: 12,
                    text: "Guépard",
                    correct: true,
                },
            ],
        },
        {
            id: 4,
            question: "Quel est l'océan le plus grand du monde ?",
            answers: [
                {
                    id: 13,
                    text: "Océan Atlantique",
                    correct: false,
                },
                {
                    id: 14,
                    text: "Océan Pacifique",
                    correct: true,
                },
                {
                    id: 15,
                    text: "Océan Indien",
                    correct: false,
                },
                {
                    id: 16,
                    text: "Océan Arctique",
                    correct: false,
                },
            ],
        },
        {
            id: 5,
            question: "Quel est le plus grand pays du monde en termes de superficie ?",
            answers: [
                {
                    id: 17,
                    text: "Russie",
                    correct: true,
                },
                {
                    id: 18,
                    text: "Canada",
                    correct: false,
                },
                {
                    id: 19,
                    text: "Chine",
                    correct: false,
                },
                {
                    id: 20,
                    text: "États-Unis",
                    correct: false,
                },
            ],
        },
        {
            id: 6,
            question: "Quel est l'inventeur de la théorie de la relativité ?",
            answers: [
                {
                    id: 21,
                    text: "Isaac Newton",
                    correct: false,
                },
                {
                    id: 22,
                    text: "Albert Einstein",
                    correct: true,
                },
                {
                    id: 23,
                    text: "Nikola Tesla",
                    correct: false,
                },
                {
                    id: 24,
                    text: "Thomas Edison",
                    correct: false,
                },
            ],
        },
        {
            id: 7,
            question: "Quelle est la capitale de l'Australie ?",
            answers: [
                {
                    id: 25,
                    text: "Sydney",
                    correct: false,
                },
                {
                    id: 26,
                    text: "Melbourne",
                    correct: false,
                },
                {
                    id: 27,
                    text: "Canberra",
                    correct: true,
                },
                {
                    id: 28,
                    text: "Perth",
                    correct: false,
                },
            ],
        },
        {
            id: 8,
            question: "Quelle est la plus haute montagne du monde ?",
            answers: [
                {
                    id: 29,
                    text: "Mont Everest",
                    correct: true,
                },
                {
                    id: 30,
                    text: "Mont K2",
                    correct: false,
                },
                {
                    id: 31,
                    text: "Mont Kilimandjaro",
                    correct: false,
                },
                {
                    id: 32,
                    text: "Mont Denali",
                    correct: false,
                },
            ],
        },
        {
            id: 9,
            question: "Quel est le symbole chimique de l'or ?",
            answers: [
                {
                    id: 33,
                    text: "Ag",
                    correct: false,
                },
                {
                    id: 34,
                    text: "Au",
                    correct: true,
                },
                {
                    id: 35,
                    text: "Cu",
                    correct: false,
                },
                {
                    id: 36,
                    text: "Fe",
                    correct: false,
                },
            ],
        },
        {
            id: 10,
            question: "Quel est le pays d'origine des pâtes ?",
            answers: [
                {
                    id: 37,
                    text: "France",
                    correct: false,
                },
                {
                    id: 38,
                    text: "Italie",
                    correct: true,
                },
                {
                    id: 39,
                    text: "Espagne",
                    correct: false,
                },
                {
                    id: 40,
                    text: "Chine",
                    correct: false,
                },
            ],
        },
        {
            id: 11,
            question: "Quel est l'élément chimique de symbole Hg ?",
            answers: [
                {
                    id: 41,
                    text: "Hydrogène",
                    correct: false,
                },
                {
                    id: 42,
                    text: "Hélium",
                    correct: false,
                },
                {
                    id: 43,
                    text: "Mercure",
                    correct: true,
                },
                {
                    id: 44,
                    text: "Argent",
                    correct: false,
                },
            ],
        },
        {
            id: 12,
            question: "Quel est le symbole chimique du sodium ?",
            answers: [
                {
                    id: 45,
                    text: "Na",
                    correct: true,
                },
                {
                    id: 46,
                    text: "So",
                    correct: false,
                },
                {
                    id: 47,
                    text: "K",
                    correct: false,
                },
                {
                    id: 48,
                    text: "Mg",
                    correct: false,
                },
            ],
        },
        {
            id: 13,
            question: "Quel est le pays d'origine du jeu de football ?",
            answers: [
                {
                    id: 49,
                    text: "Brésil",
                    correct: false,
                },
                {
                    id: 50,
                    text: "Italie",
                    correct: false,
                },
                {
                    id: 51,
                    text: "Angleterre",
                    correct: true,
                },
                {
                    id: 52,
                    text: "France",
                    correct: false,
                },
            ],
        },
        {
            id: 14,
            question: "Quel est l'élément le plus abondant dans l'atmosphère terrestre ?",
            answers: [
                {
                    id: 53,
                    text: "Azote",
                    correct: true,
                },
                {
                    id: 54,
                    text: "Oxygène",
                    correct: false,
                },
                {
                    id: 55,
                    text: "Argon",
                    correct: false,
                },
                {
                    id: 56,
                    text: "Dioxyde de carbone",
                    correct: false,
                },
            ],
        },
        {
            id: 15,
            question: "Quel est le pays le plus peuplé du monde ?",
            answers: [
                {
                    id: 57,
                    text: "Chine",
                    correct: true,
                },
                {
                    id: 58,
                    text: "Inde",
                    correct: false,
                },
                {
                    id: 59,
                    text: "États-Unis",
                    correct: false,
                },
                {
                    id: 60,
                    text: "Brésil",
                    correct: false,
                },
            ],
        },
    ];

    const moneyPyramid = useMemo(
        () =>
            [
                { id: 1, amount: "100 €" },
                { id: 2, amount: "200 €" },
                { id: 3, amount: "300 €" },
                { id: 4, amount: "500 €" },
                { id: 5, amount: "1.000 €",bearing: true  },
                { id: 6, amount: "2.000 €" },
                { id: 7, amount: "4.000 €" },
                { id: 8, amount: "8.000 €" },
                { id: 9, amount: "16.000 €" },
                { id: 10, amount: "32.000 €",bearing: true },
                { id: 11, amount: "64.000 €" },
                { id: 12, amount: "125.000 €" },
                { id: 13, amount: "250.000 €" },
                { id: 14, amount: "500.000 €" },
                { id: 15, amount: "1.000.000 €",bearing: true },
            ].reverse(),
        []
    );

    useEffect(() => {
        questionNumber > 1 &&
        setEarned(moneyPyramid.find((m) => m.id === questionNumber - 1).amount);
    }, [questionNumber, moneyPyramid]);
    const handleGameActiveChange = () => {
        onGameActiveChange(true);
        setStart(true);
    };

    return(
        <section className="h-[100vh] flex text-white ">
            {start ?
                (
                    <>
                        <div className="w-3/4 bg-gradient-to-b from-transparent to-black
                         bg-no-repeat bg-cover bg-center flex flex-col">
                            {timeOut ? (
                                <h1 className="relative inset-0 m-auto">Vous avez gagné: {earned}</h1>
                            ) : (
                                <>
                                    <div className="h-[100%]">
                                        <Board
                                            data={data}
                                            questionNumber={questionNumber}
                                            setQuestionNumber={setQuestionNumber}
                                            setTimeOut={setTimeOut}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="w-1/4 bg-[#04001b] flex items-center justify-center border-l-4 border-white">
                            <ul className="p-[20px] list-none w-full">
                                {moneyPyramid.map((m) => (
                                    <li
                                        key={m.id}
                                        className={
                                            questionNumber === m.id
                                                ? "text-black flex items-center p-[5px] rounded-md bg-orange-500"
                                                : m.bearing ?
                                                    "text-white flex items-center p-[5px] rounded-md"
                                                :
                                                    "text-orange-500 flex items-center p-[5px] rounded-md"
                                        }
                                    >
                                        <span className="w-[30%] text-base font-thin">{m.id}</span>
                                        <span className="text-lg font-light">{m.amount}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )
                :
                (<div>
                    <button onClick={handleGameActiveChange}>Commencer une nouvelle partie</button>
                </div>)}
        </section>
    )
}