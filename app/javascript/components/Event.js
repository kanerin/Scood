import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Auth from './Auth';

const Event = ({ events, onDelete }) => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    let event;
    if (/^\d+$/.test(identifier)) {
      event = events.find((e) => e.id === Number(identifier));
    } else {
      event = events.find((e) => e.url_hash === identifier);
    }
    setCurrentEvent(event);
  }, [identifier, events]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (currentEvent) {
        try {
          const response = await fetch(`/api/events/${currentEvent.id}`);
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
  }, [currentEvent]);

  const handleEdit = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    navigate(`/events/${identifier}/edit`);
  };

  const handleRegister = () => {
    navigate(`/register/${identifier}`);
  };

  if (!currentEvent) {
    return <div>Event not found</div>;
  }

  return (
    <div className="eventContainer">
      {showAuth ? (
        <Auth event={currentEvent} onSuccess={handleAuthSuccess} />
      ) : (
        <>
          <h2>
            {eventDetails ? eventDetails.title : 'Loading...'}
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
          {eventDetails && (
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
          )}
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
        </>
      )}
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
      event_date_type: PropTypes.number
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Event;