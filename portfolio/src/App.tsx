import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AIToolsMindMap from './components/AIToolsMindMap';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ai-tools" element={<AIToolsMindMap />} />
    </Routes>
  );
}

export default App;
