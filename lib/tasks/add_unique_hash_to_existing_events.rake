namespace :db do
  desc "Add unique hash to existing events"
  task add_unique_hash_to_existing_events: :environment do
    require 'securerandom'

    # すべてのイベントを取得する
    events = Event.all

    events.each do |event|
      # ユニークなハッシュが生成されるまでループする
      loop do
        # ランダムな8文字の16進数のハッシュを生成する
        unique_hash = SecureRandom.hex(8)
        # 生成したハッシュが既存のイベントのハッシュと重複しないかチェックする
        unless Event.exists?(url_hash: unique_hash)
          # 重複がない場合はイベントにハッシュをセットしてループを抜ける
          event.url_hash = unique_hash
          event.save
          break
        end
      end
    end

    puts "Unique URL hashes added to existing events."
  end
end
