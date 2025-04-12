import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import RootLayout from './components/layout/RootLayout';
import UsersPage from './pages/UsersPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import MyRecipes from './pages/MyRecipes';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="recipes" element={<RecipePage />} />
        <Route path="recipes/:id" element={<RecipeDetailPage />} />
        <Route path="profile" element={<UsersPage />} />
        <Route path="my-recipes" element={<MyRecipes />} />
      </Route>
    </Routes>
  );
};

export default App;
