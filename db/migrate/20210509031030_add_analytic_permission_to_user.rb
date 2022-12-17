class AddAnalyticPermissionToUser < ActiveRecord::Migration[5.2]
  def change
  	add_column :users, :analytic_admin, :boolean, default: false
  end
end
