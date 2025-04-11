import React, { useState, useRef, useEffect } from 'react';

const NoteApp = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [toolType, setToolType] = useState('pen'); // pen, highlighter, eraser
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ title: 'Untitled Note', content: [] });
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    
    context.lineTo(offsetX, offsetY);
    context.strokeStyle = toolType === 'highlighter' ? `${color}80` : color;
    context.lineWidth = toolType === 'highlighter' ? size * 2 : size;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    if (toolType === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
    } else {
      context.globalCompositeOperation = 'source-over';
    }
    
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveNote = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');
    
    const updatedNote = {
      ...currentNote,
      content: [...currentNote.content, imageData],
      lastEdited: new Date().toLocaleString()
    };
    
    setNotes([...notes, updatedNote]);
    setCurrentNote({ title: 'Untitled Note', content: [] });
    clearCanvas();
  };

  const predefinedColors = [
    '#000000', '#FF0000', '#0000FF', '#008000', 
    '#FFA500', '#800080', '#FFC0CB', '#A52A2A'
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">StudyNotes</h1>
          <div className="flex space-x-2">
            <input 
              type="text"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
              className="bg-blue-700 text-white px-2 py-1 rounded"
              placeholder="Note title"
            />
            <button 
              onClick={saveNote}
              className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </header>
      
      {/* Toolbar */}
      <div className="bg-white p-2 shadow-md flex items-center space-x-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => setToolType('pen')}
            className={`p-2 rounded ${toolType === 'pen' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
          >
            ✏️ Pen
          </button>
          <button 
            onClick={() => setToolType('highlighter')}
            className={`p-2 rounded ${toolType === 'highlighter' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
          >
            🖌️ Highlighter
          </button>
          <button 
            onClick={() => setToolType('eraser')}
            className={`p-2 rounded ${toolType === 'eraser' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
          >
            🧽 Eraser
          </button>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded bg-gray-100 flex items-center"
          >
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: color }}
            ></div>
            Color
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-2 z-10">
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((c) => (
                  <div 
                    key={c}
                    className="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
                    style={{ backgroundColor: c }}
                    onClick={() => {
                      setColor(c);
                      setShowColorPicker(false);
                    }}
                  ></div>
                ))}
              </div>
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-2 w-full"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span>Size:</span>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-24"
          />
          <span>{size}px</span>
        </div>

        <button 
          onClick={clearCanvas}
          className="p-2 rounded bg-red-100 text-red-600"
        >
          Clear
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas for drawing */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="bg-white rounded-lg shadow-md h-full p-2 overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full border border-gray-200 rounded cursor-crosshair"
              style={{ touchAction: 'none' }}
            />
          </div>
        </div>

        {/* Saved notes sidebar */}
        <div className="w-64 bg-gray-50 p-4 shadow-inner overflow-y-auto">
          <h3 className="font-bold mb-4">Saved Notes</h3>
          {notes.length === 0 ? (
            <p className="text-gray-500">No saved notes yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note, index) => (
                <div key={index} className="bg-white p-2 rounded shadow">
                  <h4 className="font-medium text-blue-600">{note.title}</h4>
                  <p className="text-xs text-gray-500">{note.lastEdited}</p>
                  {note.content.length > 0 && (
                    <div className="mt-2 h-20 overflow-hidden">
                      <img 
                        src={note.content[0]} 
                        alt="Note preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteApp;