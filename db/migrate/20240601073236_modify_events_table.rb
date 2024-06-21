class ModifyEventsTable < ActiveRecord::Migration[6.0]
  def change
    # 不要なカラムを削除
    remove_column :events, :event_type, :string
    remove_column :events, :event_date, :date
    remove_column :events, :speaker, :string
    remove_column :events, :host, :string

    # 新しいカラムを追加
    add_column :events, :password, :string
    add_column :events, :event_date_type, :integer
  end
end
