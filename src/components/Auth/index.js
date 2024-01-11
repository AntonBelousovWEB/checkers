import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate ();

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [player1Avatar, setPlayer1Avatar] = useState(null);
  const [player2Avatar, setPlayer2Avatar] = useState(null);

  const startGame = (event) => {
    event.preventDefault();

    if (player1Name && player2Name) {
      navigate('/game', {
        state: {
            player1: { name: player1Name, avatar: player1Avatar },
            player2: { name: player2Name, avatar: player2Avatar },
        }
      });
    } else {
      alert("Пожалуйста, введите имена для обоих игроков");
    }
  };

  return (
    <div>
      <form onSubmit={startGame}>
        <div className="auth_forms">
          <div>
            <label htmlFor="avatar">Игрок 1:</label>
            <div className="player_form">
              <input
                type="text"
                placeholder="Введите имя игрока*"
                value={player1Name}
                onChange={e => setPlayer1Name(e.target.value)}
                required
              />
              <div className="file_form">
                <label htmlFor="avatar">Выбрать аватар игрока:</label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"
                  onChange={e => setPlayer1Avatar(e.target.files[0])}
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="avatar">Игрок 2:</label>
            <div className="player_form">
              <input
                type="text"
                placeholder="Введите имя игрока*"
                value={player2Name}
                onChange={e => setPlayer2Name(e.target.value)}
                required
              />
              <div className="file_form">
                <label htmlFor="avatar">Выбрать аватар игрока:</label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"
                  onChange={e => setPlayer2Avatar(e.target.files[0])}
                />
              </div>
            </div>
          </div>
          <button className="start_game" type="submit">
            Начать!
          </button>
        </div>
      </form>
    </div>
  );
}