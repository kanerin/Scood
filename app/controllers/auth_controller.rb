# app/controllers/auth_controller.rb
require 'jwt'

class AuthController < ApplicationController
    SECRET_KEY = Rails.application.secrets.secret_key_base.to_s
  
    def authenticate
        @event = Event.find_by(url_hash: params[:identifier])
        if @event.password == params[:password]
            token = JWT.encode({ event_id: @event.id }, SECRET_KEY, 'HS256')
            render json: { token: token }, status: :ok
        else
            render json: @event, status: :unauthorized
        end
    end
  
    def verify
      token = request.headers['Authorization'].split(' ').last
      decoded_token = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })
      event_id = decoded_token[0]['event_id']
      event = Event.find_by(url_hash: params[:identifier]).id
      Rails.logger.info "Decoded event_id from token: #{event_id}"
      Rails.logger.info "Decoded event_id from token: #{event}"
      if event_id == event
        render json: { message: 'Authenticated' }, status: :ok
      else
        render json: { error: 'Invalid token' }, status: :unauthorized
      end
    rescue JWT::DecodeError
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end
  