import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, Code2, Terminal, Map, Dna } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Portfolio', path: '/', icon: <Terminal size={18} /> },
    { name: 'Pathfinding', path: '/algorithms', icon: <Map size={18} /> },
    { name: 'Sorting', path: '/sorting', icon: <Code2 size={18} /> },
    { name: 'Neural Net', path: '/ml', icon: <Cpu size={18} /> },
    { name: 'Evolution', path: '/genetic', icon: <Dna size={18} /> }, // Added this
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            GW <span className="text-blue-500">.dev</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  location.pathname === item.path 
                    ? 'bg-white/10 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                  location.pathname === item.path
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;