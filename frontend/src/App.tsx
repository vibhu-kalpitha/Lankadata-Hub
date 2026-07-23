import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Lazy loading all pages for optimal performance and chunk division
const Home = lazy(() => import('./pages/Home'));
const Datasets = lazy(() => import('./pages/Datasets'));
const DatasetDetail = lazy(() => import('./pages/DatasetDetail'));
const Dashboards = lazy(() => import('./pages/Dashboards'));
const DashboardDetail = lazy(() => import('./pages/DashboardDetail'));
const APIMarketplace = lazy(() => import('./pages/APIMarketplace'));
const APIDetail = lazy(() => import('./pages/APIDetail'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Categories = lazy(() => import('./pages/Categories'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const AboutSriLanka = lazy(() => import('./pages/AboutSriLanka'));
const AboutHub = lazy(() => import('./pages/AboutHub'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Shimmer page loading skeleton
const PageLoading: React.FC = () => (
  <div className="min-h-screen bg-lanka-bg flex flex-col justify-center items-center py-12">
    <div className="w-12 h-12 rounded-full border-4 border-lanka-blue border-t-transparent animate-spin mb-4" />
    <span className="text-xs font-semibold text-lanka-cyan uppercase tracking-widest animate-pulse">
      Loading LankaData Hub...
    </span>
  </div>
);

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-lanka-bg flex flex-col overflow-x-hidden select-none">
        {/* Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/datasets/:id" element={<DatasetDetail />} />
              <Route path="/dashboards" element={<Dashboards />} />
              <Route path="/dashboards/:id" element={<DashboardDetail />} />
              <Route path="/apis" element={<APIMarketplace />} />
              <Route path="/apis/:id" element={<APIDetail />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:id" element={<CategoryDetail />} />
              <Route path="/about-srilanka" element={<AboutSriLanka />} />
              <Route path="/about" element={<AboutHub />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Fallback routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
