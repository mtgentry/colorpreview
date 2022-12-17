class LicensedAccountController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    @user.last_sign_in_ip = request.remote_ip
    respond_to do |format|
      if @user.save
        @user.set_up_default_favorite
        sign_in(@user)
        @user = @user
        format.html { redirect_to account_index_path, notice: 'User was successfully created!' }
      else
        format.html { redirect_to new_licensed_account_path, notice: "Can't create user" } 
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def user_params
    params.require(:user).permit(:email, :password)
  end
end