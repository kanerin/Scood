import React from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import { copyTextToClipboard } from '../helpers/helpers';

const Event = ({ events, onDelete }) => {
  const { identifier } = useParams();
  let event;

  if (/^\d+$/.test(identifier)) {
    event = events.find((e) => e.id === Number(identifier));
  } else {
    event = events.find((e) => e.url_hash === identifier);
  }

  // events_datesが空かどうかを確認し、デフォルト値を設定する
  const firstEventDate = event && event.events_dates.length > 0 ? event.events_dates[0].event_date : 'No Date Available';
  
  return (
    <div className="eventContainer">
      <h2>
        {firstEventDate} {/* 安全に日程を表示 */}
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
          <strong>Dates:</strong>
          {event.events_dates.map((date, index) => (
            <span key={index}>{date.event_date}, </span> // 安全に日程を列挙
          ))}
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
        <li className="url-container">
          <strong>URL: </strong>
          <Link to={`/events/${event.url_hash}`}>
            {`http://localhost:3001/events/${event.url_hash}`}
          </Link>
          <button className="copy-button" onClick={() => copyTextToClipboard(`http://localhost:3001/events/${event.url_hash}`)}>Copy</button>
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
      events_dates: PropTypes.arrayOf(
        PropTypes.shape({
          event_date: PropTypes.string.isRequired
        })
      ).isRequired,
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