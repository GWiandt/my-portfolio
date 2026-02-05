import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './features/portfolio/Home';
import PathfindingVisualizer from './features/algorithms/pathfinding/PathfindingVisualizer';
import SortingVisualizer from "./features/algorithms/sorting/SortingVisualizer";
import Shell from "./features/portfolio/Shell";
import MLVisualizer from "./features/portfolio/MLVisualizer";
import GeneticAlgo from "./features/portfolio/GeneticAlgo";
import Templates from "./features/portfolio/Templates";
import SaasDashboard from "./features/templates/SaasDashboard"; 
import Ecommerce from "./features/templates/Ecommerce";
import LandingPage from "./features/templates/LandingPage";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          {/* Spotlight Effect */}
          <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-indigo-500/10 blur-[100px] mx-auto"></div>
      </div>

      <Navbar />
      
      {/* Main Content Area */}
      <main className="relative z-10 pt-24 max-w-7xl mx-auto px-4 sm:px-6">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<PathfindingVisualizer />} />
          <Route path="/sorting" element={<SortingVisualizer />} />
          <Route path="/shell" element={<Shell />} />
          <Route path="/ml" element={<MLVisualizer />} />
          <Route path="/genetic" element={<GeneticAlgo />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/dashboard" element={<SaasDashboard />} />
          <Route path="/templates/ecommerce" element={<Ecommerce />} />
          <Route path="/templates/landing" element={<LandingPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;