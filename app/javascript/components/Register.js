import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Register = ({ events }) => {
  const { identifier } = useParams();
  const event = /^\d+$/.test(identifier)
    ? events.find((e) => e.id === Number(identifier))
    : events.find((e) => e.url_hash === identifier);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/register/${identifier}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
        comment,
        start_at: startAt,
        end_at: endAt,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setMessage('Registration successful!');
      navigate(`/events/${identifier}`);
    } else {
      setMessage(data.message || 'Registration failed.');
    }
  };

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <h2>Register for Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="startAt">Start At:</label>
          <input
            type="datetime-local"
            id="startAt"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endAt">End At:</label>
          <input
            type="datetime-local"
            id="endAt"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;