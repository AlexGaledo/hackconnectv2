import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/Home.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import CreateProject from './pages/Create/CreateProject.jsx';
import Community from './pages/Community/Community.jsx';
import Rewards from './pages/Rewards/Rewards.jsx';
import TicketInfo from './pages/TIckets/TicketInfo.jsx';
import TicketList from './pages/TIckets/TicketList.jsx';
import EventList from './pages/Events/EventList.jsx';
import EventInfo from './pages/Events/EventInfo.jsx';
import ErrorPage from './pages/Errorpage/Errorpage.jsx';
import NavBar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import { useEffect } from 'react';

function App() {
  const location = useLocation(); // ✅ inside HashRouter from AppWrapper

  // Dynamic tab title
  useEffect(() => {
    if (location.pathname === "/") {
      document.title = "HackConnect";
    } else {
      document.title = `${location.pathname.slice(1)} | HackConnect`;
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-300">
      <NavBar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LandingPage />
              </motion.div>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            }
          />
          <Route
            path="/Create"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CreateProject />
              </motion.div>
            }
          />
          <Route
            path="/Community"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Community />
              </motion.div>
            }
          />
          <Route
            path="/Rewards"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Rewards />
              </motion.div>
            }
          />
          <Route
            path="/Ticket"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TicketInfo />
              </motion.div>
            }
          />
          <Route
            path="/Tickets"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TicketList />
              </motion.div>
            }
          />
          <Route
            path="/Events"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EventList />
              </motion.div>
            }
          />
          <Route
            path="/Event/:id"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EventInfo />
              </motion.div>
            }
          />
          <Route
            path="*"
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ErrorPage />
              </motion.div>
            }
          />
          {/* Add more routes here as needed */}
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default App;
