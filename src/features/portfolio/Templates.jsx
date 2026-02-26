import React from 'react';
import { ArrowLeft, Layout, ExternalLink, Github, Monitor, Smartphone, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const Templates = () => {
  const navigate = useNavigate();

  const templates = [
    {
      title: "Fintech Analytics Dashboard",
      description: "A high-density data dashboard with interactive charts, transaction tables, and a dark-mode first design system.",
      tags: ["React", "Tailwind", "Recharts"],
      type: "Web Application",
      path: "/templates/dashboard", 
      githubLink: "https://github.com/yourusername/portfolio-2026", 
      Visual: () => (
        <div className="w-full h-full bg-[#0a0a0a] p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="w-24 h-4 bg-white/10 rounded-full"></div>
                <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20"></div>
                    <div className="w-6 h-6 rounded-full bg-white/10"></div>
                </div>
            </div>
            <div className="flex gap-3">
                <div className="flex-1 h-16 bg-white/5 rounded-lg border border-white/5 p-2 flex flex-col justify-between">
                    <div className="w-12 h-2 bg-white/10 rounded-full"></div>
                    <div className="w-16 h-4 bg-indigo-400/50 rounded-full"></div>
                </div>
                <div className="flex-1 h-16 bg-white/5 rounded-lg border border-white/5 p-2 flex flex-col justify-between">
                    <div className="w-12 h-2 bg-white/10 rounded-full"></div>
                    <div className="w-20 h-4 bg-emerald-400/50 rounded-full"></div>
                </div>
            </div>
            <div className="flex-1 bg-white/5 rounded-lg border border-white/5 p-3 flex items-end gap-2">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-indigo-500/30 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
            </div>
        </div>
      )
    },
    {
      title: "Minimalist E-Commerce",
      description: "A clean, conversion-optimized storefront template featuring product galleries, cart slide-outs, and sleek typography.",
      tags: ["React", "Framer Motion", "Tailwind"],
      type: "E-Commerce",
      path: "/templates/ecommerce", 
      githubLink: "https://github.com/yourusername/portfolio-2026",
      Visual: () => (
        <div className="w-full h-full bg-zinc-100 p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-2">
                <div className="w-16 h-3 bg-black/20 rounded-full"></div>
                <div className="flex gap-2">
                    <div className="w-4 h-1 bg-black/20 rounded-full"></div>
                    <div className="w-4 h-1 bg-black/20 rounded-full"></div>
                </div>
            </div>
            <div className="w-full h-24 bg-zinc-200 rounded-lg flex items-center justify-center">
                <div className="w-20 h-6 bg-black/10 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1">
                <div className="bg-white rounded-md shadow-sm p-2 flex flex-col gap-2">
                    <div className="w-full flex-1 bg-zinc-100 rounded-sm"></div>
                    <div className="w-3/4 h-2 bg-black/20 rounded-full"></div>
                </div>
                <div className="bg-white rounded-md shadow-sm p-2 flex flex-col gap-2">
                    <div className="w-full flex-1 bg-zinc-100 rounded-sm"></div>
                    <div className="w-1/2 h-2 bg-black/20 rounded-full"></div>
                </div>
            </div>
        </div>
      )
    },
    {
      title: "SaaS Landing Page",
      description: "A modern, high-converting landing page with scroll animations, bento-box feature grids, and pricing tables.",
      tags: ["React", "CSS Grid", "Animations"],
      type: "Marketing",
      path: "/templates/landing", 
      githubLink: "https://github.com/yourusername/portfolio-2026",
      Visual: () => (
        <div className="w-full h-full bg-[#09090b] p-4 flex flex-col items-center pt-8 gap-4 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/30 blur-[40px] rounded-full"></div>
            <div className="w-3/4 h-6 bg-white/90 rounded-full relative z-10"></div>
            <div className="w-1/2 h-3 bg-white/40 rounded-full relative z-10"></div>
            <div className="w-24 h-8 bg-purple-500 rounded-full mt-2 relative z-10"></div>
            
            <div className="w-full flex-1 grid grid-cols-3 gap-2 mt-4 relative z-10">
                <div className="col-span-2 bg-white/5 border border-white/10 rounded-lg"></div>
                <div className="col-span-1 bg-white/5 border border-white/10 rounded-lg"></div>
            </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-4 pt-24 font-sans pb-20">
      
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8">
            <ArrowLeft size={20} /> Back to Portfolio
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 mb-3">
                    <Layout className="text-indigo-500" size={40} /> UI/UX Templates
                </h1>
                <p className="text-zinc-400 max-w-xl text-lg leading-relaxed">
                    A collection of production-ready frontend templates, component libraries, and design systems I've built.
                </p>
            </div>
            
            <div className="flex gap-4 text-sm font-mono text-zinc-500">
                <span className="flex items-center gap-2"><Monitor size={16}/> Responsive</span>
                <span className="flex items-center gap-2"><Palette size={16}/> Styled</span>
            </div>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {templates.map((template, idx) => (
            <motion.div 
              key={idx} 
              variants={item} 
              onClick={() => navigate(template.path)}
              className="group flex flex-col bg-zinc-900/40 border border-white/10 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all duration-500 shadow-xl flex-1 cursor-pointer hover:-translate-y-1"
            >
                
                {/* Visual Mockup Window */}
                <div className="h-64 w-full bg-[#121214] border-b border-white/5 relative overflow-hidden flex flex-col">
                    <div className="h-8 w-full bg-[#18181b] flex items-center px-4 gap-2 border-b border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="flex-1 relative overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                        <template.Visual />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 h-full">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-2">
                        {template.type}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                        {template.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-6 flex-1 leading-relaxed">
                        {template.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {template.tags.map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 bg-black/50 border border-white/5 px-2 py-1 rounded-md">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Functional Internal Links */}
                    <div className="flex gap-3 pt-4 border-t border-white/5 mt-auto">
                        {/* We changed this from a Link to a div because the whole card navigates now */}
                        <div className="flex-1 flex items-center justify-center gap-2 bg-white/5 group-hover:bg-indigo-600 group-hover:text-white text-zinc-300 py-2.5 rounded-xl text-sm font-bold transition-all duration-300">
                            <ExternalLink size={16} /> Open Template
                        </div>
                        <a 
                            href={template.githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()} // <-- STOPS CLICK FROM TRIGGERING CARD NAVIGATION
                            className="flex items-center justify-center p-2.5 bg-black/50 hover:bg-zinc-800 border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white rounded-xl transition-all"
                        >
                            <Github size={18} />
                        </a>
                    </div>
                </div>
            </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Templates;