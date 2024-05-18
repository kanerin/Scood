class RemoveEventDateFromEvents < ActiveRecord::Migration[7.1]
  def change
    remove_column :events, :event_date, :date
  end
end
