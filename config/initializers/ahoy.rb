# frozen_string_literal: true

module Ahoy
  class Store < Ahoy::DatabaseStore; end
end

# set to true for JavaScript tracking
Ahoy.api = false

# set to true for geocoding
# we recommend configuring local geocoding first
# see https://github.com/ankane/ahoy#geocoding
Ahoy.geocode = true

Ahoy.visit_duration = 24.hours
