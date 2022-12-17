# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

new_colors = [
  { alias: 'analogous', name: 'Analogous',           priority: 1, default: true },
  { alias: 'split',     name: 'Complementary',       priority: 1, default: true },
  { alias: 'triad',     name: 'Triad',               priority: 1, default: true },
  { alias: 'splitc',    name: 'Split-Complementary', priority: 1, default: true },
  { alias: 'square',    name: 'Square',              priority: 1, default: true },
  { alias: 'fresh',     name: 'Fresh',               priority: 2 },
  { alias: 'manga',     name: 'Manga',               priority: 2 },
  { alias: 'nature',    name: 'Nature',              priority: 2 },
  { alias: 'painters',  name: 'Painters',            priority: 2 },
  { alias: 'rich',      name: 'Rich',                priority: 2 }
]

new_colors.each do |nc|
  colors = Color.where(nc).order(id: :asc)
  if colors.size > 1
    colors.each do |c|
      c.user_colors.last.destroy if c.users.size != c.users.uniq.size
    end

    colors.last(colors.size - 1).map(&:destroy)
  else
    color = Color.find_or_initialize_by(nc)
    if color.new_record?
      color.save
    else
      if color.users.size != color.users.uniq.size
        color.user_colors.last.destroy
      end
    end
  end
end

colors = Color.where(default: true).all

User.all.each do |user|
  user.colors = (colors + user.colors).uniq
  user.save
end
