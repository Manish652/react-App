import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);

  const choices = [
    { id: 'rock', name: 'Rock', emoji: '✊', beats: 'scissors' },
    { id: 'paper', name: 'Paper', emoji: '✋', beats: 'rock' },
    { id: 'scissors', name: 'Scissors', emoji: '✌️', beats: 'paper' }
  ];

  const getRandomChoice = () => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (player, computer) => {
    if (player.beats === computer.id) {
      return 'You Win!';
    } else if (computer.beats === player.id) {
      return 'Computer Wins!';
    } else {
      return "It's a Tie!";
    }
  };

  const handleChoice = (choice) => {
    setPlayerChoice(choice);
    setShowResult(false);
    
    // Add a small delay for better UX
    setTimeout(() => {
      const computer = getRandomChoice();
      setComputerChoice(computer);
      const gameResult = determineWinner(choice, computer);
      setResult(gameResult);
      
      if (gameResult === 'You Win!') {
        setScore(prev => prev + 1);
      } else if (gameResult === 'Computer Wins!') {
        setScore(prev => Math.max(0, prev - 1));
      }

      setGameHistory(prev => [
        {
          player: choice,
          computer,
          result: gameResult,
          timestamp: new Date()
        },
        ...prev.slice(0, 4)
      ]);
      
      setShowResult(true);
    }, 500);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Rock Paper Scissors</h1>
          <p className="text-xl text-gray-400">Choose your move!</p>
          <div className="text-2xl font-bold mt-4">
            Score: <span className="text-cyan-400">{score}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Game Area */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-center space-x-4 mb-8">
              {choices.map((choice) => (
                <motion.button
                  key={choice.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChoice(choice)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl
                    ${playerChoice?.id === choice.id 
                      ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' 
                      : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {choice.emoji}
                </motion.button>
              ))}
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">You</h3>
                <motion.div
                  className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-5xl"
                  animate={{ scale: showResult ? 1 : 0.8 }}
                >
                  {playerChoice?.emoji || '❓'}
                </motion.div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Computer</h3>
                <motion.div
                  className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-5xl"
                  animate={{ scale: showResult ? 1 : 0.8 }}
                >
                  {showResult ? computerChoice?.emoji : '❓'}
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <h2 className={`text-2xl font-bold mb-4 ${
                    result === 'You Win!' ? 'text-green-400' :
                    result === 'Computer Wins!' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {result}
                  </h2>
                  <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Game History */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Recent Games</h2>
            <div className="space-y-4">
              {gameHistory.map((game, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{game.player.emoji}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-2xl">{game.computer.emoji}</span>
                  </div>
                  <span className={`font-semibold ${
                    game.result === 'You Win!' ? 'text-green-400' :
                    game.result === 'Computer Wins!' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {game.result}
                  </span>
                </motion.div>
              ))}
              {gameHistory.length === 0 && (
                <p className="text-gray-400 text-center">No games played yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissors; 