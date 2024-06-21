Rails.application.routes.draw do
  root 'pages#index'
  get 'about', to: 'pages#about'

  namespace :api do
    resources :events, only: %i[index show create update destroy]
  end

  get 'events', to: 'site#index'
  get 'events/new', to: 'site#index'
  get 'events/:identifier', to: 'site#index'
  get 'events/:identifier/edit', to: 'site#index'

  resources :events

  get '/auth/:identifier', to: 'auth#new'
  post '/auth/:identifier', to: 'auth#create'
end