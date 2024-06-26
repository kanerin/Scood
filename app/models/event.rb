class Event < ApplicationRecord
    before_create :generate_unique_url_hash
    has_many :event_times
    has_many :event_users
    has_many :candidates, through: :event_users
    
    private
  
    def generate_unique_url_hash
      loop do
        # ランダムな8桁のハッシュを生成
        self.url_hash = SecureRandom.urlsafe_base64(16)
        # 生成したハッシュが既存のイベントと重複しないことを確認
        break unless Event.exists?(url_hash: url_hash)
      end
    end
  end