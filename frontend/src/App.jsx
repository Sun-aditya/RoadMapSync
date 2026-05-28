import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Compass, LogOut, MapPinned } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import RoadmapSelection from './pages/RoadmapSelection';
import RoadmapView from './pages/RoadmapView';
import Profile from './pages/Profile';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-brand-surface text-brand-text shadow-sm'
      : 'text-brand-text/75 hover:bg-brand-surface hover:text-brand-text',
  ].join(' ');

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppShell() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
      <div className="min-h-screen text-brand-text">
        <header className="sticky top-0 z-20 border-b border-brand-line/80 bg-brand-bg/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-accent text-white shadow-card">
                <MapPinned className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-brand-text sm:text-base">Roadmap Atelier</span>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              <NavLink to="/" className={navLinkClass} end>
                Landing
              </NavLink>
              <NavLink to="/roadmaps" className={navLinkClass}>
                Roadmaps
              </NavLink>
              {isAuthenticated ? (
                <NavLink to="/home" className={navLinkClass}>
                  Home
                </NavLink>
              ) : null}
              {isAuthenticated ? (
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              ) : null}
            </nav>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-brand-card px-4 py-2 text-sm font-medium text-brand-text transition hover:border-brand-accent"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-brand-card px-4 py-2 text-sm font-medium text-brand-text transition hover:border-brand-accent"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-accent-dark"
                  >
                    <Compass className="h-4 w-4" />
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route path="/roadmaps" element={<RoadmapSelection />} />
                <Route path="/roadmaps/:id" element={<RoadmapView />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
