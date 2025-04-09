import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import RootLayout from './components/layout/RootLayout';
import UsersPage from './pages/UsersPage';
import RecipeDetailPage from './pages/RecipeDetailPage';

const App = () => {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="recipes" element={<RecipePage />} />
        <Route path="recipes/:id" element={<RecipeDetailPage />} />
        <Route path="profile" element={<UsersPage />} />
      </Routes>
    </RootLayout>
  );
};

export default App;
