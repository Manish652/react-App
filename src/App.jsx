import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hero from './pages/Hero';
import CarGame from './pages/CarGame';
import PuzGame from './pages/PuzGame';
import DrawingApp from './pages/DrawingApp';
import SimpleNoteApp from './pages/SimpleNoteApp';
import TicTacToe from './pages/TicTacToe';
import RockPaperScissors from './pages/RockPaperScissors';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/car-game" element={<CarGame />} />
        <Route path="/puzzle-game" element={<PuzGame />} />
        <Route path="/drawing" element={<DrawingApp />} />
        <Route path="/notes" element={<SimpleNoteApp />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
      </Routes>
    </div>
  );
}

export default App;
