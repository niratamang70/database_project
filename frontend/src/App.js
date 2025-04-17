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

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="recipes" element={<RecipePage />} />
        <Route
          path="recipes/:id"
          element={
            <ProtectedRoute allowedRoles={['user', 'superuser']}>
              <RecipeDetailPage />
            </ProtectedRoute>
          }
        />
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
      </Route>
    </Routes>
  );
};

export default App;
