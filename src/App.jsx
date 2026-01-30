import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './features/portfolio/Home';
// Ensure these paths match your folder structure exactly
import PathfindingVisualizer from './features/algorithms/pathfinding/PathfindingVisualizer';
import SortingVisualizer from "./features/algorithms/sorting/SortingVisualizer";
import Shell from "./features/portfolio/Shell"; // FIXED: Capitalized 'Shell'
import MLVisualizer from "./features/portfolio/MLVisualizer";
import GeneticAlgo from "./features/portfolio/GeneticAlgo";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar should handle the top navigation */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="pt-20 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<PathfindingVisualizer />} />
          <Route path="/sorting" element={<SortingVisualizer />} />
          <Route path="/shell" element={<Shell />} />
          <Route path="/ml" element={<MLVisualizer />} />
          <Route path="/genetic" element={<GeneticAlgo />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;