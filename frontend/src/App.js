import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import RootLayout from './components/layout/RootLayout';

const App = () => {
  return (
    <RootLayout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="recipes" element={<RecipePage />} />
    </Routes>
    </RootLayout>
  );
};

export default App;
