import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/auth/event/${identifier}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem(`event_${data.event_id}_password`, password);
        navigate(`/events/${identifier}/edit`);
      } else {
        setError('Incorrect password');
      }
    })
    .catch(() => setError('An error occurred. Please try again.'));
  };

  return (
    <div>
      <h2>Authenticate</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AuthForm;