import React, { useState, useRef, useEffect } from 'react';
import { formatDate, isEmptyObject, validateEvent } from '../helpers/helpers';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
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
    event_type: '',
    events_dates: [],
    title: '',
    speaker: '',
    host: '',
    published: false,
  };

  const resetForm = () => {
    setEvent(defaults);
    setFormErrors({});
  };

  const currEvent = id ? events.find((e) => e.id === Number(id)) : {};
  const initialEventState = { ...defaults, ...currEvent };
  const [event, setEvent] = useState(initialEventState);
  const [formErrors, setFormErrors] = useState({});

  const dateInput = useRef(null);

  useEffect(() => {
    const p = new Pikaday({
      field: dateInput.current,
      onSelect: (date) => {
        const formattedDate = formatDate(date);
        updateEvent('events_dates', [{ event_date: formattedDate }]);
      },
    });
  
    if (event.events_dates.length > 0 && event.events_dates[0].event_date) {
      p.setDate(new Date(event.events_dates[0].event_date));
    }
  
    return () => p.destroy();
  }, [identifier]);

  useEffect(() => {
    if (isNewEvent) {
      resetForm();
    }
  }, [isNewEvent]);

  const handleInputChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    updateEvent(name, value);
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
    const p = new Pikaday({
      field: dateInput.current,
      onSelect: (date) => {
        const formattedDate = formatDate(date);
        updateEvent('event_date', formattedDate);
      },
    });

    // 初回のPikaday初期化時に、event_dateが存在する場合は日付をセット
    if (event.event_date) {
      p.setDate(new Date(event.event_date));
    }

    // useEffectのクリーンアップ関数内でPikadayを破棄
    return () => p.destroy();
  }, [identifier]); // identifierが変更されたときに再度Pikadayを初期化

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
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input
              type="text"
              id="event_type"
              name="event_type"
              onChange={handleInputChange}
              value={event.event_type}
            />
          </label>
        </div>
        <div>
          <label htmlFor="event_date">
            <strong>Date:</strong>
            <input
              type="text"
              id="event_date"
              ref={dateInput}
              autoComplete="off"
              value={event.events_dates[0] ? event.events_dates[0].event_date : ''}
              onChange={() => {}} // No need to change from here as date is set via Pikaday
            />
          </label>
        </div>
        <div>
          <label htmlFor="title">
            <strong>Title:</strong>
            <textarea
              cols="30"
              rows="10"
              id="title"
              name="title"
              onChange={handleInputChange}
              value={event.title}
            />
          </label>
        </div>
        <div>
          <label htmlFor="speaker">
            <strong>Speakers:</strong>
            <input
              type="text"
              id="speaker"
              name="speaker"
              onChange={handleInputChange}
              value={event.speaker}
            />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Hosts:</strong>
            <input
              type="text"
              id="host"
              name="host"
              onChange={handleInputChange}
              value={event.host}
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
        <div className="form-actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

EventForm.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      event_type: PropTypes.string.isRequired,
      events_dates: PropTypes.arrayOf(
        PropTypes.shape({
          event_date: PropTypes.string.isRequired
        })
      ).isRequired,
      title: PropTypes.string.isRequired,
      speaker: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired,
      published: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onSave: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
    events: [],
};

export default EventForm;