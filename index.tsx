
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// hydrateRoot() is used when the prerenderer emitted real markup; it falls
// back to client rendering when it did not.
import { hydrateRoot, createRoot } from 'react-dom/client';

const hasServerMarkup = rootElement.hasChildNodes();

const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (hasServerMarkup) {
  hydrateRoot(rootElement, tree);
} else {
  createRoot(rootElement).render(tree);
}
