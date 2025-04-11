import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Gamepad2 className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Game Hub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/car-game"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              Car Game
            </Link>
            <Link
              to="/puzzle-game"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              Puzzle Game
            </Link>
            <Link
              to="/drawing"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              Drawing
            </Link>
            <Link
              to="/notes"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              Notes
            </Link>
            <Link
              to="/tic-tac-toe"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              Tic Tac Toe
            </Link>
            <Link
              to="/rock-paper-scissors"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              Rock Paper Scissors
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300 hover:text-cyan-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
