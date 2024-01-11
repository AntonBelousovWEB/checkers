import React from "react";
import Auth from "../components/Auth";
import Game from '../components/Game';
import Result from "../components/Result";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Root() {
  return (
    <Router>  
        <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/game" element={<Game />} />
            <Route path="/result" element={<Result />} />
        </Routes>
    </Router>
  )
}

export default Root;