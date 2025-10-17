import React from 'react'
import { Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Merch from './pages/Merch';
import Event from './pages/Event';
import Sale from './pages/Sale';
import Inventory from './pages/Inventory';
import EditProduct from './components/EditProduct';
import Invoice from './pages/Invoice';
const App = () => {
  return (
    <div data-theme="valentine" className="caret-transparent">
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Login/>
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/event" element ={
          <ProtectedRoute>
            <Event/>
          </ProtectedRoute>
        }/>
        <Route path="/event/:id/merch" element ={
          <ProtectedRoute>
            <Merch/>
          </ProtectedRoute>
        }/>
        <Route path="/event/:id/sale" element ={
          <ProtectedRoute>
            <Sale/>
          </ProtectedRoute>
        }/>
        <Route path="/inventory" element ={
          <ProtectedRoute>
            <Inventory/>
          </ProtectedRoute>
        }/>
        <Route path="/invoices" element={
          <ProtectedRoute>
            <Invoice/>
          </ProtectedRoute>
        }/>
      </Routes>
      
    </div>
  )
}

export default App
