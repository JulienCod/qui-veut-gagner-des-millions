import React from "react";

export default function Game ({ onGameActiveChange }){
    const handleGameActiveChange = () => {
        onGameActiveChange(true);
    };
    return(
        <>
            <div>
                <button onClick={handleGameActiveChange}>Activer le jeu</button>
            </div>
            Zone de jeux
        </>
    )
}