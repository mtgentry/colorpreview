# frozen_string_literal: true

class PaymentAttemptsController < ApplicationController
  before_action :validate_user_analytic, only: %i[index show destroy]
  before_action :set_payment_attempt, only: %i[show edit update destroy]

  # GET /payment_attempts
  # GET /payment_attempts.json
  def index
    @payment_attempts = PaymentAttempt.all
  end

  # GET /payment_attempts/1
  # GET /payment_attempts/1.json
  def show; end

  # POST /payment_attempts
  # POST /payment_attempts.json
  def create
    @payment_attempt = PaymentAttempt.new(payment_attempt_params)
    @payment_attempt.save

    respond_to do |format|
      format.json { head :no_content }
    end
  end

  # DELETE /payment_attempts/1
  # DELETE /payment_attempts/1.json
  def destroy
    @payment_attempt.destroy
    respond_to do |format|
      format.html { redirect_to payment_attempts_url, notice: 'Payment attempt was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_payment_attempt
    @payment_attempt = PaymentAttempt.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def payment_attempt_params
    params.require(:payment_attempt).permit(:email, :code, :type_error, :message)
  end

  def validate_user_analytic
    return unless (current_user && !current_user.analytic_admin) || !current_user

    flash[:alert] = 'You are not allowed to visit this page.'
    redirect_to account_index_path
  end
end
