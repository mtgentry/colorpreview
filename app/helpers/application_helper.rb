module ApplicationHelper
  include Pagy::Frontend
  
  STATE_LIST = [
    ['AK', 'AK'],
    ['AL', 'AL'],
    ['AR', 'AR'],
    ['AZ', 'AZ'],
    ['CA', 'CA'],
    ['CO', 'CO'],
    ['CT', 'CT'],
    ['DC', 'DC'],
    ['DE', 'DE'],
    ['FL', 'FL'],
    ['GA', 'GA'],
    ['HI', 'HI'],
    ['IA', 'IA'],
    ['ID', 'ID'],
    ['IL', 'IL'],
    ['IN', 'IN'],
    ['KS', 'KS'],
    ['KY', 'KY'],
    ['LA', 'LA'],
    ['MA', 'MA'],
    ['MD', 'MD'],
    ['ME', 'ME'],
    ['MI', 'MI'],
    ['MN', 'MN'],
    ['MO', 'MO'],
    ['MS', 'MS'],
    ['MT', 'MT'],
    ['NC', 'NC'],
    ['ND', 'ND'],
    ['NE', 'NE'],
    ['NH', 'NH'],
    ['NJ', 'NJ'],
    ['NM', 'NM'],
    ['NV', 'NV'],
    ['NY', 'NY'],
    ['OH', 'OH'],
    ['OK', 'OK'],
    ['OR', 'OR'],
    ['PA', 'PA'],
    ['RI', 'RI'],
    ['SC', 'SC'],
    ['SD', 'SD'],
    ['TN', 'TN'],
    ['TX', 'TX'],
    ['UT', 'UT'],
    ['VA', 'VA'],
    ['VT', 'VT'],
    ['WA', 'WA'],
    ['WI', 'WI'],
    ['WV', 'WV'],
    ['WY', 'WY']
  ]
  
  def trial_checker
    if user_signed_in? &&
       !current_user.paid? &&
       (!current_user.expired_plan_modal_show_time || Time.now > (current_user.expired_plan_modal_show_time + 24*3600)) &&
       controller.action_name != 'checkout'
          render partial: 'plans/trial_expired'
    end
  end
  
  def plan_feature_icon(val)
    case val
    when true
      '<span class="glyphicon glyphicon-ok glyphicon-success"></span>'.html_safe
    when false
      '<span class="glyphicon glyphicon-remove glyphicon-error"></span>'.html_safe
    when -1
      'Unlimited'
    else
      val.to_s
    end
  end
  
  def modal(attr = {}, &block)
    render partial: 'layouts/modal', locals: { attr: attr, block: block }
  end

  def plan_detail(plan, type)
    new_stripe = begin 
        if (plan.transform_usage["divide_by"] || plan.amount)
          false
        end
      rescue
        true
      end
    
    if plan
      transform_data, amount = if new_stripe 
        [plan.transform_quantity["divide_by"], plan.unit_amount]
      else
        [plan.transform_usage["divide_by"], plan.amount]
      end

      if type.eql?("amount")
        if transform_data.eql?(2)
          "#{t('pricing.hobbyist')}"
        elsif transform_data.eql?(5)
          "#{t('pricing.professional')}"
        else transform_data.eql?(25)
          "#{t('pricing.business')}"
        end
      elsif type.eql?("desc")
        if transform_data.eql?(2)
          "#{t('pricing.perfect_for_student')}"
        elsif transform_data.eql?(5)
          "#{t('pricing.for_designer')}"
        else transform_data.eql?(25)
          "#{t('pricing.for_medium_sized_team')}"
        end
      elsif type.eql?("price")
        "#{amount / 100}"
      else
        if transform_data.eql?(2)
          "<ul class='plan__get'>
            <li class='basic'>#{t('pricing.5_basic_color')}</li>
            <li>#{t('pricing.license_for_2')}</li>
            <li>#{t('pricing.50_favorites')}</li>
          </ul>".html_safe
        elsif transform_data.eql?(5)
          "<ul class='plan__get'>
            <li class='basic'>#{t('pricing.5_basic_color')}</li>
            <li class='fresh'>#{t('pricing.fresh')}</li>
            <li class='manga'>#{t('pricing.manga')}</li>
            <li class='nature'>#{t('pricing.nature')}</li>
            <li class='painters'>#{t('pricing.painters')}</li>
            <li class='rich'>#{t('pricing.rich')}</li>
            <li>#{t('pricing.license_for_5')}</li>
            <li>#{t('pricing.50_favorites')}</li>
          </ul>".html_safe
        elsif transform_data.eql?(25)
          "<ul class='plan__get'>
            <li class='basic'>#{t('pricing.5_basic_color')}</li>
            <li class='fresh'>#{t('pricing.fresh')}</li>
            <li class='manga'>#{t('pricing.manga')}</li>
            <li class='nature'>#{t('pricing.nature')}</li>
            <li class='painters'>#{t('pricing.painters')}</li>
            <li class='rich'>#{t('pricing.rich')}</li>
            <li>#{t('pricing.license_for_25')}</li>
            <li>#{t('pricing.50_favorites')}</li>
          </ul>".html_safe
        end
      end
    end
  end

  def trial_countdown(counted, type)
    if type.eql?("text")
      counter = 7 - counted
      if counted < 6
        I18n.t('create_page.you_have_session_left', counter: counter)
      elsif counted.eql?(6)
        I18n.t('create_page.you_have_session_left', counter: 1)
      else
        I18n.t("trial_ended_modal.free_trial_ended")
      end
    elsif type.eql?("icon")
      if (counted > 0) && (counted < 7)
        "timer_#{counted}.svg"
      else
        "timer_7.svg"
      end
    end
  end

  def read_cookies_from_tracking(properties, attribute)
    ep = properties.class.eql?(Array) ? properties.first : properties
    if ep["cookies"]
      ep["cookies"][attribute]
    else
      "No Data"
    end
  end

  def freebies_for_selected_country
    # ['United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'Portugal', 'Germany', 'Poland', 'Israel', 'Japan', 'Taiwan']
    selected_countries = ['US', 'UK', 'CA', 'AU', 'FR', 'PT', 'DE', 'PL', 'IL', 'JP', 'TW', 'JA']

    begin
      @tracking_data.country = 'US' if !@tracking_data.country
    rescue 
    end
    if @tracking_data && @tracking_data.country && selected_countries.include?(@tracking_data.country)
      true
    else
      false
    end
  end
end