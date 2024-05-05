namespace :db do
  desc "Add unique hash to existing events without existing url_hash"
  task add_unique_hash_to_existing_events: :environment do
    require 'securerandom'

    # url_hashが空のイベントを取得する
    events = Event.where(url_hash: nil)

    events.each do |event|
      # ユニークなハッシュが生成されるまでループする
      loop do
        # ランダムな8文字の16進数のハッシュを生成する
        unique_hash = SecureRandom.hex(16)
        # 生成したハッシュが数字のみからなるかどうかを確認
        next unless unique_hash.match?(/\A\d+\z/)
        # 生成したハッシュが既存のイベントのハッシュと重複しないかチェックする
        unless Event.exists?(url_hash: unique_hash)
          # 重複がない場合はイベントにハッシュをセットしてループを抜ける
          event.url_hash = unique_hash
          event.save
          break
        end
      end
    end

    puts "Unique URL hashes added to existing events without existing url_hash."
  end
end
