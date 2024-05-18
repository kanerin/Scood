import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

const EventList = ({ events }) => {
    const renderEvents = (eventArray) => {
      eventArray.sort((a, b) => {
          const dateA = a.events_dates[0] ? new Date(a.events_dates[0].event_date) : new Date();
          const dateB = b.events_dates[0] ? new Date(b.events_dates[0].event_date) : new Date();
          return dateB - dateA;
      });

      return eventArray.map((event) => (
        <li key={event.id}>
          <NavLink to={`/events/${event.id}`}>
            {event.events_dates.length > 0 ? event.events_dates[0].event_date : 'No Date Available'}
            {' - '}
            {event.event_type}
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
    id: PropTypes.number,
    event_type: PropTypes.string,
    events_dates: PropTypes.arrayOf(PropTypes.shape({
      event_date: PropTypes.string
    })),
    title: PropTypes.string,
    speaker: PropTypes.string,
    host: PropTypes.string,
    published: PropTypes.bool,
  })).isRequired,
};

export default EventList;