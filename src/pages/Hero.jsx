import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Car, Space, Puzzle, PenTool, StickyNote, X } from 'lucide-react';

const Hero = () => {
  const games = [
    {
      title: 'Car Racing Game',
      description: 'Navigate through traffic and avoid obstacles in this exciting racing game.',
      icon: <Car className="w-8 h-8" />,
      path: '/car-game',
      color: 'bg-blue-500'
    },
    {
      title: 'Space Shooter',
      description: 'Defend your ship against incoming asteroids in this action-packed space adventure.',
      icon: <Space className="w-8 h-8" />,
      path: '/space-game',
      color: 'bg-purple-500'
    },
    {
      title: 'Puzzle Game',
      description: 'Test your brain with challenging puzzles and patterns.',
      icon: <Puzzle className="w-8 h-8" />,
      path: '/puzzle-game',
      color: 'bg-green-500'
    },
    {
      title: 'Drawing App',
      description: 'Unleash your creativity with this digital drawing canvas.',
      icon: <PenTool className="w-8 h-8" />,
      path: '/drawing',
      color: 'bg-pink-500'
    },
    {
      title: 'Note Taking App',
      description: 'Organize your thoughts with this simple and effective note-taking app.',
      icon: <StickyNote className="w-8 h-8" />,
      path: '/notes',
      color: 'bg-yellow-500'
    },
    {
      title: 'Tic Tac Toe',
      description: 'Play the classic game of Xs and Os with a modern twist.',
      icon: <X className="w-8 h-8" />,
      path: '/tic-tac-toe',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Game Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Welcome to our collection of interactive games and apps. Choose your adventure and start playing!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <Link
              key={index}
              to={game.path}
              className={`group relative overflow-hidden rounded-lg p-6 transition-all duration-300 hover:scale-105 ${game.color} hover:shadow-xl`}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
              <div className="relative z-10">
                <div className="mb-4 text-white group-hover:text-white transition-colors duration-300">
                  {game.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
                <p className="text-white text-opacity-90">{game.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400">
          <p>© 2024 Game Hub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
