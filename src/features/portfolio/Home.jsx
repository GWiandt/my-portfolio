// FIXED: Added 'Dna' to this list so the page doesn't crash
import { Linkedin, Mail, FileText, Code2, Database, Terminal, Cpu, Globe, Users, ArrowUpRight, Map, Dna } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      
      {/* Scrollbar hiding styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-4">

        {/* --- ROW 1: HERO & CORE SKILLS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Hero Profile */}
          <div className="md:col-span-2 bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-70" />
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-2">
                Guillermo <span className="text-blue-500">Wiandt</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
                BS Computer Science @ WPI (2026). <br/>
                Full-Stack Developer bridging robust systems programming with modern, user-centric web architecture.
              </p>
            </div>

            <div className="flex gap-3 mt-8 relative z-10">
              <a href="mailto:gwiandt@wpi.edu" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-colors">
                <Mail size={16} /> Contact
              </a>
              <a href="https://www.linkedin.com/in/guillermo-wiandt-550684238/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/20 text-blue-400 rounded-full text-sm font-medium transition-colors">
                <Linkedin size={16} /> LinkedIn
              </a>
              {/* UPDATED RESUME LINK */}
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full text-sm font-medium transition-colors">
                <FileText size={16} /> Resume
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 flex flex-col gap-3 overflow-y-auto no-scrollbar">
            <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-wider text-xs font-bold mb-2">
               <Code2 size={14} /> Technical Arsenal
            </div>
            <div className="flex flex-wrap gap-2">
                {["Java", "C", "C++", "Python", "JavaScript", "SQL", "PHP", "HTML/CSS", "Unity", "Git"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-md border border-zinc-700/50">
                    {tech}
                  </span>
                ))}
            </div>
            <div className="mt-4">
                <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-wider text-xs font-bold mb-2">
                    <Globe size={14} /> Languages
                </div>
                <div className="text-sm text-zinc-400 space-y-1">
                    <p><span className="text-zinc-200">Spanish & Basque:</span> Fluent</p>
                    <p><span className="text-zinc-200">English:</span> Fluent</p>
                    <p><span className="text-zinc-200">French:</span> Conversational</p>
                </div>
            </div>
          </div>
        </div>

        {/* --- ROW 2: EXPERIENCE & PROJECTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Left Column: Experience */}
          <div className="bg-[#18181b] border border-white/5 rounded-3xl flex flex-col h-full overflow-hidden relative">
            <div className="p-6 pb-4 border-b border-white/5 bg-[#18181b] z-20 shrink-0">
              <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-wider text-xs font-bold">
                <Terminal size={14} /> Experience
              </div>
            </div>
            
            <div className="overflow-y-auto p-6 pt-2 flex-1 no-scrollbar">
              <div className="space-y-8 relative border-l border-zinc-800 ml-2 pt-2">
                {[
                  {
                      role: "Full-Stack Intern",
                      company: "KraneShares",
                      location: "New York City",
                      date: "Jun 2025 – Jul 2025",
                      desc: "Designed and deployed new product page templates to improve UX. Implemented Mailchimp and captcha honey-potting.",
                      link: "https://kraneshares.com/private-funds/"
                  },
                  {
                      role: "Climate Resilience Research",
                      company: "IIT Mandi",
                      location: "Himachal Pradesh, India",
                      date: "Mar 2025 – May 2025",
                      desc: "Applied GIS mapping and Python analysis to evaluate disaster resilience in Himalayan architecture.",
                      link: "https://digital.wpi.edu/concern/student_works/rr172273m?locale=en"
                  },
                  {
                      role: "AV Support",
                      company: "Bogleheads Conference",
                      location: "Minneapolis, MN",
                      date: "Sep 2024 – Oct 2024",
                      desc: "Managed AV equipment for 500+ attendees, ensuring seamless presentations under tight deadlines.",
                      link: "https://boglecenter.net/2024conference/"
                  },
                  {
                      role: "IT and UX",
                      company: "MME at WPI",
                      location: "Worcester, MA",
                      date: "Sep 2023 – Present",
                      desc: "Managed IT and improved UX for the Mechanical and Materials Engineering Department.",
                      link: "https://www.wpi.edu/academics/departments/mechanical-materials-engineering"
                  },
                  {
                      role: "Web UX and Marketing",
                      company: "Mechanics Hall",
                      location: "Worcester, MA",
                      date: "Jan 2023 – May 2023",
                      desc: "Enhanced web UI, increasing ticket sales by 25% and customer satisfaction by 30%.",
                      link: "https://mechanicshall.org/"
                  },
                  {
                      role: "Marketing Manager",
                      company: "Quinta Essencia",
                      location: "San Sebastian, Spain",
                      date: "Jun 2023 – Aug 2023",
                      desc: "Increased website social media traffic by 80% and boosted customer engagement.",
                      link: "https://www.instagram.com/quintaesenciabienestar/"
                  }
                ].map((job, i) => (
                  <a key={i} href={job.link} target="_blank" rel="noopener noreferrer" className="block pl-6 relative group cursor-pointer">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-blue-500 transition-colors" />
                    <h3 className="text-md font-bold text-zinc-200 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        {job.role} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono mb-1">{job.company} • {job.date}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{job.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Projects Grid */}
          <div className="space-y-4">
             {/* Section Header */}
             <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-wider text-xs font-bold">
                    <Cpu size={14} /> Featured Projects
                </div>
                <span className="text-xs text-zinc-600">Select to view details</span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    {
                        title: "7Factor Full-Stack",
                        date: "Aug 2025 – Present",
                        tech: "React, DB",
                        desc: "Collaborating on employee management features. Implemented UI mock-ups and database changes.",
                        icon: <Users size={20} />,
                        link: "https://7factor.io/",
                        isExternal: true
                    },
                    {
                        title: "Evolutionary AI",
                        date: "Jan 2026",
                        tech: "Genetic Algo, JS",
                        desc: "Autonomous agents learning to navigate complex obstacles using Darwinian evolutionary principles.",
                        icon: <Dna size={20} />,
                        link: "/genetic",
                        isExternal: false
                    },
                    {
                        title: "Pathfinding Visualizer",
                        date: "Jan 2026",
                        tech: "React, A*, Dijkstra",
                        desc: "Interactive tool comparing search algorithms on user-generated mazes with real-time stats.",
                        icon: <Map size={20} />,
                        link: "/algorithms",
                        isExternal: false
                    },
                    {
                        title: "Sorting Visualizer",
                        date: "Jan 2026",
                        tech: "React, Algorithms",
                        desc: "Interactive visualizer for Bubble, Merge, and Quick Sort algorithms.",
                        icon: <Code2 size={20} />,
                        link: "/sorting",
                        isExternal: false
                    },
                    {
                        title: "Simple Shell Implementation",
                        date: "Aug 2024 – Oct 2024",
                        tech: "C, Systems",
                        desc: "Developed a command-line shell supporting piping, redirection, and dynamic resource handling.",
                        icon: <Terminal size={20} />,
                        link: "/shell",
                        isExternal: false
                    },
                    {
                        title: "Neural Network Visualizer",
                        date: "Dec 2025",
                        tech: "JS, Perceptron",
                        desc: "Interactive simulation of a neural network learning to classify data via Gradient Descent.",
                        icon: <Cpu size={20} />,
                        link: "/ml",
                        isExternal: false
                    },
                    {
                        title: "Project App Website",
                        date: "Mar 2023 – May 2023",
                        tech: "Web Dev",
                        desc: "Designed a platform for students to apply for professor-led projects with accessibility.",
                        icon: <Globe size={20} />,
                        link: "#",
                        isExternal: true
                    }
                ].map((project, i) => (
                    project.isExternal ? (
                        <a key={i} href={project.link} target="_blank" rel="noopener noreferrer" className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl hover:bg-zinc-800/50 transition-all group cursor-pointer block">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                    {project.icon}
                                </div>
                                <span className="text-xs font-mono text-zinc-600">{project.date}</span>
                            </div>
                            <h3 className="text-lg font-bold text-zinc-200 mb-1 flex items-center gap-2">
                                {project.title} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"/>
                            </h3>
                            <p className="text-xs text-blue-500/80 mb-2 font-mono">{project.tech}</p>
                            <p className="text-sm text-zinc-400 leading-snug">{project.desc}</p>
                        </a>
                    ) : (
                        <Link key={i} to={project.link} className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl hover:bg-zinc-800/50 transition-all group cursor-pointer block">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                    {project.icon}
                                </div>
                                <span className="text-xs font-mono text-zinc-600">{project.date}</span>
                            </div>
                            <h3 className="text-lg font-bold text-zinc-200 mb-1 flex items-center gap-2">
                                {project.title} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"/>
                            </h3>
                            <p className="text-xs text-blue-500/80 mb-2 font-mono">{project.tech}</p>
                            <p className="text-sm text-zinc-400 leading-snug">{project.desc}</p>
                        </Link>
                    )
                ))}
             </div>
          </div>
        </div>

        {/* --- ROW 3: EXTRACURRICULARS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex items-center justify-between">
              <div>
                 <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Education</p>
                 <h3 className="text-xl font-bold text-white">Worcester Polytechnic Institute</h3>
                 <p className="text-zinc-400 text-sm">BS Computer Science • 2026</p>
              </div>
              <div className="text-right">
                 <div className="flex gap-1 justify-end mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                 </div>
                 <span className="text-xs text-zinc-500 font-mono">Worcester, MA</span>
              </div>
           </div>

           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">Leadership & Activities</p>
              <div className="flex flex-wrap gap-2">
                 <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300 border border-zinc-700">Theta Chi Activities Chair</span>
                 <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300 border border-zinc-700">Ice Hockey Goalie</span>
                 <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300 border border-zinc-700">Varsity Basketball</span>
                 <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300 border border-zinc-700">SHPE Member</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Home;