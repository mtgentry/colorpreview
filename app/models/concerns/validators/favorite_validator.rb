# frozen_string_literal: true

module Validators
  class FavoriteValidator < ActiveModel::Validator
    include Validators::BaseValidator

    def validate(record)
      duplicate?(record)
      reach_limit?(record)
      no_errors?(record)
    end

    def duplicate?(record)
      options = { last_pick_color_in_ip: record.last_pick_color_in_ip, color: record.color }
      return true unless ::Favorite.where(options).where.not(id: record.id).any?

      add_error(
        record,
        'Color exist',
        'This color is already on your favorite list'
      )
    end

    def reach_limit?(_record)
      true

      # fav_limit = Favorite.where(last_pick_color_in_ip: request.remote_ip).count >= 50
      # return true unless fav_limit

      # add_error(
      #   record,
      #   'Limit reached',
      #   'Your favorite list has reached the limit'
      # )
    end
  end
end
