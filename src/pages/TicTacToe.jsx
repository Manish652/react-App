import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const boardRef = useRef();

  const handleCellClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const checkWinner = (currentBoard) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }

    if (currentBoard.every(cell => cell !== null)) {
      return 'draw';
    }

    return null;
  };

  function Board() {
    useFrame(() => {
      if (boardRef.current) {
        boardRef.current.rotation.y += 0.005;
      }
    });
  
    const cellSize = 1;
  
    return (
      <group ref={boardRef}>
        {/* Grid lines */}
        {[-1, 0, 1].map(i => (
          <mesh key={`hline-${i}`} position={[0, 0, i * cellSize]} receiveShadow>
            <boxGeometry args={[3 * cellSize, 0.1, 0.1]} />
            <meshStandardMaterial color={0x666666} />
          </mesh>
        ))}
        {[-1, 0, 1].map(i => (
          <mesh key={`vline-${i}`} position={[i * cellSize, 0, 0]} receiveShadow>
            <boxGeometry args={[0.1, 0.1, 3 * cellSize]} />
            <meshStandardMaterial color={0x666666} />
          </mesh>
        ))}
        
        {/* Board cells and markers */}
        {board.map((value, index) => {
          // Calculate the cell position properly
          const col = index % 3;          // 0, 1, 2
          const row = Math.floor(index / 3); // 0, 1, 2
          
          // Convert to coordinates: -1, 0, 1 for both x and z
          const x = col - 1;
          const z = row - 1;
          
          return (
            <group key={`cell-${index}`} position={[x * cellSize, 0, z * cellSize]}>
              {/* Clickable cell area */}
              <mesh
                userData={{ index }}
                onPointerDown={() => handleCellClick(index)}
              >
                <boxGeometry args={[cellSize * 0.9, 0.1, cellSize * 0.9]} />
                <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
              </mesh>
              
              {/* Render X or O directly in the cell position */}
              {value === 'X' && (
                <XMarker position={[0, 0.2, 0]} />
              )}
              {value === 'O' && (
                <OMarker position={[0, 0.2, 0]} />
              )}
            </group>
          );
        })}
        
        {/* Platform */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <boxGeometry args={[4 * cellSize, 0.2, 4 * cellSize]} />
          <meshStandardMaterial color={0x333333} roughness={0.7} metalness={0.3} />
        </mesh>
      </group>
    );
  }
  
  function XMarker({ position }) {
    const groupRef = useRef();
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.rotation.x += 0.02;
        groupRef.current.rotation.y += 0.02;
      }
    });
    
    
    return (
      <group position={position} ref={groupRef}>
        <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
          <meshStandardMaterial color={0xff5252} roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
          <meshStandardMaterial color={0xff5252} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
    );
  }
  
  function OMarker({ position }) {
    const meshRef = useRef();
    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.03;
        meshRef.current.rotation.x += 0.01;
      }
    });
    
    return (
      <mesh position={position} ref={meshRef} castShadow>
        <torusGeometry args={[0.25, 0.05, 16, 32]} />
        <meshStandardMaterial color={0x2196f3} roughness={0.3} metalness={0.7} />
      </mesh>
    );
  }
  
  return (
    <div className="h-screen w-full bg-gray-900 relative overflow-hidden">
      <Canvas 
        shadows
        camera={{ position: [0, 4, 6], fov: 45 }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[5, 5, 5]} 
          castShadow 
          intensity={0.8}
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <Board />
        {winner && (
          <Text 
            position={[0, 2, 0]} 
            rotation={[-Math.PI / 4, 0, 0]} 
            fontSize={0.5} 
            color="gold"
            anchorX="center"
            anchorY="middle"
          >
            {winner === 'draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
          </Text>
        )}
        <OrbitControls />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-0 right-0 text-center text-white z-10">
        <h1 className="text-2xl font-bold">3D Tic-Tac-Toe</h1>
        <p className="text-lg mt-2">
          {winner
            ? winner === 'draw'
              ? "It's a draw!"
              : `Player ${winner} wins!`
            : `Player ${currentPlayer}'s turn`}
        </p>
      </div>

      {/* Reset Button */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
        <button
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-lg font-medium"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;