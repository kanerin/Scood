class Api::EventsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @events = Event.all
    render json: @events
  end

  def show
    @event = Event.find(params[:id])
    @candidates = @event.candidates.includes(event_user: :comment, event_time: :event)
    render json: {
      event: @event,
      candidates: @candidates.map do |candidate|
        {
          id: candidate.id,
          start_at: candidate.event_time&.start_at,
          end_at: candidate.event_time&.end_at,
          event_user: {
            name: candidate.event_user.name,
            comment: candidate.event_user.comment&.message
          }
        }
      end
    }
  end

  def create
    @event = Event.new(event_params)
    if @event.save
      Rails.logger.debug("Event created with params: #{params[:event]}")
      create_event_times(@event) if params[:event][:event_times].present?
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    @event = Event.find(params[:id])
    if @event.update(event_params)
      @event.event_times.destroy_all
      Rails.logger.debug("Event updated with params: #{params[:event]}")
      create_event_times(@event) if params[:event][:event_times].present?
      render json: @event
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy
    head :no_content
  end

  def event_times
    @event = Event.find(params[:id])
    render json: @event.event_times
  end

  private

  def event_params
    params.require(:event).permit(:title, :published, :password, :event_date_type, :url_hash, event_times: [:start_at, :end_at])
  end

  def create_event_times(event)
    params[:event][:event_times].each do |time|
      event.event_times.create!(start_at: time[:start_at], end_at: time[:end_at], event_id: event.id)
    end
  end
end