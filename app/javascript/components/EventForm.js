import React, { useState, useRef, useEffect } from 'react';
import { formatDate, isEmptyObject, validateEvent } from '../helpers/helpers';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import './EventForm.css'; 
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';

const EventForm = ({ events, onSave }) => {
  const { identifier } = useParams();
  const isNewEvent = !identifier;
  let id;

  if (/^\d+$/.test(identifier)) {
    id = identifier;
  } else {
    id = events.find((e) => e.url_hash === identifier)?.id;
  }

  const defaults = {
    title: '',
    published: false,
    password: '',
    event_date_type: 0,  // デフォルト値を設定
  }

  const resetForm = () => {
    setEvent(defaults);
    setFormErrors({});
  };

  const currEvent = id ? events.find((e) => e.id === Number(id)) : {};
  const initialEventState = { ...defaults, ...currEvent }
  initialEventState.event_date_type = Number(initialEventState.event_date_type); // 数値として扱う
  const [event, setEvent] = useState(initialEventState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { target } = e;
    const { name, value, type } = target;
    const newValue = type === 'checkbox' ? target.checked : (type === 'radio' ? parseInt(value, 10) : value);
    updateEvent(name, newValue);
  };

  const renderErrors = () => {
    if (isEmptyObject(formErrors)) {
      return null;
    }

    return (
      <div className="errors">
        <h3>The following errors prohibited the event from being saved:</h3>
        <ul>
          {Object.values(formErrors).map((formError) => (
            <li key={formError}>{formError}</li>
          ))}
        </ul>
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEvent(event);

    if (!isEmptyObject(errors)) {
      setFormErrors(errors);
    } else {
      onSave(event);
    }
  };

  useEffect(() => {
    if (isNewEvent) {
      resetForm();
    }
  }, [isNewEvent]);

  const updateEvent = (key, value) => {
    setEvent((prevEvent) => ({ ...prevEvent, [key]: value }));
  };

  return (
    <div>
      <h2>{isNewEvent ? 'New Event' : 'Edit Event'}</h2>
      {renderErrors()}
  
      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">
            <strong>Title:</strong>
            <input
              type="text"
              id="title"
              name="title"
              onChange={handleInputChange}
              value={event.title}
            />
          </label>
        </div>
        <div>
          <label htmlFor="published">
            <strong>Publish:</strong>
            <input
              type="checkbox"
              id="published"
              name="published"
              onChange={handleInputChange}
              checked={event.published}
            />
          </label>
        </div>
        <div>
          <label htmlFor="password">
            <strong>Password:</strong>
            <input
              type="text"
              id="password"
              name="password"
              onChange={handleInputChange}
              value={event.password}
            />
          </label>
        </div>
        <div>
          <strong>Date Type:</strong>
          <label>
            <input
              type="radio"
              name="event_date_type"
              value="0"
              checked={event.event_date_type === 0}
              onChange={handleInputChange}
            /> 15分
          </label>
          <label>
            <input
              type="radio"
              name="event_date_type"
              value="1"
              checked={event.event_date_type === 1}
              onChange={handleInputChange}
            /> 1時間
          </label>
          <label>
            <input
              type="radio"
              name="event_date_type"
              value="2"
              checked={event.event_date_type === 2}
              onChange={handleInputChange}
            /> 1日
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;

EventForm.propTypes = {
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        published: PropTypes.bool.isRequired,
        password: PropTypes.string,
        event_date_type: PropTypes.number,
      })
    ),
    onSave: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
    events: [],
};