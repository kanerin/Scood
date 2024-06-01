class CreateEventUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :event_users do |t|
      t.references :event, null: false, foreign_key: true
      t.string :name
      t.string :password
      t.references :comment, foreign_key: true
      t.timestamps
    end
  end
end