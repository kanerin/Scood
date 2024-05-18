class CreateEventsDates < ActiveRecord::Migration[7.1]
  def change
    create_table :events_dates do |t|
      t.integer :event_id, null: false
      t.date :event_date

      t.index :event_id
      t.foreign_key :events, column: :event_id
    end
  end
end
