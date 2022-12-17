class AccountController < ApplicationController
  respond_to :html

  def index
    @user = current_user
  end
  
  def license
    key = license_params[:key].gsub(/\s/,'')
    license = License.find_by({ key: key })
    respond_to do |format|
      if current_user.activate_license(license)
        format.html { redirect_to account_index_path, notice: 'Your license has been activated!' }
      else
        format.html { redirect_to account_index_path, notice: "Can't activate license" }
      end 
    end
  end

  def update
    @user = current_user
    respond_to do |format|
      if current_user.update(account_params)
        format.html { redirect_to account_index_path, notice: 'User was successfully updated.' }
      else
        format.html { render :index } 
        format.json { render json: current_user.errors, status: :unprocessable_entity }
      end
    end
  end

  def account_valid_stripe
    if current_user
      response = current_user.email.eql?(params[:email]) && current_user.valid_password?(params[:password]) ? "valid" : "not valid"
    else
      emails = User.all.map(&:email)
      response = "not registered"
      if emails.include?(params[:email])
        response = "is already registered"
      end
    end

    render json: { message: response }
  end

  def check_coupon
    @coupons = begin 
                Stripe::Coupon.retrieve(params[:coupon])
               rescue
                false
               end

    render json: @coupons
  end

  private

  def license_params
    params.require(:license).permit(:key)
  end

  def account_params
    params.require(:user).permit(:email, :password)
  end
end