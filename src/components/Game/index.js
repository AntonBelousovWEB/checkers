import React from "react";
import { Checkers } from './Game';
import { useLocation, useNavigate } from "react-router-dom";

export default function Game() {
    const { state } = useLocation();
    const navigate = useNavigate();

    return (
        <div>
            <Checkers navigate={navigate} PlayersState={state} />
        </div>
    );
}