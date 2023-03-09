# frozen_string_literal: true

module Validators
  module BaseValidator
    extend ActiveSupport::Concern

    included do
      def add_error(record, title = nil, message = nil)
        return false if record.blank? || title.blank? || message.blank?

        record.errors.add(title, message)
      end

      def no_errors?(record)
        return false if record.errors.present?

        true
      end
    end
  end
end
