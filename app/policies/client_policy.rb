class ClientPolicy < ApplicationPolicy
  
  def create?
    user.paid?
  end
  
  class Scope < Scope
    def resolve
      scope
    end
  end
end
