import React from "react";
import { useLocation } from "react-router-dom";

export default function Result() {
    const { state } = useLocation();
    const { player1, player2, points } = state;

    const calculateResult = () => {
        switch (points) {
            case 'player1pieces' || "player1moves":
                return {
                    player1: "Победа",
                    player2: "Проигрышь"
                };
            case 'player2pieces' || "player2moves":
                return {
                    player1: "Проигрышь",
                    player2: "Победа"
                };
            default:
                return {
                    player1: "Ничья",
                    player2: "Ничья"
                };
        }
    };

    return (
        <div className="table_result">
            <h1>Результаты:</h1>
            <div>
                <h2>Игрок 1:</h2>
                <p>Имя: {player1.player1Exists.name}</p>
                {player1.player1Exists.avatar && (
                    <img
                        src={URL.createObjectURL(player1.player1Exists.avatar)}
                        alt={`${player1.player1Exists.name}'s avatar`}
                    />
                )}
                <p>Результат: {calculateResult().player1}</p>
            </div>
            <div>
                <h2>Игрок 2:</h2>
                <p>Имя: {player2.player2Exists.name}</p>
                {player2.player2Exists.avatar && (
                    <img
                        src={URL.createObjectURL(player2.player2Exists.avatar)}
                        alt={`${player2.player2Exists.name}'s avatar`}
                    />
                )}
                <p>Результат: {calculateResult().player2}</p>
            </div>
        </div>
    );
}