import React from 'react';
import PropTypes from 'prop-types';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Event = ({ events, onDelete }) => {
  const { identifier } = useParams();
  const navigate = useNavigate(); // Use useNavigate hook to get the navigate function
  let event;

  if (/^\d+$/.test(identifier)) {
    // identifierが数字のみで構成されている場合はidとして扱う
    event = events.find((e) => e.id === Number(identifier));
  } else {
    // そうでない場合はurl_hashとして扱う
    event = events.find((e) => e.url_hash === identifier);
  }

  return (
    <div className="eventContainer">
      <h2>
        {event.title}
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
          <strong>Title:</strong> {event.title}
        </li>
        <li>
          <strong>Published:</strong> {event.published ? 'Yes' : 'No'}
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
      title: PropTypes.string.isRequired,
      published: PropTypes.bool.isRequired,
      url_hash: PropTypes.string.isRequired,
      password: PropTypes.string, // パスワードは必須ではない可能性があるため、isRequiredを付けていません。
      event_date_type: PropTypes.number // event_date_typeは整数型として定義
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Event;
