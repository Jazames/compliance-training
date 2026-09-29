import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { AnimationTest } from './ui/AnimationTest';

const animationTest = new URLSearchParams(window.location.search).get('animation-test') === 'true';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {animationTest ? <AnimationTest /> : <App />}
  </React.StrictMode>,
);
