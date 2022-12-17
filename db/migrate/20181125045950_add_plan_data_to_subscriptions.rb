class AddPlanDataToSubscriptions < ActiveRecord::Migration[5.2]
  def change
    add_column :subscriptions, :plan_data, :jsonb, default: {}
  end
end
