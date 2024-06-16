import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Auth = ({ events }) => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { identifier } = useParams();

  if (/^\d+$/.test(identifier)) {
    id = identifier;
  } else {
    id = events.find((e) => e.url_hash === identifier);
  }

  const handleAuth = async () => {
    const response = await fetch(`/events/${id}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      navigate(`/events/${id}/edit`);
    } else {
      alert('パスワードが間違っています');
    }
  };

  return (
    <div>
      <h2>イベント認証</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワードを入力してください"
      />
      <button onClick={handleAuth}>認証</button>
    </div>
  );
};

export default Auth;