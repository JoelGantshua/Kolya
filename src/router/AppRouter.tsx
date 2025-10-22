// src/router/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';

// Importations dynamiques avec chargement paresseux
const Home = lazy(() => import('../pages/Home'));
const MenuPage = lazy(() => import('../pages/MenuPage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const ReservationPage = lazy(() => import('../pages/ReservationPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="reservation" element={<ReservationPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
