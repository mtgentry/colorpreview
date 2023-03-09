# frozen_string_literal: true

module ClientsHelper
  def clients_sort_value
    if @clients_search && @clients_search.sorts.present?
      if params[:q] && params[:q][:s] == ['first_name asc', 'last_name asc']
        'full_name asc'
      else
        [@clients_search.sorts.first.name, @clients_search.sorts.first.dir].join(' ')
      end
    end
  end
end
