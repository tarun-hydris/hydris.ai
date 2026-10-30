import { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { Site } from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Platform from './pages/Platform.jsx';
import Demo from './pages/Demo.jsx';
import About from './pages/About.jsx';
import Press from './pages/Press.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';

/* Build-time render of every page, so the HTML each URL serves already holds the full text.
   Crawlers that do not run JavaScript (most AI crawlers) read it as is; the browser hydrates it.
   The tree mirrors src/main.jsx exactly (Site > Suspense > Page) so hydration lines up. */
const pages = { home: Home, platform: Platform, demo: Demo, about: About, press: Press, contact: Contact, privacy: Privacy, terms: Terms, notfound: NotFound };

export function render(key) {
  const Page = pages[key] || NotFound;
  const html = renderToString(
    <Site page={key}>
      <Suspense fallback={<div className="page-wait" />}>
        <Page />
      </Suspense>
    </Site>
  );
  // A render error inside the boundary silently hands the page back to the browser (<!--$!-->).
  // Fail the build instead, rendering once more without the boundary so the real error surfaces.
  if (html.includes('<!--$!-->')) {
    renderToString(<Site page={key}><Page /></Site>);
    throw new Error(`Pre-render of "${key}" fell back to client rendering`);
  }
  return html;
}
