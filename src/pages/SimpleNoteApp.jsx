import React, { useState, useEffect } from 'react';
import { Download, Trash2, Plus, Moon, Sun, Edit3, Check } from 'lucide-react';

const SimpleNoteApp = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('simpleNotes');
    return savedNotes ? JSON.parse(savedNotes) : [
      { 
        id: 1, 
        title: 'Welcome Note', 
        content: 'Welcome to SimpleNotes! This is your first note.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });
  
  const [activeNote, setActiveNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem('simpleNotes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (notes.length > 0 && !activeNote) {
      setActiveNote(notes[0]);
    }
  }, [notes, activeNote]);

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setEditMode(true);
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    if (activeNote?.id === id) {
      setActiveNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
    }
  };

  const updateNote = (field, value) => {
    if (!activeNote) return;
    
    const updatedNote = {
      ...activeNote,
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    
    setActiveNote(updatedNote);
    setNotes(notes.map(note => 
      note.id === activeNote.id ? updatedNote : note
    ));
  };

  const downloadNote = () => {
    if (!activeNote) return;
    
    const noteText = `# ${activeNote.title}\n\n${activeNote.content}`;
    
    const blob = new Blob([noteText], { type: 'text/markdown' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = `${activeNote.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="w-64 border-r dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 transition-colors duration-200">
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <h1 className="text-lg font-bold dark:text-white">SimpleNotes</h1>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {darkMode ? <Sun size={18} className="text-gray-200" /> : <Moon size={18} />}
          </button>
        </div>
        
        <div className="p-4">
          <button 
            onClick={createNewNote}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" />
            New Note
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {notes.length > 0 ? (
            <div className="space-y-1">
              {notes.map(note => (
                <div 
                  key={note.id}
                  className={`p-3 flex justify-between group cursor-pointer ${activeNote?.id === note.id ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} dark:text-white transition-colors duration-200`}
                  onClick={() => {setActiveNote(note); setEditMode(false);}}
                >
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                      {note.content.substring(0, 40)}
                      {note.content.length > 40 ? '...' : ''}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Delete note"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-500 dark:text-gray-400">
              No notes yet
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {activeNote ? (
          <>
            <div className="p-4 flex items-center justify-between border-b dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
              {editMode ? (
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote('title', e.target.value)}
                  className="text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  autoFocus
                />
              ) : (
                <h2 className="text-lg font-medium dark:text-white">{activeNote.title}</h2>
              )}
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setEditMode(!editMode)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 dark:text-white"
                  title={editMode ? "Save" : "Edit"}
                >
                  {editMode ? <Check size={18} /> : <Edit3 size={18} />}
                </button>
                
                <button 
                  onClick={downloadNote}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 dark:text-white"
                  title="Download note"
                >
                  <Download size={18} />
                </button>
                
                <button 
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors duration-200"
                  title="Delete note"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-auto">
              {editMode ? (
                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote('content', e.target.value)}
                  className="w-full h-full p-4 focus:outline-none resize-none bg-white dark:bg-gray-800 dark:text-white rounded shadow-sm border dark:border-gray-700 transition-colors duration-200"
                  placeholder="Write your note here..."
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm border dark:border-gray-700 h-full dark:text-white overflow-auto transition-colors duration-200">
                  {activeNote.content.split('\n').map((paragraph, i) => (
                    paragraph ? <p key={i} className="mb-3">{paragraph}</p> : <br key={i} />
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Last updated: {formatDate(activeNote.updatedAt)}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col dark:text-gray-300">
            <p className="mb-4">No notes selected</p>
            <button 
              onClick={createNewNote}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Create a note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleNoteApp;