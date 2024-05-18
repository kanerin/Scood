class Api::EventsController < ApplicationController
  before_action :set_event, only: %i[show update destroy]

  def index
    @events = Event.includes(:events_dates).all
    render json: @events, include: :events_dates
  end

  def show
    render json: @event, include: :events_dates
  end

  def create
    @event = Event.new(event_params.except(:event_dates))
    if @event.save
      update_event_dates(@event, params[:event][:event_dates])
      render json: @event, include: :events_dates, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    if @event.update(event_params.except(:event_dates))
      update_event_dates(@event, params[:event][:event_dates])
      render json: @event, include: :events_dates, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @event.destroy
  end

  private

  def set_event
    @event = Event.includes(:events_dates).find(params[:id])
  end

  def event_params
    params.require(:event).permit(
      :event_type,
      :title,
      :speaker,
      :host,
      :published,
      :url_hash,
      event_dates_attributes: [:event_date]
    )
  end

  def update_event_dates(event, dates)
    return unless dates  # datesがnilの場合は処理を終了
    event.events_dates.destroy_all  # 既存の日程を一旦削除
    dates.each do |date|
      event.events_dates.create(event_date: date)
    end
  end
end
