class AuthController < ApplicationController
    def new
      head :no_content
    end
  
    def create
      identifier = params[:identifier]
      event = if identifier.match?(/^\d+$/)
                Event.find_by(id: identifier)
              else
                Event.find_by(url_hash: identifier)
              end
  
      if event && event.password == params[:password]
        render json: { success: true, redirect_url: edit_event_path(event) }
      else
        render json: { success: false, message: 'Incorrect password' }, status: :unauthorized
      end
    end
  end