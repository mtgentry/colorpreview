# frozen_string_literal: true

class IntakeAnswerDecorator < BaseDecorator
  def render_answer_form(form, intake_section_form, intake_section: nil)
    partial = question.question_type.to_s
    render partial: "intake_answers/templates/#{partial}", locals: { intake_section: intake_section, f: form, answer: object, intake_section_form: intake_section_form, field_type: get_field_type }
  end

  def checkbox_checked?(option)
    answers_delimiter = SurveyBase.answers_delimiter
    answers = object.answer_text.to_s.split(answers_delimiter)
    answers.include?(option)
  end

  def get_field_type
    case title
    when 'email address', 'email'
      'email'
    when 'password'
      'password'
    when 'birthdate', 'birthday'
      object.answer_text ? 'string' : 'date_select' # TODO
    when 'state'
      'state_select'
    else
      'string'
    end
  end

  private

  def question
    object.intake_question
  end

  def title
    question.title.downcase
  end
end
