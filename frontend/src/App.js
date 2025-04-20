import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import RootLayout from './components/layout/RootLayout';
import UsersPage from './pages/UsersPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import MyRecipes from './pages/MyRecipes';
import LoginPage from './pages/LoginPage';
import CategoryPage from './pages/CategoryPage';
import ProtectedRoute from './components/route/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import IngredientUnitPage from './pages/IngredientUnitPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="recipes" element={<RecipePage />} />
        <Route path="recipes/:id" element={<RecipeDetailPage />} />
        <Route
          path="my-recipes"
          element={
            <ProtectedRoute allowedRoles={['user', 'superuser']}>
              <MyRecipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={['superuser', 'user']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="categories"
          element={
            <ProtectedRoute allowedRoles={['superuser']}>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ingredient-units"
          element={
            <ProtectedRoute allowedRoles={['superuser']}>
              <IngredientUnitPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
