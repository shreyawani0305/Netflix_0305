import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BrowseLanguages from './pages/BrowseLanguages';
import BrowseCategory from './pages/BrowseCategory';
import Games from './pages/Games';
import MyNetflix from './pages/MyNetflix';
import NewPopular from './pages/NewPopular';
import Mood from './pages/Mood';
import SurpriseMe from './pages/SurpriseMe';
import DevAdminPanel from './components/DevAdminPanel';
import WalkthroughPointer from './components/WalkthroughPointer';
import Walkthrough from './pages/Walkthrough';
import { UserDataProvider } from './context/UserDataContext';

function AppRoutes() {
  const location = useLocation();
  const isWalkthrough = location.pathname === '/' || location.pathname === '/walkthrough';
  const isWalkthroughEmbed = new URLSearchParams(location.search).get('walkthrough') === '1';
  const [walkthroughStep, setWalkthroughStep] = React.useState(null);

  useEffect(() => {
    if (!isWalkthroughEmbed) {
      delete document.documentElement.dataset.walkthroughFocus;
      delete document.documentElement.dataset.walkthroughStep;
      return undefined;
    }

    const handleWalkthroughGuide = (event) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'netflix-walkthrough-guide') return;
      const step = event.data.step;
      setWalkthroughStep(step || null);
      if (!step || step.hidden) {
        delete document.documentElement.dataset.walkthroughFocus;
        delete document.documentElement.dataset.walkthroughStep;
        return;
      }

      document.documentElement.dataset.walkthroughFocus = step.focus || '';
      document.documentElement.dataset.walkthroughStep = step.id;
    };
    window.addEventListener('message', handleWalkthroughGuide);
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'netflix-walkthrough-ready' }, window.location.origin);
    }
    return () => {
      window.removeEventListener('message', handleWalkthroughGuide);
      delete document.documentElement.dataset.walkthroughFocus;
      delete document.documentElement.dataset.walkthroughStep;
    };
  }, [isWalkthroughEmbed]);

  return (
    <div className={`netflix-app-root${isWalkthrough ? ' is-walkthrough-route' : ''}${isWalkthroughEmbed ? ' is-walkthrough-embed' : ''}`}>
      {!isWalkthrough && (
        <>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Navbar />
        </>
      )}
      <Routes>
        <Route path="/" element={<Walkthrough />} />
        <Route path="/walkthrough" element={<Walkthrough />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse/movies" element={<BrowseCategory type="movie" />} />
        <Route path="/browse/shows" element={<BrowseCategory type="tv" />} />
        <Route path="/browse/original-audio" element={<BrowseLanguages />} />
        <Route path="/games" element={<Games />} />
        <Route path="/browse/my-list" element={<MyNetflix />} />
        <Route path="/latest" element={<NewPopular />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/prototype/mood" element={<Mood />} />
        <Route path="/surprise-me" element={<SurpriseMe />} />
        <Route path="/prototype/surprise-me" element={<SurpriseMe />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isWalkthroughEmbed && <WalkthroughPointer step={walkthroughStep} />}
      {!isWalkthrough && <Footer />}
      {import.meta.env.DEV && !isWalkthrough && !isWalkthroughEmbed && <DevAdminPanel />}
    </div>
  );
}

export default function App() {
  return (
    <UserDataProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserDataProvider>
  );
}
