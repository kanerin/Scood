import React from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';

const Event = ({ events, onDelete }) => {
  const { identifier } = useParams();
  let event;

  if (/^\d+$/.test(identifier)) {
    // identifierが数字のみで構成されている場合はidとして扱う
    event = events.find((e) => e.id === Number(identifier));
  } else {
    // そうでない場合はurl_hashとして扱う
    event = events.find((e) => e.url_hash === identifier);
  }
  // pushするためにコメント追加
  
  return (
    <div className="eventContainer">
      <h2>
        {event.event_date}
        {' - '}
        {event.event_type}
        <Link to={`/events/${identifier}/edit`}>Edit</Link>
        <button
            className="delete"
            type="button"
            onClick={() => onDelete(event.id)}
        >
            Delete
        </button>
    </h2>
      <ul>
        <li>
          <strong>Type:</strong> {event.event_type}
        </li>
        <li>
          <strong>Date:</strong> {event.event_date}
        </li>
        <li>
          <strong>Title:</strong> {event.title}
        </li>
        <li>
          <strong>Speaker:</strong> {event.speaker}
        </li>
        <li>
          <strong>Host:</strong> {event.host}
        </li>
        <li>
          <strong>Published:</strong> {event.published ? 'yes' : 'no'}
        </li>
        <li>
          <strong>URL:</strong>
          <Link to={`/events/${event.url_hash}`}>
            {`http://localhost:3001/events/${event.url_hash}`}
          </Link>
        </li>
      </ul>
    </div>
  );
};

Event.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      event_type: PropTypes.string.isRequired,
      event_date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      speaker: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired,
      published: PropTypes.bool.isRequired,
      url_hash: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Event;