class AddCloseAlertActiveToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :close_alert_active, :boolean
  end
end