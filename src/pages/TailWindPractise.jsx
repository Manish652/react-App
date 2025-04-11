import { useState } from 'react';
import { ChevronRight, ArrowRight, Moon, Sun } from 'lucide-react';

export default function HeroSection() {
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}`}>
    
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Unlock Your Digital <span className={darkMode ? 'text-indigo-400' : 'text-indigo-600'}>Potential</span>
            </h1>
            <p className={`mt-6 text-lg md:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-lg`}>
              Transform your ideas into reality with our cutting-edge platform designed for the modern creator.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className={`px-8 py-4 rounded-lg font-medium flex items-center justify-center ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                Get Started <ChevronRight className="ml-2" size={20} />
              </button>
              <button className={`px-8 py-4 rounded-lg font-medium flex items-center justify-center ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-indigo-600 hover:bg-gray-100 shadow-md'}`}>
                Learn More <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
            
            <div className="mt-12">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 ${darkMode ? 'border-gray-800 bg-gray-700' : 'border-white bg-gray-200'}`}></div>
                  ))}
                </div>
                <p className={`ml-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Join <span className="font-medium">5,000+</span> satisfied users
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className={`relative z-10 rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`h-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center px-4`}>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-6 h-64">
                <div className={`h-full w-full rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Your Content Here</div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-indigo-600 opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-purple-600 opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}