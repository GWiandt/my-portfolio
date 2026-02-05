import React from 'react';
import { motion } from 'framer-motion';
import { Layout, ShoppingCart, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Templates = () => {
const templates = [
    {
      title: "SaaS Dashboard",
      desc: "High-performance analytics dashboard with data visualization.",
      icon: <BarChart3 size={24} className="text-blue-400" />,
      status: "Live Demo", // Changed
      color: "border-blue-500/20 hover:border-blue-500/50",
      link: "/templates/dashboard" // Link added
    },
    {
      title: "E-Commerce",
      desc: "Modern product grid with cart functionality and animations.",
      icon: <ShoppingCart size={24} className="text-green-400" />,
      status: "Live Demo", // Changed
      color: "border-green-500/20 hover:border-green-500/50",
      link: "/templates/ecommerce" // Link added
    },
    {
      title: "Landing Page",
      desc: "High-conversion marketing landing page with scroll effects.",
      icon: <Layout size={24} className="text-purple-400" />,
      status: "Live Demo", // Changed
      color: "border-purple-500/20 hover:border-purple-500/50",
      link: "/templates/landing" // Link added
    }
];

  return (
    <div className="min-h-screen pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          UI/UX <span className="text-indigo-500">Templates</span>
        </h1>
        <p className="text-zinc-400 max-w-xl text-lg">
          A collection of high-fidelity web components and page layouts designed for scalability and user experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t, i) => (
            <Link to={t.link} key={i}>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-zinc-900/40 border ${t.color} rounded-3xl p-8 relative overflow-hidden group cursor-default`}
          >
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-white/5">
              {t.status}
            </div>
            
            <div className="mb-6 bg-zinc-900 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300">
              {t.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {t.desc}
            </p>
            
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 group-hover:text-white transition-colors">
              View Template <ArrowRight size={16} />
            </div>
          </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Templates;