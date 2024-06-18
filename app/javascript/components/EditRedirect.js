import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditRedirect = ({ events, setEditingEvent }) => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  let event;

  if (/^\d+$/.test(identifier)) {
    event = events.find((e) => e.id === Number(identifier));
  } else {
    event = events.find((e) => e.url_hash === identifier);
  }

  useEffect(() => {
    if (event) {
      const storedPassword = localStorage.getItem(`event_${event.id}_password`);
      if (storedPassword === event.password) {
        setEditingEvent(event);
        console.log(`Navigating to edit page for event ID: ${event.id}`);
        navigate(`/events/${identifier}/edit`);
      } else {
        navigate(`/auth/event/${identifier}`);
      }
    }
  }, [event, identifier, navigate, setEditingEvent]);

  return null;
};

export default EditRedirect;