import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch is writable and robust in iframe/sandboxed environments
try {
  if (typeof window !== 'undefined' && window.fetch) {
    const rawFetch = window.fetch.bind(window);
    let activeFetch = rawFetch;
    try {
      Object.defineProperty(window, 'fetch', {
        get: () => activeFetch,
        set: (fn) => {
          if (typeof fn === 'function') activeFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    } catch (_) {}
  }
} catch (_) {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
