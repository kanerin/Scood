# Clear existing data with the correct order to respect foreign key constraints
Candidate.delete_all
EventUser.delete_all
EventTime.delete_all
Comment.delete_all
Event.delete_all

# Create sample events
events = Event.create!([
  {
    title: 'Event 1',
    published: true,
    url_hash: 'urlhash1',
    password: 'password1',
    event_date_type: 1
  },
  {
    title: 'Event 2',
    published: false,
    url_hash: 'urlhash2',
    password: 'password2',
    event_date_type: 2
  },
  {
    title: 'Event 3',
    published: true,
    url_hash: 'urlhash3',
    password: 'password3',
    event_date_type: 1
  }
])

# Create sample event times
event_times = EventTime.create!([
  {
    event: events[0],
    start_at: '2024-06-01 10:00:00',
    end_at: '2024-06-01 12:00:00'
  },
  {
    event: events[0],
    start_at: '2024-06-02 14:00:00',
    end_at: '2024-06-02 16:00:00'
  },
  {
    event: events[1],
    start_at: '2024-07-01 09:00:00',
    end_at: '2024-07-01 11:00:00'
  },
  {
    event: events[2],
    start_at: '2024-08-01 13:00:00',
    end_at: '2024-08-01 15:00:00'
  }
])

# Create sample comments
comments = Comment.create!([
  { message: 'This is a comment for event 1' },
  { message: 'This is a comment for event 2' },
  { message: 'This is a comment for event 3' }
])

# Create sample event users
event_users = EventUser.create!([
  {
    event: events[0],
    name: 'User 1',
    password: 'user1password',
    comment: comments[0]
  },
  {
    event: events[1],
    name: 'User 2',
    password: 'user2password',
    comment: comments[1]
  },
  {
    event: events[2],
    name: 'User 3',
    password: 'user3password',
    comment: comments[2]
  }
])

# Create sample candidates
candidates = Candidate.create!([
  {
    event: events[0],
    event_user: event_users[0],
    event_time: event_times[0]
  },
  {
    event: events[1],
    event_user: event_users[1],
    event_time: event_times[2]
  },
  {
    event: events[2],
    event_user: event_users[2],
    event_time: event_times[3]
  }
])

puts "Seeded #{Event.count} events, #{EventTime.count} event times, #{Comment.count} comments, #{EventUser.count} event users, and #{Candidate.count} candidates"