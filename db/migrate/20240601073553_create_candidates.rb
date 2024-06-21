class CreateCandidates < ActiveRecord::Migration[6.0]
  def change
    create_table :candidates do |t|
      t.references :event, null: false, foreign_key: true
      t.references :event_user, null: false, foreign_key: true
      t.datetime :start_at, null: false
      t.datetime :end_at, null: false
      t.timestamps
    end
  end
end