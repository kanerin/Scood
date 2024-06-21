class EventUser < ApplicationRecord
  belongs_to :event
  belongs_to :comment, optional: true
  has_many :candidates
end
