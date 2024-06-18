import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import Auth from './Auth';
import Register from './Register'; // 新しいコンポーネントをインポート
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // APIからイベントを取得するコード
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  return (
    <>
      <Routes>
        <Route path="events/*" element={<Editor />} />
        <Route path="auth/:identifier" element={<Auth events={events} />} />
        <Route path="register/:identifier" element={<Register events={events} />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;