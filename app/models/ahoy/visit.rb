class Ahoy::Visit < ApplicationRecord
  self.table_name = "ahoy_visits"

  has_many :events, class_name: "Ahoy::Event"
  belongs_to :user, optional: true

  VIEW_ANALYTICS_OPTIONS = ["Today", "Yesterday", "Last 7 Days", "Last 28 Days", "Last 90 Days"]

  def self.filter_analytic_session(filter = {})
  	# visits = Ahoy::Visit.includes(:events).where(started_at: (Date.today-30.days)..Date.today+1.day)
  	visits  = Ahoy::Visit.get_visit_datas(filter)
  	datas   = visits.group_by_day(:started_at).count

  	results = []
  	datas.sort.reverse.each do |key, value|
  	  data  = {}
  	  data['date']        = key
  	  data['visit_count'] = value
  	  # day_visits  = visits.find_all {|v| v.started_at.strftime('%d-%m-%Y') == key.strftime('%d-%m-%Y')}
  	  # event_count = 0
  	  # day_visits.each do |v|
  	  # 	event_count = event_count + v.events.size
  	  # end

  	  # data['event_count'] = event_count

  	  results << data if value > 0
  	end

  	return results
  end

  def self.get_visit_datas(filter = {})
    date_range = filter[:date_range]
    view       = filter[:view]
    view       = "Last 7 Days" if date_range.blank? && view.blank?

    if date_range.present?
      split_date = date_range.gsub(" ", "").split("-")
      start_date = Date::strptime(split_date.first, "%m/%d/%Y").beginning_of_day
      end_date   = Date::strptime(split_date.last, "%m/%d/%Y").end_of_day
    end

    if view.present?
      start_date = Date.today.beginning_of_day             if view.eql?("Today")
      start_date = (Date.today - 1.day).beginning_of_day   if view.eql?("Yesterday")
      start_date = (Date.today - 7.days).beginning_of_day  if view.eql?("Last 7 Days")
      start_date = (Date.today - 28.days).beginning_of_day if view.eql?("Last 28 Days")
      start_date = (Date.today - 90.days).beginning_of_day if view.eql?("Last 90 Days")
      end_date   = view.eql?("Yesterday") ? start_date.end_of_day : Date.today.end_of_day
    end

    visits = Ahoy::Visit.where('started_at BETWEEN ? AND ?', start_date, end_date)
    return visits
  end

  def self.visits_per_day(date)
    date = Date.strptime(date, '%m-%d-%Y')
    Ahoy::Visit.includes(:events).where("DATE(started_at) = ?", date).order(started_at: :desc)
  end
end
