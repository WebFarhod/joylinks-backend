const Banner = require("../models/banner.model");
const Course = require("../models/course.model");

// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const course = await Course.findById({ _id: req.body.course_id });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    res.status(500).json({ message: "Failed to create banner", error });
  }
};

// Get all banners
exports.getBanners = async (req, res) => {
  try {
    const filter = {};

    if (req.query.is_active) {
      filter.is_active = req.query.is_active === 'true';
    }

    const banners = await Banner.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'courses',
          localField: 'course_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $project: {
          _id: 1,
          title: 1,
          img: 1,
          'course._id': 1,
          'course.name': 1,
          createdAt: 1,
          updatedAt: 1,
          is_active: 1
        }
      }
    ]);

    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve banners", error });
  }
};


// Get a single banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id).populate({
      path: "course_id",
      select: "name _id",
    });
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve banner", error });
  }
};


// Update a banner by ID
exports.updateBanner = async (req, res) => {
  try {
    const { title, img, course_id } = req.body;

    const course = await Course.findById({ _id: course_id });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { title, img, course_id },
      { new: true }
    );
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json({ message: "Banner updated successfully", banner });
  } catch (error) {
    res.status(500).json({ message: "Failed to update banner", error });
  }
};

// Delete a banner by ID
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete banner", error });
  }
};
