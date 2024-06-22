# db/seeds.rb

# 既存データの削除
Event.destroy_all
Event.destroy_all
EventTime.destroy_all
EventUser.destroy_all
Candidate.destroy_all
Comment.destroy_all

# イベントデータのシード
Event.create!([
  { title: 'Event 1', event_date_type: 1, password: 'password1' },
  { title: 'Event 2', event_date_type: 2, password: 'password2' }
])

# イベント時間のシード
EventTime.create!([
  { event_id: 1, start_at: '2024-06-01 10:00:00', end_at: '2024-06-01 12:00:00' },
  { event_id: 2, start_at: '2024-07-01 14:00:00', end_at: '2024-07-01 16:00:00' }
])

# イベントユーザーのシード
EventUser.create!([
  { event_id: 1, name: 'User1', password: 'password' },
  { event_id: 2, name: 'User2', password: 'password' }
])

# 候補者のシード
Candidate.create!([
  { event_id: 1, event_user_id: 1, start_at: '2024-06-01 10:00:00', end_at: '2024-06-01 12:00:00' },
  { event_id: 2, event_user_id: 2, start_at: '2024-07-01 14:00:00', end_at: '2024-07-01 16:00:00' }
])

# コメントのシード
Comment.create!([
  { message: 'This is a comment for event 1.' },
  { message: 'This is a comment for event 2.' }
])