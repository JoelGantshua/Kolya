import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Reservation from './components/Reservation/Reservation';
import LoadingSpinner from './components/UI/LoadingSpinner';
import Gallery from './components/Gallery/Gallery';
import Menu from './components/Menu/Menu';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import ContactPage from './pages/ContactPage';
import DashboardRoutes from './pages/Dashboard/routes';
import Login from './pages/Login/Login';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const location = useLocation();
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    // Vérifier si nous sommes sur une route du tableau de bord
    setIsDashboard(location.pathname.startsWith('/dashboard'));
  }, [location]);

  return (
    <div className="app">
      {!isDashboard && (
        <>
          <Header />
          <Navbar />
        </>
      )}
      
      <main className={isDashboard ? 'dashboard-layout' : ''}>
        <Routes>
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={
            <>
              <Hero />
              <About />
              <LoadingSpinner />
              <Menu />
              <Reservation />
              <ContactPage />
              <Testimonials />
              <Gallery />
            </>
          } />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
}

export default App;
