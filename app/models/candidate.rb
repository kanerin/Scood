class Candidate < ApplicationRecord
  belongs_to :event
  belongs_to :event_user
end
