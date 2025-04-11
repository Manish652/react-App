import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera, OrbitControls, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';  // Import THREE explicitly

// 3D Task Component
function Task({ position, text, completed, priority, onClick }) {
  const meshRef = useRef();
  
  // Different colors for different priorities
  const colors = {
    low: '#4ade80',
    medium: '#facc15',
    high: '#ef4444'
  };
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        scale={completed ? 0.8 : 1}
      >
        <boxGeometry args={[2, 0.4, 0.1]} />
        <meshStandardMaterial 
          color={colors[priority]} 
          emissive={colors[priority]} 
          emissiveIntensity={0.5}
          transparent={true}
          opacity={completed ? 0.5 : 0.9}
        />
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {text}
        </Text>
        {completed && (
          <group position={[0, 0, 0.06]}>
            <mesh>
              <boxGeometry args={[1.8, 0.05, 0.01]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}
      </mesh>
    </Float>
  );
}

// 3D Scene with All Tasks
function TasksScene({ tasks, toggleComplete }) {
  const gridSize = Math.ceil(Math.sqrt(tasks.length));
  const spacing = 2.5;
  
  return (
    <group>
      {tasks.map((task, index) => {
        // Calculate grid position
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = (col - gridSize / 2) * spacing;
        const y = (row - gridSize / 2) * spacing;
        
        return (
          <Task 
            key={task.id}
            position={[x, y, 0]}
            text={task.text}
            completed={task.completed}
            priority={task.priority}
            onClick={() => toggleComplete(task.id)}
          />
        );
      })}
    </group>
  );
}

// Main Component (renamed from App to TaskManager)
function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: '1', text: 'Learn React Three Fiber', completed: false, priority: 'high' },
      { id: '2', text: 'Build a 3D TODO App', completed: false, priority: 'medium' },
      { id: '3', text: 'Share with friends', completed: false, priority: 'low' }
    ];
  });
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([
        ...tasks,
        { id: uuidv4(), text: newTask, completed: false, priority }
      ]);
      setNewTask('');
    }
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">3D Task Manager</h1>
        
        {/* Add Task Form */}
        <div className="mb-8 bg-white/10 backdrop-blur-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-grow px-4 py-2 bg-white/20 rounded-md text-white placeholder-white/50 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-2 bg-white/20 rounded-md text-white outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <button 
              onClick={addTask}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 flex space-x-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors ${filter === 'all' ? 'bg-indigo-500' : 'hover:bg-white/10'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md transition-colors ${filter === 'active' ? 'bg-indigo-500' : 'hover:bg-white/10'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md transition-colors ${filter === 'completed' ? 'bg-indigo-500' : 'hover:bg-white/10'}`}
            >
              Completed
            </button>
          </div>
        </div>
        
        {/* 3D Canvas */}
        <div className="h-96 rounded-lg overflow-hidden mb-8">
          <Canvas>
            <color attach="background" args={['#0f0a1e']} />
            <fog attach="fog" args={['#0f0a1e', 5, 15]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <OrbitControls 
              enableZoom={true} 
              enablePan={true} 
              enableRotate={true}
              minDistance={4}
              maxDistance={12}
            />
            <TasksScene tasks={filteredTasks} toggleComplete={toggleComplete} />
          </Canvas>
        </div>
        
        {/* Task List (2D) */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Tasks</h2>
          <AnimatePresence>
            {filteredTasks.length === 0 ? (
              <p className="text-white/50 text-center py-4">No tasks found.</p>
            ) : (
              <ul className="space-y-2">
                {filteredTasks.map((task) => (
                  <motion.li 
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center justify-between p-4 rounded-md ${
                      task.priority === 'high' ? 'bg-red-500/20' :
                      task.priority === 'medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                    }`}
                  >
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="mr-3 h-5 w-5 rounded accent-indigo-500"
                      />
                      <span className={`${task.completed ? 'line-through text-white/50' : ''}`}>
                        {task.text}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-4">
                        {task.priority === 'high' ? '⚠️ High' : 
                         task.priority === 'medium' ? '⚡ Medium' : '🔄 Low'}
                      </span>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default TaskManager;