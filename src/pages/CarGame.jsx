import React, { useState, useEffect, useRef } from 'react';

const CarGame = () => {
  // Game constants
  const GAME_WIDTH = window.innerWidth;
  const GAME_HEIGHT = window.innerHeight;
  const ROAD_WIDTH = Math.min(400, GAME_WIDTH * 0.8);
  const CAR_WIDTH = 50;
  const CAR_HEIGHT = 80;
  const OBSTACLE_WIDTH = 50;
  const OBSTACLE_HEIGHT = 80;
  const LANE_COUNT = 3;
  const LANE_WIDTH = ROAD_WIDTH / LANE_COUNT;
  
  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [playerPosition, setPlayerPosition] = useState({
    x: GAME_WIDTH / 2 - CAR_WIDTH / 2,
    y: GAME_HEIGHT - CAR_HEIGHT - 20
  });
  const [obstacles, setObstacles] = useState([]);
  const [road, setRoad] = useState({ offset: 0 });
  const requestRef = useRef();
  const lastTimeRef = useRef(0);
  const obstacleTimerRef = useRef(null);
  const currentLane = useRef(1); // 0: left, 1: middle, 2: right

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameActive || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (currentLane.current > 0) {
            currentLane.current--;
            setPlayerPosition(prev => ({
              ...prev,
              x: (GAME_WIDTH - ROAD_WIDTH) / 2 + currentLane.current * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2
            }));
          }
          break;
        case 'ArrowRight':
          if (currentLane.current < LANE_COUNT - 1) {
            currentLane.current++;
            setPlayerPosition(prev => ({
              ...prev,
              x: (GAME_WIDTH - ROAD_WIDTH) / 2 + currentLane.current * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2
            }));
          }
          break;
        case 'ArrowUp':
          setSpeed(prev => Math.min(prev + 1, 10));
          break;
        case 'ArrowDown':
          setSpeed(prev => Math.max(prev - 1, 1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameActive, gameOver]);

  // Game animation loop
  const gameLoop = (time) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Update road
    setRoad(prev => ({
      offset: (prev.offset + speed) % 40
    }));

    // Update obstacles
    setObstacles(prevObstacles => 
      prevObstacles
        .map(obs => ({
          ...obs,
          y: obs.y + speed
        }))
        .filter(obs => obs.y < GAME_HEIGHT)
    );

    // Check collisions
    const collision = obstacles.some(obs => {
      const playerBox = {
        left: playerPosition.x,
        right: playerPosition.x + CAR_WIDTH,
        top: playerPosition.y,
        bottom: playerPosition.y + CAR_HEIGHT
      };
      
      const obsBox = {
        left: obs.x,
        right: obs.x + OBSTACLE_WIDTH,
        top: obs.y,
        bottom: obs.y + OBSTACLE_HEIGHT
      };

      return !(
        playerBox.right < obsBox.left ||
        playerBox.left > obsBox.right ||
        playerBox.bottom < obsBox.top ||
        playerBox.top > obsBox.bottom
      );
    });

    if (collision) {
      setGameOver(true);
      setGameActive(false);
      clearInterval(obstacleTimerRef.current);
      cancelAnimationFrame(requestRef.current);
      return;
    }

    // Update score
    setScore(prev => prev + speed / 10);

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  // Start game
  const startGame = () => {
    setGameActive(true);
    setGameOver(false);
    setScore(0);
    setSpeed(5);
    setObstacles([]);
    currentLane.current = 1;
    setPlayerPosition({
      x: (GAME_WIDTH - ROAD_WIDTH) / 2 + LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2,
      y: GAME_HEIGHT - CAR_HEIGHT - 20
    });
    
    // Spawn obstacles
    obstacleTimerRef.current = setInterval(() => {
      const lane = Math.floor(Math.random() * LANE_COUNT);
      const obstacleX = (GAME_WIDTH - ROAD_WIDTH) / 2 + lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_WIDTH) / 2;
      
      setObstacles(prev => [
        ...prev,
        {
          x: obstacleX,
          y: -OBSTACLE_HEIGHT,
          lane: lane
        }
      ]);
    }, 1500);
    
    lastTimeRef.current = 0;
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current);
      clearInterval(obstacleTimerRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900">
      {!gameActive && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10">
          <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
            <h1 className="text-4xl font-bold text-white mb-4">Car Racing Game</h1>
            <p className="text-gray-300 mb-6">Use arrow keys to move and avoid obstacles!</p>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={startGame}
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10">
          <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over!</h2>
            <p className="text-2xl text-white mb-6">Score: {Math.floor(score)}</p>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={startGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Game screen */}
      <div 
        className="relative overflow-hidden bg-gray-800"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Score display */}
        <div className="absolute top-4 left-4 z-10 text-white bg-black bg-opacity-50 p-2 rounded">
          Score: {Math.floor(score)}
        </div>

        {/* Road */}
        <div 
          className="absolute bg-gray-700"
          style={{
            width: ROAD_WIDTH,
            height: GAME_HEIGHT,
            left: (GAME_WIDTH - ROAD_WIDTH) / 2
          }}
        >
          {/* Road markings */}
          {Array.from({ length: Math.ceil(GAME_HEIGHT / 40) + 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-yellow-300"
              style={{
                width: 4,
                height: 20,
                left: ROAD_WIDTH / 2 - 2,
                top: i * 40 - road.offset
              }}
            />
          ))}
          
          {/* Lane dividers */}
          {Array.from({ length: LANE_COUNT - 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white opacity-30"
              style={{
                width: 2,
                height: GAME_HEIGHT,
                left: LANE_WIDTH * (i + 1)
              }}
            />
          ))}
        </div>

        {/* Player car */}
        <div 
          className="absolute bg-blue-500"
          style={{
            width: CAR_WIDTH,
            height: CAR_HEIGHT,
            left: playerPosition.x,
            top: playerPosition.y,
            borderRadius: 8
          }}
        >
          {/* Car details */}
          <div className="absolute bg-blue-900" style={{ width: '60%', height: '30%', left: '20%', top: '15%' }} />
          <div className="absolute bg-blue-700" style={{ width: '80%', height: '10%', left: '10%', top: '60%' }} />
          {/* Car wheels */}
          <div className="absolute bg-black" style={{ width: '20%', height: '15%', left: '10%', top: '70%' }} />
          <div className="absolute bg-black" style={{ width: '20%', height: '15%', right: '10%', top: '70%' }} />
        </div>

        {/* Obstacles */}
        {obstacles.map((obs, index) => (
          <div
            key={index}
            className="absolute bg-red-500"
            style={{
              width: OBSTACLE_WIDTH,
              height: OBSTACLE_HEIGHT,
              left: obs.x,
              top: obs.y,
              borderRadius: 8
            }}
          >
            {/* Obstacle details */}
            <div className="absolute bg-red-900" style={{ width: '60%', height: '30%', left: '20%', top: '15%' }} />
            <div className="absolute bg-red-700" style={{ width: '80%', height: '10%', left: '10%', top: '60%' }} />
            {/* Obstacle wheels */}
            <div className="absolute bg-black" style={{ width: '20%', height: '15%', left: '10%', top: '70%' }} />
            <div className="absolute bg-black" style={{ width: '20%', height: '15%', right: '10%', top: '70%' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarGame;