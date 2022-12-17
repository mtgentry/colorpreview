class AnalyticsController < ApplicationController
  before_action :validate_user_analytic, only: [:index, :analytics_daily,  :analytics_details]
  before_action :get_analytic_period, only: [:index]

  def index
    @ahoy_visits        = Ahoy::Visit.filter_analytic_session(params[:filter])
    @pagy, @ahoy_visits = pagy_array(@ahoy_visits, items: 10)
  end

  def analytics_daily
    @ahoy_visits = Ahoy::Visit.visits_per_day(params[:date])
  end

  def analytics_details
    @ahoy_visit  = Ahoy::Visit.find(params[:visit_id])
    @ahoy_events = @ahoy_visit.events.order(time: :desc)
  end

  private

  def validate_user_analytic
    if !current_user.analytic_admin
      flash[:alert] = "You are not allowed to visit this page."
      redirect_to account_index_path 
    end
  end

  def get_analytic_period
    params[:filter] ||= {}
    view              = params[:filter]["view"]
    date_range        = params[:filter]["date_range"]

    if date_range.present?
      split_date      = date_range.gsub(" ", "").split("-")
      @start_analytic = Date.strptime(split_date.first, '%m/%d/%Y')
      @end_analytic   = Date.strptime(split_date.last, '%m/%d/%Y')
    elsif view.present?
      @start_analytic = Date.today             if view.eql?("Today")
      @start_analytic = (Date.today - 1.day)   if view.eql?("Yesterday")
      @start_analytic = (Date.today - 7.days)  if view.eql?("Last 7 Days")
      @start_analytic = (Date.today - 28.days) if view.eql?("Last 28 Days")
      @start_analytic = (Date.today - 90.days) if view.eql?("Last 90 Days")
      @end_analytic   = view.eql?("Yesterday") ? @start_analytic.to_date : Date.today.to_date
    else
      @start_analytic = (Date.today - 7.days).to_date
      @end_analytic   = (Date.today).to_date
    end
  end
end