class ClientService

  def initialize(client: nil, user: nil)
    @client = client || Client.new
    @user = user
  end

  def create_default
    @client.assign_attributes({
      user: @user, first_name: 'John', last_name: 'Smith', middle_name: 'Ernest',
      email: 'j.smith@gmail.com', phone: '(323) 867-5309', birthdate: '1981-02-08', 
      gender: 'male', address: '123 Hill St', city: 'Los Angeles', state: 'CA', zip: '90036'
    })
    @client.save
    create_insurance
    create_payment

    create_default_event
    return @client
  end

  private

  def create_insurance
    insurance = Insurance.new(client: @client, subscriber_first_name: @client.first_name, 
      subscriber_last_name: @client.last_name, subscriber_birthdate: @client.birthdate)
    insurance.assign_attributes({
      angency_name: 'Anthem Blue Cross', insured_id: 'ZGP128451935', group_policy: '128432',
      angency_phone: '(888) 568-3560', mailing_address: 'P.O Box 272540', city: 'Chico', state: 'CA',
      zip: '95927-2540',
      copay_amount: 0.0, authorization: '9384290'
    })
    insurance.save
  end

  def create_payment
    payment = Payment.new(client: @client, first_name: @client.first_name, last_name: @client.last_name)
    payment.save
  end

  def create_default_event
    start_date = Time.now.beginning_of_week(:tuesday).asctime.in_time_zone(@user.timezone).change(hour: 12)
    event = Event.new(client: @client, start: start_date, minutes: 50, is_weekly: true)
    event.save
  end

end