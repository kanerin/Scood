Rails.application.routes.draw do
  get 'register/new'
  get 'register/create'
  root 'pages#index'
  get 'about', to: 'pages#about'

  namespace :api do
    resources :events, only: %i[index show create update destroy] do
      member do
        get :event_times
      end
    end
  end

  get 'events', to: 'site#index'
  get 'events/new', to: 'site#index'
  get 'events/:identifier', to: 'site#index'
  get 'events/:identifier/edit', to: 'site#index'

  get 'register/:identifier', to: 'register#new'
  post 'register/:identifier', to: 'register#create'

  resources :events

  get '/auth/:identifier', to: 'auth#new'
  post '/auth/:identifier', to: 'auth#create'
end