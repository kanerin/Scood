class EventUser < ApplicationRecord
  belongs_to :event
  belongs_to :comment, optional: true
  has_many :candidates

  # 他の関連付けがある場合はここに追加
end