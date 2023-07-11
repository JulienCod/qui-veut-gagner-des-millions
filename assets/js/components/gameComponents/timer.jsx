import {useEffect, useState} from "react";
import useSound from "use-sound";

export default function Timer({setTimeOut, questionNumber, level, selectAnswer, stop}){
    const [timer, setTimer] = useState(level);
    const [wrongAnswer] = useSound( '../sounds/wrong.mp3');

    useEffect(() => {
        if(!selectAnswer){
            if (timer === 0) {
                stop();
                wrongAnswer();
                return setTimeOut(true);
            }
        }
        if (selectAnswer && timer === 0){
            return () => clearInterval(interval);
        }
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        },1000);
        return () => clearInterval(interval);
    }, [timer, setTimeOut]);

    useEffect(() => {
        setTimer(level);
    },[questionNumber]);
    return timer;
}