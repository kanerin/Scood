import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

const EventList = ({ events }) => {
    const renderEvents = (eventArray) => {
        // イベントのソート方法を変更する必要がある場合はここを修正
        return eventArray.map((event) => (
          <li key={event.id}>
            <NavLink to={`/events/${event.url_hash}`}>
              {event.title}
            </NavLink>
          </li>
        ));
    };

    return (
        <section className="eventList">
          <h2>
            Events
            <Link to="/events/new">New Event</Link>
          </h2>
          <ul>{renderEvents(events)}</ul>
        </section>
    );
};

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    url_hash: PropTypes.string.isRequired,
    password: PropTypes.string,
    event_date_type: PropTypes.number
  })).isRequired,
};

export default EventList;