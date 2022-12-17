class ClientsMailer < ApplicationMailer

  def invite(template, client, email)
    @user     = template.user
    @client   = client
    @template = template
    mail :to => email, :subject => "Onboarding request"
  end

  def invoice(invoice, client, email)
    @user     = invoice.user
    @client   = client
    @invoice  = invoice
    mail :to => email, :subject => "Invoice from #{@user.full_name}"
  end


end