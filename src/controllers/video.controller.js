exports.uploadvideo = async (req, res) => {
  try {
    // If no file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // File information is available in req.file
    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error });
  }
};
