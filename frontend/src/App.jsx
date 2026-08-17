import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Companies from './pages/Companies';
import Industries from './pages/Industries';
import Batches from './pages/Batches';
import CompanyDetail from './pages/CompanyDetail';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/batches" element={<Batches />} />
        <Route path="/company/:slug" element={<CompanyDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
