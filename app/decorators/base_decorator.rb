# frozen_string_literal: true

class BaseDecorator < Draper::Decorator
  include Draper::LazyHelpers
  delegate_all
end
