import React from 'react';
import Editor from './Editor';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './App.css';

const App = () => (
    <>
      <Routes>
        <Route path="events/*" element={<Editor />} />
      </Routes>
      <ToastContainer />
    </>
);

export default App;