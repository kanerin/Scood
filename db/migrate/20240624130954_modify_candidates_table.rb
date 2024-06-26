class ModifyCandidatesTable < ActiveRecord::Migration[6.0]
  def up
    add_column :candidates, :event_time_id, :integer, null: true
    add_index :candidates, :event_time_id

    # 既存のレコードに対して適切なデフォルト値を設定
    Candidate.update_all(event_time_id: 1) # 適切なデフォルト値を設定してください

    change_column_null :candidates, :event_time_id, false
    remove_column :candidates, :start_at, :datetime
    remove_column :candidates, :end_at, :datetime
  end

  def down
    add_column :candidates, :start_at, :datetime, null: false
    add_column :candidates, :end_at, :datetime, null: false

    remove_index :candidates, :event_time_id
    remove_column :candidates, :event_time_id
  end
end