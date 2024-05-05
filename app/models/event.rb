class Event < ApplicationRecord
    before_create :generate_unique_url_hash
  
    private
  
    def generate_unique_url_hash
      loop do
        # ランダムな8桁のハッシュを生成
        self.url_hash = SecureRandom.hex(16)
        # ハッシュが数字のみで構成されていないか確認
        next unless url_hash.match?(/\A\d+\z/)
        # 生成したハッシュが既存のイベントと重複しないことを確認
        break unless Event.exists?(url_hash: url_hash)
      end
    end
  end