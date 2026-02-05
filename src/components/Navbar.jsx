import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, Code2, Terminal, Map, Dna, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Shell', path: '/shell', icon: <Terminal size={16} /> }, // Renamed from Terminal to Shell
    { name: 'Pathfinding', path: '/algorithms', icon: <Map size={16} /> },
    { name: 'Sorting', path: '/sorting', icon: <Code2 size={16} /> },
    { name: 'Neural Net', path: '/ml', icon: <Cpu size={16} /> },
    { name: 'Evolution', path: '/genetic', icon: <Dna size={16} /> },
    { name: 'Templates', path: '/templates', icon: <Layout size={16} /> },
  ];

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
      >
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="text-lg font-bold tracking-tight text-white flex items-center gap-2 group">
              <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                GW
              </span>
              <span className="hidden sm:block text-zinc-300 group-hover:text-white transition-colors">Wiandt.dev</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-3 py-2 rounded-lg text-xs font-medium transition-all group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-bg"
                        className="absolute inset-0 bg-white/10 rounded-lg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className={`relative flex items-center gap-2 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                      {item.icon} {item.name}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white p-2">
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-xl text-sm font-medium flex items-center gap-3 ${
                    location.pathname === item.path
                      ? 'bg-indigo-600/20 text-indigo-300'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>
    </div>
  );
};

export default Navbar;