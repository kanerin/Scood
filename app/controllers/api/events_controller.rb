class Api::EventsController < ApplicationController
  def index
    @events = Event.all
    render json: @events
  end

  def show
    @event = Event.find(params[:id])
    @candidates = @event.candidates.includes(event_user: :comment)
    render json: {
      event: @event,
      candidates: @candidates.map do |candidate|
        {
          id: candidate.id,
          start_at: candidate.start_at,
          end_at: candidate.end_at,
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
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    @event = Event.find(params[:id])
    if @event.update(event_params)
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

  private

  def event_params
    params.require(:event).permit(:title, :published, :password, :event_date_type, :url_hash)
  end
end