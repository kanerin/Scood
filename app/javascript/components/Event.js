import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Event = ({ events, onDelete }) => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      const event = /^\d+$/.test(identifier)
        ? events.find((e) => e.id === Number(identifier))
        : events.find((e) => e.url_hash === identifier);
        
      if (event) {
        try {
          const response = await fetch(`/api/events/${event.id}`);
          if (!response.ok) throw new Error('Failed to fetch event details');
          const data = await response.json();
          setEventDetails(data.event);
          setCandidates(data.candidates);
        } catch (error) {
          console.error('Error fetching event details:', error);
        }
      }
    };
    
    fetchEventDetails();
  }, [identifier, events]);

  const handleEdit = () => {
    const password = prompt("パスワードを入力してください:");
    if (password === eventDetails.password) {
      navigate(`/events/${identifier}/edit`);
    } else {
      alert("パスワードが間違っています。");
    }
  };

  const handleRegister = () => {
    navigate(`/register/${identifier}`);
  };

  if (!eventDetails) {
    return <div>Event not found</div>;
  }

  return (
    <div className="eventContainer">
      <h2>
        {eventDetails.title}
        <button
          className="edit"
          type="button"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          className="delete"
          type="button"
          onClick={() => onDelete(eventDetails.id)}
        >
          Delete
        </button>
        <button
          className="register"
          type="button"
          onClick={handleRegister}
        >
          Register
        </button>
      </h2>
      <ul>
        <li>
          <strong>Title:</strong> {eventDetails.title}
        </li>
        <li>
          <strong>Published:</strong> {eventDetails.published ? 'Yes' : 'No'}
        </li>
        <li>
          <strong>URL:</strong>
          <Link to={`/events/${eventDetails.url_hash}`}>
            {`http://localhost:3001/events/${eventDetails.url_hash}`}
          </Link>
        </li>
      </ul>
      <h3>回答内容:</h3>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            <p>名前: {candidate.event_user.name}</p>
            <p>開始時間: {new Date(candidate.start_at).toLocaleString()}</p>
            <p>終了時間: {new Date(candidate.end_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

Event.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      published: PropTypes.bool.isRequired,
      url_hash: PropTypes.string.isRequired,
      password: PropTypes.string,
      event_date_type: PropTypes.number,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Event;