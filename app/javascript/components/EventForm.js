import React, { useState, useEffect } from 'react';
import { isEmptyObject, validateEvent } from '../helpers/helpers';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import './EventForm.css';
import 'pikaday/css/pikaday.css';

// Helper function to format the date-time strings
const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';  // Invalid date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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
    event_date_type: 0,
    event_times: [{ start_at: '', end_at: '' }]
  };

  const resetForm = () => {
    setEvent(defaults);
    setFormErrors({});
  };

  const currEvent = id ? events.find((e) => e.id === Number(id)) : {};
  const initialEventState = {
    ...defaults,
    ...currEvent,
    event_times: (currEvent.event_times || [{ start_at: '', end_at: '' }]).map((time) => ({
      start_at: formatDateTime(time.start_at),
      end_at: formatDateTime(time.end_at)
    }))
  };
  initialEventState.event_date_type = Number(initialEventState.event_date_type);
  const [event, setEvent] = useState(initialEventState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { target } = e;
    const { name, value, type } = target;
    const newValue = type === 'checkbox' ? target.checked : (type === 'radio' ? parseInt(value, 10) : value);
    updateEvent(name, newValue);
  };

  const handleEventTimeChange = (index, field, value) => {
    const newEventTimes = event.event_times.map((time, i) => {
      if (i === index) {
        return { ...time, [field]: value };
      }
      return time;
    });
    updateEvent('event_times', newEventTimes);
  };

  const addEventTime = () => {
    const newEventTimes = [...event.event_times, { start_at: '', end_at: '' }];
    updateEvent('event_times', newEventTimes);
  };

  const removeEventTime = (index) => {
    const newEventTimes = event.event_times.filter((_, i) => i !== index);
    updateEvent('event_times', newEventTimes);
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
    } else {
      fetch(`/api/events/${id}/event_times`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched event_times:', data);  // Debugging line
          setEvent((prevEvent) => ({
            ...prevEvent,
            event_times: data.map((time) => ({
              start_at: formatDateTime(time.start_at),
              end_at: formatDateTime(time.end_at)
            }))
          }));
        })
        .catch((error) => console.error('Error fetching event times:', error));
    }
  }, [isNewEvent, id]);

  useEffect(() => {
    console.log('Event:', event);
    event.event_times.forEach((time, index) => {
      console.log(`Event Time ${index + 1} - Start: ${time.start_at}, End: ${time.end_at}`);
    });
  }, [event]);

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
        <div>
          <strong>Event Times:</strong>
          {event.event_times.map((time, index) => (
            <div key={index}>
              <label>
                Start At:
                <input
                  type="datetime-local"
                  value={time.start_at}
                  onChange={(e) => handleEventTimeChange(index, 'start_at', e.target.value)}
                />
              </label>
              <label>
                End At:
                <input
                  type="datetime-local"
                  value={time.end_at}
                  onChange={(e) => handleEventTimeChange(index, 'end_at', e.target.value)}
                />
              </label>
              <button type="button" onClick={() => removeEventTime(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addEventTime}>
            Add Event Time
          </button>
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
      event_times: PropTypes.arrayOf(
        PropTypes.shape({
          start_at: PropTypes.string,
          end_at: PropTypes.string,
        })
      ),
    })
  ),
  onSave: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
events: [],
};