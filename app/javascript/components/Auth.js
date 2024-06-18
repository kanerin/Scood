import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

const Auth = ({ event, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLocalStorageChecked, setIsLocalStorageChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPassword = localStorage.getItem(event.id);
    if (storedPassword) {
      authenticateWithLocalStorage(storedPassword);
    } else {
      setIsLocalStorageChecked(true);
    }
  }, [event]);

  const authenticateWithLocalStorage = async (storedPassword) => {
    const response = await fetch(`/auth/${event.url_hash}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: storedPassword }),
    });

    const data = await response.json();

    if (data.success) {
      onSuccess();
    } else {
      setIsLocalStorageChecked(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/auth/${event.url_hash}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem(event.id, password);
      onSuccess();
    } else {
      alert(data.message || 'Incorrect password');
    }
  };

  return (
    <div className="authContainer">
      <h2>Authenticate Event</h2>
      {isLocalStorageChecked && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">
              Password:
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

Auth.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    password: PropTypes.string.isRequired,
    url_hash: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default Auth;