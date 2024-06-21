class CreateEventTimes < ActiveRecord::Migration[6.0]
  def change
    create_table :event_times do |t|
      t.references :event, null: false, foreign_key: true
      t.datetime :start_at, null: false
      t.datetime :end_at, null: false
      t.timestamps
    end
  end
end