json.extract! payment_attempt, :id, :created_at, :updated_at
json.url payment_attempt_url(payment_attempt, format: :json)
