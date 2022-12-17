# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_05_20_124141) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "ahoy_events", force: :cascade do |t|
    t.bigint "visit_id"
    t.bigint "user_id"
    t.string "name"
    t.jsonb "properties"
    t.datetime "time"
    t.index ["name", "time"], name: "index_ahoy_events_on_name_and_time"
    t.index ["properties"], name: "index_ahoy_events_on_properties", opclass: :jsonb_path_ops, using: :gin
    t.index ["user_id"], name: "index_ahoy_events_on_user_id"
    t.index ["visit_id"], name: "index_ahoy_events_on_visit_id"
  end

  create_table "ahoy_visits", force: :cascade do |t|
    t.string "visit_token"
    t.string "visitor_token"
    t.bigint "user_id"
    t.string "ip"
    t.text "user_agent"
    t.text "referrer"
    t.string "referring_domain"
    t.text "landing_page"
    t.string "browser"
    t.string "os"
    t.string "device_type"
    t.string "country"
    t.string "region"
    t.string "city"
    t.float "latitude"
    t.float "longitude"
    t.string "utm_source"
    t.string "utm_medium"
    t.string "utm_term"
    t.string "utm_content"
    t.string "utm_campaign"
    t.string "app_version"
    t.string "os_version"
    t.string "platform"
    t.datetime "started_at"
    t.index ["user_id"], name: "index_ahoy_visits_on_user_id"
    t.index ["visit_token"], name: "index_ahoy_visits_on_visit_token", unique: true
  end

  create_table "colors", force: :cascade do |t|
    t.string "alias"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "priority", default: 1
    t.text "description", default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque volutpat fringilla laoreet. Pellentesque in porttitor dolor, eu pretium mauris. Aliquam hendrerit ultricies nisl, in congue enim volutpat fringilla."
    t.boolean "default", default: false
  end

  create_table "favorites", force: :cascade do |t|
    t.integer "user_id"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "index"
    t.string "last_pick_color_in_ip"
  end

  create_table "favorites_shared_favorites", id: false, force: :cascade do |t|
    t.bigint "shared_favorite_id"
    t.bigint "favorite_id"
    t.index ["favorite_id"], name: "index_favorites_shared_favorites_on_favorite_id"
    t.index ["shared_favorite_id"], name: "index_favorites_shared_favorites_on_shared_favorite_id"
  end

  create_table "licenses", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "subscription_id"
    t.string "key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "payment_session_id"
    t.index ["payment_session_id"], name: "index_licenses_on_payment_session_id"
    t.index ["subscription_id"], name: "index_licenses_on_subscription_id"
    t.index ["user_id"], name: "index_licenses_on_user_id"
  end

  create_table "payment_attempts", force: :cascade do |t|
    t.string "email"
    t.string "code"
    t.string "type_error"
    t.string "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "payment_sessions", force: :cascade do |t|
    t.bigint "user_id"
    t.jsonb "plan_data", default: {}
    t.string "stripe_checkout_session_id"
    t.string "stripe_payment_intent_id"
    t.string "stripe_event_id"
    t.integer "state", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "amount", default: 0
    t.integer "coupon_amount", default: 0
    t.jsonb "coupon", default: {}
    t.index ["user_id"], name: "index_payment_sessions_on_user_id"
  end

  create_table "shared_favorites", force: :cascade do |t|
    t.string "link"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.string "ip_address"
    t.index ["user_id"], name: "index_shared_favorites_on_user_id"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id"
    t.datetime "last_payment"
    t.string "stripe_subscription_id"
    t.datetime "subscribed_till"
    t.integer "license_count"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "plan_data", default: {}
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "user_colors", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "color_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["color_id"], name: "index_user_colors_on_color_id"
    t.index ["user_id"], name: "index_user_colors_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "stripe_customer"
    t.boolean "close_alert_active"
    t.integer "fav_limit", default: 50
    t.boolean "analytic_admin", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "licenses", "payment_sessions"
  add_foreign_key "licenses", "subscriptions"
  add_foreign_key "licenses", "users"
  add_foreign_key "payment_sessions", "users"
  add_foreign_key "subscriptions", "users"
  add_foreign_key "user_colors", "colors"
  add_foreign_key "user_colors", "users"
end
