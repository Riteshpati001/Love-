import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProposal from './pages/CreateProposal';
import ProposalView from './pages/ProposalView';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateProposal />} />
        <Route path="/p/:link" element={<ProposalView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
