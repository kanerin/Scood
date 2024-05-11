class AddUrlHashToEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :events, :url_hash, :string
  end
end
