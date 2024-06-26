class EventTime < ApplicationRecord
  belongs_to :event

  validates :start_at, presence: true
  validates :end_at, presence: true
end
