import { Linkedin, Mail, FileText, Code2, Terminal, Cpu, Globe, ArrowUpRight, Map, Dna, Download, Layout } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const Home = () => {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="pb-20"
    >
      {/* Hide scrollbar utility */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* --- HERO SECTION --- */}
        <motion.div variants={item} className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-white/10 p-8 md:p-12 hover:border-indigo-500/30 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Available for Summer 2026 Internships
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                Guillermo <span className="text-indigo-500">Wiandt</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
                Full-Stack Engineer combining low-level systems knowledge with high-end web architecture.
                <br /> Currently building intelligent systems @ WPI.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              {/* UPDATED RESUME BUTTON: High Contrast "Pop" */}
              <a 
                href="/resume.pdf" 
                target="_blank" 
                className="px-6 py-3 bg-white text-black border border-white rounded-full font-bold text-sm hover:bg-zinc-200 hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                <Download size={18} /> View Resume
              </a>
              
              <a href="mailto:gwiandt@wpi.edu" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-medium text-sm transition-colors flex items-center gap-2">
                <Mail size={16} /> Contact
              </a>
              
              {/* UPDATED LINKEDIN LINK */}
              <a href="https://www.linkedin.com/in/guillermo-wiandt-550684238/" target="_blank" rel="noreferrer" className="px-4 py-3 bg-[#0077b5]/10 text-blue-400 border border-[#0077b5]/20 rounded-full hover:bg-[#0077b5]/20 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* --- TEMPLATES PROMO (ENTIRE CARD IS NOW A LINK) --- */}
        <motion.div variants={item}>
            <Link to="/templates" className="block h-full">
                <div className="h-full bg-gradient-to-br from-zinc-900/60 to-zinc-900/20 border border-white/10 rounded-3xl p-8 flex flex-col justify-between group hover:border-indigo-500/30 hover:bg-zinc-800/50 transition-all cursor-pointer">
                   <div>
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                            <Layout size={24} />
                         </div>
                         <ArrowUpRight className="text-zinc-500 group-hover:text-white transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">Design Templates</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300">
                         Explore my collection of high-fidelity UI/UX templates, including Dashboards and E-Commerce layouts.
                      </p>
                   </div>
                   <div className="mt-6 w-full py-3 bg-white/5 group-hover:bg-indigo-600 group-hover:text-white border border-white/5 rounded-xl text-sm font-medium text-center transition-all">
                      View Gallery
                   </div>
                </div>
            </Link>
        </motion.div>

        {/* --- EXPERIENCE COLUMN --- */}
        <motion.div variants={item} className="md:col-span-1 bg-zinc-900/40 border border-white/10 rounded-3xl p-1 relative overflow-hidden flex flex-col h-[500px]">
           <div className="p-6 pb-2 border-b border-white/5">
              <h2 className="text-zinc-100 font-bold flex items-center gap-2">
                <Terminal className="text-indigo-500" size={18}/> Work History
              </h2>
           </div>
           
           <div className="overflow-y-auto p-4 space-y-2 flex-1 no-scrollbar">
              {[
                  { role: "Full-Stack Intern", company: "KraneShares", date: "2025", link: "https://kraneshares.com/private-funds/" },
                  { role: "Research Assistant", company: "IIT Mandi", date: "2025", link: "https://digital.wpi.edu/concern/student_works/rr172273m?locale=en" },
                  { role: "AV Tech Support", company: "Bogleheads", date: "2024", link: "https://boglecenter.net/2024conference/" },
                  { role: "IT Specialist", company: "WPI MME Dept", date: "2023-Present", link: "https://www.wpi.edu/academics/departments/mechanical-materials-engineering" },
                  { role: "Web UX & Marketing", company: "Mechanics Hall", date: "2023", link: "https://mechanicshall.org/" },
                  { role: "Marketing Manager", company: "Quinta Essencia", date: "2023", link: "https://www.instagram.com/quintaesenciabienestar/" }
              ].map((job, i) => (
                <a key={i} href={job.link} target="_blank" rel="noopener noreferrer" className="block group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer">
                   <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-zinc-200 group-hover:text-indigo-300 transition-colors">{job.role}</h3>
                      <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                   </div>
                   <p className="text-xs text-zinc-400">{job.company}</p>
                   <p className="text-[10px] text-zinc-500 font-mono mt-2">{job.date}</p>
                </a>
              ))}
           </div>
        </motion.div>

        {/* --- PROJECTS GRID --- */}
        <div className="md:col-span-2 space-y-6">
           <motion.div variants={item} className="flex items-center justify-between p-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                 <Cpu className="text-indigo-500" /> Featured Projects
              </h2>
              <Link to="/shell" className="text-xs font-mono text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                 view_all_in_terminal() <Terminal size={12}/>
              </Link>
           </motion.div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                    title: "Evolutionary AI",
                    desc: "Genetic algorithm simulation where rockets evolve to bypass obstacles.",
                    tags: ["React", "Canvas", "AI"],
                    link: "/genetic",
                    icon: <Dna size={24} className="text-purple-400"/>,
                    color: "group-hover:border-purple-500/50"
                },
                {
                    title: "Interactive Shell",
                    desc: "A fully functional ZSH-like terminal in the browser with filesystem.",
                    tags: ["Systems", "React", "Linux"],
                    link: "/shell",
                    icon: <Terminal size={24} className="text-green-400"/>,
                    color: "group-hover:border-green-500/50"
                },
                {
                    title: "Pathfinding Viz",
                    desc: "Visualizing A*, Dijkstra, and DFS algorithms in real-time.",
                    tags: ["Algorithms", "Graph Theory"],
                    link: "/algorithms",
                    icon: <Map size={24} className="text-blue-400"/>,
                    color: "group-hover:border-blue-500/50"
                },
                {
                    title: "Neural Network",
                    desc: "Interactive Perceptron visualization learning to classify data.",
                    tags: ["ML", "Math", "Visualization"],
                    link: "/ml",
                    icon: <Cpu size={24} className="text-red-400"/>,
                    color: "group-hover:border-red-500/50"
                }
              ].map((project, i) => (
                <motion.div variants={item} key={i}>
                  <Link to={project.link} className={`block h-full bg-zinc-900/40 border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-zinc-800/50 group ${project.color}`}>
                    <div className="mb-4 bg-zinc-900 w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                       {project.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                        {project.desc}
                    </p>
                    <div className="flex gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                  </Link>
                </motion.div>
              ))}
           </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Home;