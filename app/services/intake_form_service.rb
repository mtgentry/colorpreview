class IntakeFormService
  
  def initialize(form: nil, user: nil)
    @intake_form = form || IntakeForm.new
    @user        = user
  end

  def create_form(name: nil)
    @intake_form = IntakeForm.new(user: @user)
    @intake_form.name = name || 'Default'
    @intake_form.save
    create_sections
    return @intake_form
  end

  private

  def create_sections
    create_introduction_section
    create_background_section
    create_questions_section
    create_insurance_section
    create_payment_section
  end

  def create_introduction_section
    it_section = IntakeSection.new(name: 'Introduction', intake_form: @intake_form, removable: false, is_intro: true)
    it_section.description = 'Please answer the questions on the following pages so that i can design your treatment for maximum effectiveness.'
    it_section.save
  end

  def create_background_section
    bg_section = IntakeSection.new(name: 'Background', intake_form: @intake_form, is_background: true, removable: false)
    bg_section.save
    create_background_section_questions(bg_section)
  end

  def create_questions_section
    qt_section = IntakeSection.new(name: 'Questions', intake_form: @intake_form)
    qt_section.save
    case @intake_form.name
    when 'Couples'
      create_couples_questions_section_questions(qt_section)
    when 'Child/Adolescent'
      create_ch_ad_questions_section_questions(qt_section)
    else
      create_default_questions_section_questions(qt_section)
    end
  end

  def create_insurance_section
    in_section = IntakeSection.new(name: 'Insurance', intake_form: @intake_form, removable: false, is_insurance: true)
    in_section.save
  end

  def create_payment_section
    pt_section = IntakeSection.new(name: 'Payment', intake_form: @intake_form, removable: false, is_payment: true)
    pt_section.save
  end

  def create_background_section_questions intake_section
    bg_questions_data = [
      {title: 'First', question_type: 'open_ended', required: true}, 
      {title: 'Last', question_type: 'open_ended', required: true}, 
      {title: 'Middle', question_type: 'open_ended'}, 
      {title: 'Email Address', question_type: 'open_ended', required: true}, 
      {title: 'Birthday', question_type: 'open_ended' }, 
      {title: 'Gender', question_type: 'single_choice', variants: [{"title"=>"Male"},
      {"title"=>"Female"}]}, {title: 'Street Address', question_type: 'open_ended'}, 
      {title: 'City', question_type: 'open_ended'}, 
      {title: 'State', question_type: 'open_ended'}, 
      {title: 'Zip', question_type: 'open_ended'}
    ]
    bg_questions_data.each do |question_data|
      new_question = IntakeQuestion.new
      new_question.assign_attributes(question_data)
      new_question.intake_section = intake_section
      new_question.save
    end
  end

  def create_couples_questions_section_questions intake_section
    qt_questions_data = [
      {title: 'What is your relationship status?', question_type: 'multiple_choice',  variants: [{"title"=>"Single"},{"title"=>"In a relationship"},{"title"=>"Married"},{"title"=>"Divorced"}]},
      {title: 'What do you hope to accomplish through counseling?', question_type: 'open_ended'},
      {title: 'What have you already done to deal with your relationship difficulties?', question_type: 'open_ended'},
      {title: 'What are your strengths as a couple?', question_type: 'open_ended'},
      {title: 'On a scale of 1 to 10, please rate your current level of relationship happiness', question_type: 'open_ended'},
      {title: 'Have you received prior couples counseling related to any of the above problems? If yes, please describe the length of treatment and outcome.', question_type: 'single_choice_details',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'Do either you or your partner drink alcohol or take drugs to intoxication? If yes, please describe.', question_type: 'open_ended'},
      {title: 'Do you ever wish your partner would cut back on his/her drinking or drug use?', question_type: 'open_ended'},
      {title: 'Have either you or your partner struck, physically restrained, used violence against or injured the other person?', question_type: 'open_ended'},
      {title: 'Has either of you threatened to separate or divorce (if married) as a result of the current relationship problems?', question_type: 'multiple_choice',  variants: [{"title"=>"Yes"},{"title"=>"No"}]}
    ]
    qt_questions_data.each do |question_data|
      new_question = IntakeQuestion.new
      new_question.assign_attributes(question_data)
      new_question.intake_section = intake_section
      new_question.save
    end
  end

  def create_ch_ad_questions_section_questions intake_section
    qt_questions_data = [
      {title: 'Please describe any areas your child is having problems with. Why did you come to see me?', question_type: 'open_ended'},
      {title: 'Has your child previously been or are they currently in therapy or under the care of a therapist? If Yes, please share their name and phone number. ', question_type: 'single_choice_dropdown',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'List all people living in the same household as the child. Please include names, ages, and their relationship to the child. i.e. Scott / 17 / Brother', question_type: 'open_ended'},
      {title: 'Is your child currently on medication?', question_type: 'single_choice_dropdown',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'Do the child’s parents live together?', question_type: 'single_choice',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'What forms of discipline are used in the home?', question_type: 'open_ended'},
      {title: 'What are some of your child’s fears?', question_type: 'open_ended'},
      {title: 'When was your child’s last physical exam?', question_type: 'open_ended'},
      {title: 'Has your child experienced any physical, sexual or emotional abuse? If yes, please describe.', question_type: 'single_choice_details',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'How would you describe your child’s approach to new situations?', question_type: 'multiple_choice',  variants: [{"title"=>"Positive"},{"title"=>"Withdrawn"},{"title"=>"Cautious"}]},
      {title: 'How would you generally describe your child’s overall mood?', question_type: 'multiple_choice',  variants: [{"title"=>"Positive"},{"title"=>"Negative"},{"title"=>"Mixed"}]},
      {title: 'Has your child ever failed a class or been held back for academic reasons?', question_type: 'single_choice',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'Has the child experienced any prolonged separations or traumatic events?  If yes, please describe.', question_type: 'single_choice_details',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'Were medications taken during pregnancy? If yes, please describe.', question_type: 'single_choice_details',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'Did the birth mother experience any physical or emotional problems during pregnancy?', question_type: 'open_ended'},
      {title: 'Did the birth mother consume alcoholic beverages or abuse any street drugs during pregnancy?  If yes, please describe.', question_type: 'single_choice_details',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'Did your baby experience any problems immediately after birth?  If yes, please describe.', question_type: 'single_choice_details',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'At what age did your child first smile? ( 6 months is average)', question_type: 'open_ended'},
      {title: 'At what age did your child first start to crawl? ( 6-10 months is average)', question_type: 'open_ended'},
      {title: 'At what age did your child first start to walk? ( 1 year is average)', question_type: 'open_ended'},
      {title: 'At what age did your child first speak single words? ( 18 to 24 months is average)', question_type: 'open_ended'},
      {title: 'At what age did your child first feed itself? ( 2 years is average)', question_type: 'open_ended'},
      {title: 'At what age did your child first start toilet training? ( 2.5 to 4 years is average)', question_type: 'open_ended'}
    ]
    qt_questions_data.each do |question_data|
      new_question = IntakeQuestion.new
      new_question.assign_attributes(question_data)
      new_question.intake_section = intake_section
      new_question.save
    end
  end

  def create_default_questions_section_questions intake_section
    default_questions_data = [
      {title: 'Please describe the main difficulty that brought you to see me:', question_type: 'open_ended'},
      {title: 'Have you ever received psychological or counseling services before?', question_type: 'multiple_choice', variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'Are you currently taking any prescription medications? If Yes, please list:', question_type: 'single_choice_details', variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'Have you ever been prescribed psychiatric medication? If Yes, please list:', question_type: 'single_choice_details', variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'How many times a week do you generally exercise?', question_type: 'open_ended'},
      {title: 'Are you currently experiencing overwhelming sadness, grief, or depression? If yes, how long have you felt this way?', question_type: 'single_choice_details',  variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'How do you get along with your present spouse or partner? ', question_type: 'open_ended'},
      {title: 'How much tobacco do you smoke or chew each week?', question_type: 'multiple_choice', variants: [{"title"=>"1 time"},{"title"=>"2 - 3 times"},{"title"=>"5 or more"}]},
      {title: 'How much beer, wine, or liquor do you consume in an average week?', question_type: 'multiple_choice', variants: [{"title"=>"1 drink"},{"title"=>"2 - 3 drinks"},{"title"=>"5 - 7 drinks"},{"title"=>"7+ drinks"}]},
      {title: 'I am experiencing frequent feelings of worry or tension', question_type: 'multiple_choice',  variants: [{"title"=>"Always"},{"title"=>"Often"},{"title"=>"Seldom"},{"title"=>"Never"}]},
      {title: 'How often do you engage in recreational drug use?', question_type: 'multiple_choice',  variants: [{"title"=>"Every day"},{"title"=>"Once a week"},{"title"=>"Few times a month"},{"title"=>"Every few month"}]},
      {title: 'Have you experienced physical, sexual, or emotional abuse? If yes, please describe:', question_type: 'single_choice_details', variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'What his your current employment situation?', question_type: 'open_ended'},
      {title: 'How do you get along with your children and/or your parents?', question_type: 'open_ended'},
      {title: 'Are you currently under treatment for any medical condition? If yes, please describe.', question_type: 'single_choice_details', variants: [{"title"=>"Yes"},{"title"=>"No"}]},
      {title: 'Is there anything else that is important for me as your therapist to know about, and that you have not written about on this form? If yes, please tell me about it here:', question_type: 'single_choice_details', variants: [{"title"=>"Yes"},{"title"=>"No"}]}
    ]
    default_questions_data.each do |question_data|
      new_question = IntakeQuestion.new
      new_question.assign_attributes(question_data)
      new_question.intake_section = intake_section
      new_question.save
    end   
  end
end
