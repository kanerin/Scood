# app/controllers/register_controller.rb
class RegisterController < ApplicationController
  def new
    @event = Event.find_by(url_hash: params[:identifier]) || Event.find_by(id: params[:identifier])
    if @event
      render :new
    else
      render plain: "Event not found", status: 404
    end
  end

  def create
    event = Event.find_by(url_hash: params[:identifier]) || Event.find_by(id: params[:identifier])
    if event
      ActiveRecord::Base.transaction do
        comment = Comment.create!(message: params[:comment])
        event_user = EventUser.create!(event_id: event.id, name: params[:name], password: params[:password], comment_id: comment.id)
        Candidate.create!(event_id: event.id, event_user_id: event_user.id, start_at: params[:start_at], end_at: params[:end_at])
      end
      render json: { success: true }, status: :created
    else
      render json: { success: false, message: "Event not found" }, status: :not_found
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { success: false, message: e.message }, status: :unprocessable_entity
  end
end