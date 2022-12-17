class AvatarUploader < CommonUploader
  
  process resize_to_limit: [800, nil]

  version :thumb do
    process :resize_to_limit => [250, nil]
  end

end
