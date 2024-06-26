import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Register = ({ events }) => {
  const { identifier } = useParams();
  const event = /^\d+$/.test(identifier)
    ? events.find((e) => e.id === Number(identifier))
    : events.find((e) => e.url_hash === identifier);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [comment, setComment] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [message, setMessage] = useState('');
  const [eventTimes, setEventTimes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventTimes = async () => {
      if (event) {
        const response = await fetch(`/api/events/${event.id}/event_times`);
        const data = await response.json();
        setEventTimes(data);
      }
    };

    fetchEventTimes();
  }, [event]);

  const handleCheckboxChange = (timeId) => {
    setSelectedTimes((prevSelectedTimes) => {
      if (prevSelectedTimes.includes(timeId)) {
        return prevSelectedTimes.filter((id) => id !== timeId);
      } else {
        return [...prevSelectedTimes, timeId];
      }
    });
  };

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
        event_time_ids: selectedTimes,
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
          <strong>Select Event Times:</strong>
          {eventTimes.map((time) => (
            <div key={time.id}>
              <label>
                <input
                  type="checkbox"
                  value={time.id}
                  checked={selectedTimes.includes(time.id)}
                  onChange={() => handleCheckboxChange(time.id)}
                />
                {new Date(time.start_at).toLocaleString()} - {new Date(time.end_at).toLocaleString()}
              </label>
            </div>
          ))}
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;