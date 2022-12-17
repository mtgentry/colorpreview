class AddDescriptionToColors < ActiveRecord::Migration[5.2]
  def change
    add_column :colors, :description, :text, default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat fringilla laoreet. Pellentesque in porttitor dolor, eu pretium mauris. Aliquam hendrerit ultricies nisl, in congue enim volutpat fringilla.'
  end
end
