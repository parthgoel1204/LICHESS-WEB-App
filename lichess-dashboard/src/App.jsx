import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, UserProfile, Leaderboards, Tournaments } from './pages';
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/tournaments" element={<Tournaments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
