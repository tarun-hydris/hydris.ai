import { lazy, Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Site } from './components/layout/Layout.jsx';
import './styles/global.css';
import './styles/imagery.css';

const pages = {
  home: lazy(() => import('./pages/Home.jsx')),
  platform: lazy(() => import('./pages/Platform.jsx')),
  about: lazy(() => import('./pages/About.jsx')),
  press: lazy(() => import('./pages/Press.jsx')),
  contact: lazy(() => import('./pages/Contact.jsx')),
  privacy: lazy(() => import('./pages/Privacy.jsx')),
  terms: lazy(() => import('./pages/Terms.jsx')),
  notfound: lazy(() => import('./pages/NotFound.jsx')),
};

function Mounted() {
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => clearTimeout(t);
  }, []);
  return null;
}

const key = document.body.dataset.page || 'notfound';
const Page = pages[key] || pages.notfound;

createRoot(document.getElementById('root')).render(
  <Site page={key}>
    <Suspense fallback={<div className="page-wait" />}>
      <Page />
      <Mounted />
    </Suspense>
  </Site>
);
