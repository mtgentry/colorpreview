class CheckoutSession
  
  class << self
    def init(session)
      session[:plan] ||= {}
    end
    
    def reset(session)
      session[:plan] = {}
    end
    
    def set(session, key, value)
      session[:plan][key.to_s] = value
    end
    
    def get(session, key)
      session[:plan][key.to_s]
    end
    
    def get_all(session)
      Rails.logger.info 'get all data from session'
      Rails.logger.info session[:plan].inspect
      session[:plan]
    end
  end

end