import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddApartment from './pages/AddApartment';
import EditApartment from './pages/EditApartment';
import Navbar from './components/Navbar';
import LoginSuccess from './pages/LoginSuccess';
import Cartes from './pages/Cartes';
import Contact from './pages/Contact';
import ApartmentDetails from './pages/ApartmentDetails';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddApartment />} />
          <Route path="/edit/:id" element={<EditApartment />} />
          <Route path="/cartes" element={<Cartes />} />
          <Route path="/apartment/:id" element={<ApartmentDetails />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}



  





